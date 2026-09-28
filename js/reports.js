/* ============================================================
   FIND — Reports logic
   رفع الصورة لـ Storage + حساب بصمة المطابقة (dHash) + حفظ البلاغ
   ============================================================ */

const MAX_IMAGE_MB = 5;

/**
 * حساب بصمة الصورة (Difference Hash — dHash).
 * تصغّر الصورة لـ 9×8 بكسل بالأبيض والأسود، وتقارن كل بكسل
 * بجاره على اليمين: 1 إذا أغمق، 0 إذا أفتح. الناتج 64 بت = 16 محرف hex،
 * بنفس الصيغة اللي تتوقعها دالة phash_hamming بقاعدة البيانات.
 */
function computeImageHash(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const w = 9, h = 8;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);

      const { data } = ctx.getImageData(0, 0, w, h);
      const gray = [];
      for (let i = 0; i < data.length; i += 4) {
        gray.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      }

      let bits = "";
      for (let row = 0; row < h; row++) {
        for (let col = 0; col < w - 1; col++) {
          const left = gray[row * w + col];
          const right = gray[row * w + col + 1];
          bits += left > right ? "1" : "0";
        }
      }

      // تحويل 64 بت إلى 16 محرف hex
      let hex = "";
      for (let i = 0; i < 64; i += 4) {
        hex += parseInt(bits.substr(i, 4), 2).toString(16);
      }

      URL.revokeObjectURL(url);
      resolve(hex);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("تعذّرت قراءة الصورة"));
    };

    img.src = url;
  });
}

/**
 * رفع الصورة لـ Supabase Storage وإرجاع رابط موقّع طويل الأمد.
 * الحاوية (bucket) خاصة وليست عامة، فالرابط الموقّع هو وسيلة
 * الوصول الوحيدة — ويُخزَّن هذا الرابط بعمود image_url بجدول reports،
 * فما ينكشف إلا لمن يحق له رؤية البلاغ أصلاً (عبر سياسات RLS).
 */
async function uploadReportImage(file, userId) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabaseClient
    .storage
    .from("report-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (uploadError) throw uploadError;

  const TEN_YEARS = 60 * 60 * 24 * 365 * 10;
  const { data, error: signError } = await supabaseClient
    .storage
    .from("report-images")
    .createSignedUrl(path, TEN_YEARS);

  if (signError) throw signError;
  return data.signedUrl;
}

/**
 * حفظ بلاغ جديد (مفقود أو موجود) بالكامل:
 * يتحقق من الجلسة، يرفع الصورة إذا وُجدت، يحسب بصمتها،
 * ثم يُدرج صف reports. المطابقة التلقائية تشتغل بعدها تلقائياً
 * عبر trigger بقاعدة البيانات — ما نحتاج نستدعيها يدوياً.
 */
async function submitReport({
  type,             // "lost" أو "found"
  title,
  categoryId,
  description,
  locationId,
  eventDate,
  eventTime,
  imageFile,        // File أو null
}) {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    return { data: null, error: { message: "NOT_LOGGED_IN" } };
  }

  if (imageFile && imageFile.size > MAX_IMAGE_MB * 1024 * 1024) {
    return { data: null, error: { message: "IMAGE_TOO_LARGE" } };
  }

  let imageUrl = null;
  let imageHash = null;

  try {
    if (imageFile) {
      [imageUrl, imageHash] = await Promise.all([
        uploadReportImage(imageFile, session.user.id),
        computeImageHash(imageFile),
      ]);
    }
  } catch (err) {
    console.error("image processing failed:", err);
    return { data: null, error: { message: "IMAGE_UPLOAD_FAILED" } };
  }

  const { data, error } = await supabaseClient
    .from("reports")
    .insert({
      user_id: session.user.id,
      type,
      category_id: Number(categoryId),
      location_id: Number(locationId),
      title,
      description,
      event_date: eventDate,
      event_time: eventTime || null,
      image_url: imageUrl,
      image_hash: imageHash,
    })
    .select()
    .single();

  return { data, error };
}