/* ============================================================
   FIND — Header auth state + notifications
   - يبدّل الهيدر بين وضع الزائر ووضع المستخدم المسجّل دخوله.
   - يحسب الإشعارات والرسائل غير المقروءة ويعرضها كنقطة حمراء
     على زر الاسم وعدّاد أحمر داخل القائمة.
   - يعرض إشعاراً منبثقاً (toast) أول ما يدخل المستخدم الموقع لو
     عنده طلب تواصل ما شافه، أو لحظة وصول طلب جديد (Realtime).
   ============================================================ */

/* أنواع الإشعارات اللي تظهر للمستخدم: طلبات التواصل والرد عليها.
   إشعارات "يوجد بلاغ مشابه" (new_match) و "رسالة جديدة" (new_message)
   مخفية — الرسائل لها عدّادها الخاص على "المحادثات".
   لو تبي طلبات التواصل فقط، خلّها: ["new_claim"] */
const VISIBLE_NOTIF_TYPES = ["new_claim", "claim_approved", "claim_rejected"];

const NOTIF_TEXT = {
  new_claim: {
    ar: ["طلب تواصل جديد", "صاحب بلاغ مطابق يعتقد إن هذا الغرض يخصه ويطلب التواصل معك."],
    en: ["New contact request", "The owner of a matching report thinks this item is theirs and wants to contact you."],
  },
  claim_approved: {
    ar: ["تمت الموافقة على طلب تواصلك", "تقدر الحين تفتح المحادثة وتتفق على تسليم الغرض."],
    en: ["Your contact request was approved", "You can now open the chat and arrange the handover."],
  },
  claim_rejected: {
    ar: ["تم رفض طلب تواصلك", "صاحب البلاغ الآخر رفض الطلب."],
    en: ["Your contact request was declined", "The other report's owner declined the request."],
  },
};

const HEADER_TEXT = {
  ar: { newMany: (n) => `عندك ${n} إشعارات جديدة`, view: "عرض الإشعارات", close: "إغلاق" },
  en: { newMany: (n) => `You have ${n} new notifications`, view: "View notifications", close: "Close" },
};

function headerLang() { return localStorage.getItem("find_lang") || "ar"; }
function headerText() { return HEADER_TEXT[headerLang()] || HEADER_TEXT.ar; }

/** عنوان ونص الإشعار حسب نوعه واللغة الحالية */
function notifText(n, L = headerLang()) {
  const t = NOTIF_TEXT[n.type];
  if (t) return { title: t[L][0], body: t[L][1] };
  return { title: L === "ar" ? n.title_ar : n.title_en, body: "" };
}

/* ---------- العدّادات والنقطة الحمراء ---------- */
let headerNotifCount = 0;
let headerChatCount = 0;

function setMenuBadge(id, n) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = n > 9 ? "9+" : String(n);
  el.hidden = !(n > 0);
}

function syncChipDot() {
  const dot = document.getElementById("chipDot");
  if (dot) dot.hidden = headerNotifCount + headerChatCount === 0;
}

function updateNotifBadge(n) {
  headerNotifCount = Math.max(0, n || 0);
  setMenuBadge("notifBadge", headerNotifCount);
  syncChipDot();
}

function updateChatBadge(n) {
  headerChatCount = Math.max(0, n || 0);
  setMenuBadge("chatBadge", headerChatCount);
  syncChipDot();
}

/* ---------- الإشعار المنبثق (Toast) ---------- */
function getToastStack() {
  let stack = document.getElementById("findToastStack");
  if (!stack) {
    stack = document.createElement("div");
    stack.id = "findToastStack";
    stack.className = "find-toast-stack";
    stack.setAttribute("aria-live", "polite");
    document.body.appendChild(stack);
  }
  return stack;
}

const TOAST_ICONS = {
  info:  '<path d="M12 3a5 5 0 0 0-5 5v3.5c0 .8-.3 1.5-.8 2.1L5 15.5h14l-1.2-2A3.3 3.3 0 0 1 17 11.5V8a5 5 0 0 0-5-5z"/><path d="M9.5 18.5a2.5 2.5 0 0 0 5 0"/>',
  error: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><circle cx="12" cy="16.5" r="0.6" fill="currentColor"/>',
};

