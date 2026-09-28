/* ============================================================
   FIND — Shared header (injected into every page)
   عدّل هذا الملف فقط عشان يتغيّر الهيدر بكل الصفحات دفعة وحدة.
   ============================================================ */

function renderHeader() {
  const mount = document.getElementById("site-header-mount");
  if (!mount) return;

  mount.innerHTML = `
    <header class="site-header">
      <div class="container">
        <a href="index.html" class="brand">
          <span class="brand-mark">F</span>
          <span>FIND</span>
        </a>

        <nav class="main-nav">
          <a href="report.html" data-i18n="nav.filing">تقديم بلاغ</a>
          <a href="about.html" data-i18n="nav.about">عن المنصة</a>
          <a href="matches.html" data-i18n="nav.notifications">بلاغات</a>
        </nav>

        <div class="header-actions">
          <button class="lang-switch" data-lang-switch>English</button>

          <div id="authGuest" class="flex gap-2">
            <a href="signup.html" class="btn btn-ghost" data-i18n="nav.signup">إنشاء حساب</a>
            <a href="login.html" class="btn btn-gold" data-i18n="nav.login">تسجيل الدخول</a>
          </div>

          <div id="authUser" class="user-menu" hidden>
            <button id="userMenuToggle" class="user-chip" type="button">
              <span id="authUserName"></span>
              <span id="chipDot" class="chip-dot" hidden></span>
            </button>
            <div id="userMenu" class="user-dropdown" hidden>
              <a href="my-reports.html" data-i18n="menu.myReports">بلاغاتي</a>
              <a href="chat.html" class="menu-row">
                <span data-i18n="menu.chat">المحادثات</span>
                <span id="chatBadge" class="menu-badge" hidden></span>
              </a>
              <a href="profile.html" data-i18n="menu.myProfile">ملفي الشخصي</a>
              <a href="notifications.html" class="menu-row">
                <span data-i18n="menu.notifications">إشعارات</span>
                <span id="notifBadge" class="menu-badge" hidden></span>
              </a>
              <button id="logoutBtn" type="button" data-i18n="menu.logout">تسجيل الخروج</button>
            </div>
          </div>

          <a href="admin-dashboard.html" id="adminLink" class="btn btn-ghost" hidden style="border-color:rgba(255,255,255,0.35);color:var(--paper-0)" data-i18n="menu.admin">لوحة التحكم</a>
        </div>
      </div>
    </header>
  `;

  const toggle = document.getElementById("userMenuToggle");
  const menu = document.getElementById("userMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.hidden = !menu.hidden;
    });
    document.addEventListener("click", (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.hidden = true;
      }
    });
  }
}

/* ---------- خلفية شبكة الموجة لكل الصفحات ----------
   الرئيسية وعن المنصة فيهم canvas وسكربت particle-bg.js أصلاً،
   فنتجاهلهم. أي صفحة ثانية نضيف لها الـ canvas ونحمّل السكربت
   تلقائياً — بدون ما نعدّل ملفات HTML وحدة وحدة. */
function ensureBackgroundMesh() {
  if (document.getElementById("bg-canvas")) return;

  const canvas = document.createElement("canvas");
  canvas.id = "bg-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const script = document.createElement("script");
  script.src = "js/particle-bg.js";
  document.body.appendChild(script);
}

renderHeader();
ensureBackgroundMesh();