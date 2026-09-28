/* ============================================================
   FIND — Auth logic
   الدخول والتسجيل يتمّان بالرقم الجامعي فقط. بما أن Supabase
   يشترط إيميلاً داخلياً، نبني واحداً تلقائياً من الرقم الجامعي
   ولا يظهر للمستخدم أبداً:  2270020030 -> 2270020030@find.iau.local
   ============================================================ */

const UNIVERSITY_EMAIL_DOMAIN = "find.iau.local";

function buildInternalEmail(universityId) {
  return `${universityId.trim()}@${UNIVERSITY_EMAIL_DOMAIN}`;
}

/**
 * إنشاء حساب جديد.
 * الحقول الإضافية تُمرَّر في options.data فتصل لدالة handle_new_user()
 * في قاعدة البيانات (المُعرَّفة بالمرحلة 1) وتُنشئ صف profiles تلقائياً.
 */
async function signUpUser({ fullName, universityId, userType, phone, password }) {
  const email = buildInternalEmail(universityId);
  return await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        university_id: universityId,
        user_type: userType,
        phone: phone,
      },
    },
  });
}

async function loginUser({ universityId, password }) {
  const email = buildInternalEmail(universityId);
  return await supabaseClient.auth.signInWithPassword({ email, password });
}

async function logoutUser() {
  await supabaseClient.auth.signOut();
}

/** يرجع صف profiles الخاص بالمستخدم الحالي، أو null إذا ما كان مسجّل دخول */
async function getCurrentProfile() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return null;

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("getCurrentProfile:", error.message);
    return null;
  }
  return data;
}