function showFindToast({ title, body = "", href = "", actionLabel = "", tone = "info", duration = 9000 }) {
  const toast = document.createElement("div");
  toast.className = `find-toast tone-${tone}`;
  toast.setAttribute("role", "status");
  toast.innerHTML = `
    <div class="find-toast-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${TOAST_ICONS[tone] || TOAST_ICONS.info}</svg>
    </div>
    <div class="find-toast-body">
      <div class="find-toast-title"></div>
      <div class="find-toast-text"></div>
      <a class="find-toast-action"></a>
    </div>
    <button type="button" class="find-toast-close">✕</button>
  `;

  toast.querySelector(".find-toast-title").textContent = title;

  const textEl = toast.querySelector(".find-toast-text");
  if (body) textEl.textContent = body; else textEl.remove();

  const actionEl = toast.querySelector(".find-toast-action");
  if (href) { actionEl.href = href; actionEl.textContent = actionLabel; } else actionEl.remove();

  const closeBtn = toast.querySelector(".find-toast-close");
  closeBtn.setAttribute("aria-label", headerText().close);

  let removed = false;
  const remove = () => {
    if (removed) return;
    removed = true;
    toast.classList.add("is-leaving");
    setTimeout(() => toast.remove(), 260);
  };
  closeBtn.addEventListener("click", remove);
  if (duration) setTimeout(remove, duration);

  getToastStack().appendChild(toast);
}

function rememberToasted(id) {
  try { sessionStorage.setItem("find_toasted_notif", id); } catch (_) {}
}
function alreadyToasted(id) {
  try { return sessionStorage.getItem("find_toasted_notif") === id; } catch (_) { return false; }
}

/* ---------- الإشعارات غير المقروءة (عند فتح أي صفحة) ---------- */
async function loadUnreadNotifications(userId) {
  const { data, count, error } = await supabaseClient
    .from("notifications")
    .select("id, type, title_ar, title_en, created_at", { count: "exact" })
    .eq("user_id", userId)
    .eq("is_read", false)
    .in("type", VISIBLE_NOTIF_TYPES)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) { console.warn("unread notifications:", error.message); return; }

  updateNotifBadge(count || 0);

  // الإشعار المنبثق يطلع مرة وحدة لكل إشعار جديد (مو بكل تنقّل بين الصفحات)
  const latest = data && data[0];
  if (!latest || alreadyToasted(latest.id)) return;
  rememberToasted(latest.id);

  const info = notifText(latest);
  const many = (count || 0) > 1;
  showFindToast({
    title: many ? headerText().newMany(count) : info.title,
    body: many ? info.title : info.body,
    href: "notifications.html",
    actionLabel: headerText().view,
  });
}

/* ---------- الرسائل غير المقروءة (عدّاد "المحادثات") ---------- */
async function loadUnreadMessages(userId) {
  const { data: convs, error: convErr } = await supabaseClient
    .from("conversations")
    .select("id")
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`);

  if (convErr) { console.warn("conversations:", convErr.message); return; }

  const ids = (convs || []).map(c => c.id);
  if (ids.length === 0) { updateChatBadge(0); return; }

  const { count, error } = await supabaseClient
    .from("messages")
    .select("id", { count: "exact", head: true })
    .in("conversation_id", ids)
    .eq("is_read", false)
    .neq("sender_id", userId);

  if (!error) updateChatBadge(count || 0);
}

/* ---------- وصول إشعار جديد لحظياً (Realtime) ---------- */
function subscribeToNotifications(userId, page) {
  supabaseClient
    .channel(`notif-${userId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
      (payload) => {
        const n = payload.new;
        if (!VISIBLE_NOTIF_TYPES.includes(n.type)) return;

        // بصفحة الإشعارات نفسها: نحدّث القائمة مباشرة بدل الـ toast
        if (page === "notifications") {
          if (typeof window.onFindNotification === "function") window.onFindNotification(n);
          return;
        }

        updateNotifBadge(headerNotifCount + 1);
        rememberToasted(n.id);
        const info = notifText(n);
        showFindToast({ title: info.title, body: info.body, href: "notifications.html", actionLabel: headerText().view });
      }
    )
    .subscribe();
}

/* ---------- حالة الهيدر ---------- */
async function refreshHeaderAuthState() {
  const guestBlock = document.getElementById("authGuest");
  const userBlock = document.getElementById("authUser");
  const nameEl = document.getElementById("authUserName");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!guestBlock || !userBlock) return;

  const profile = await getCurrentProfile();

  if (profile) {
    guestBlock.hidden = true;
    userBlock.hidden = false;
    if (nameEl) nameEl.textContent = profile.full_name;

    const adminLink = document.getElementById("adminLink");
    if (adminLink) adminLink.hidden = profile.role !== "admin";

    // صفحة الإشعارات وصفحة المحادثات يحدّثون عدّاداتهم بنفسهم
    const page = document.body.dataset.page || "";
    if (page !== "notifications") loadUnreadNotifications(profile.id);
    if (page !== "chat") loadUnreadMessages(profile.id);
    subscribeToNotifications(profile.id, page);
  } else {
    guestBlock.hidden = false;
    userBlock.hidden = true;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try { sessionStorage.removeItem("find_toasted_notif"); } catch (_) {}
      await logoutUser();
      window.location.href = "index.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", refreshHeaderAuthState);