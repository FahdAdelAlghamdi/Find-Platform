/* ============================================================
   FIND — لوحة المطابقة المتحركة بالصفحة الرئيسية
   تحكي قصة قصيرة: شخص فقد جواله بالمكتبة أمس، وشخص ثاني لقى
   جوال بنفس المكان اليوم. النظام يفحص المعايير الأربعة وحدة
   وحدة، وكل معيار يضيف وزنه الحقيقي من خوارزمية المطابقة:
   الوصف 35 + الصورة 25 + الموقع 20 + الوقت 20 = 100%
   ثم "تم العثور على تطابق" وتعيد الدورة من البداية.
   - تتوقف لما اللوحة تطلع من الشاشة أو التبويب يكون مخفي.
   - لو المستخدم مفعّل "تقليل الحركة" تظهر النتيجة النهائية بس.
   - ميلان ثلاثي الأبعاد خفيف مع حركة الماوس.
   لا تعتمد على أي مكتبة خارجية.
   ============================================================ */

(function () {
  const root = document.getElementById("matchVisual");
  if (!root) return;

  const stage      = document.getElementById("mvStage");
  const scoreEl    = document.getElementById("mvScore");
  const bar        = document.getElementById("mvScoreBar");
  const statusEl   = document.getElementById("mvStatus");
  const statusText = document.getElementById("mvStatusText");
  const sparksEl   = document.getElementById("mvSparks");
  const nodes  = Array.from(root.querySelectorAll(".mv-node"));
  const spokes = Array.from(root.querySelectorAll(".mv-spoke"));

  const CIRC  = 2 * Math.PI * 66;          // محيط حلقة النسبة (r = 66)
  const STEPS = [35, 60, 80, 100];         // المجموع بعد كل معيار: 35 + 25 + 20 + 20
  const FIRST_DELAY = 1100;                // وقت البحث قبل أول معيار
  const STEP_GAP    = 900;                 // الوقت بين كل معيار والثاني
  const HOLD_FOUND  = 4500;                // مدة عرض "تم العثور على تطابق"

  const TEXT = {
    ar: {
      scanning:   "جارِ البحث عن بلاغ مطابق…",
      checking:   ["مقارنة الوصف…", "مقارنة الصورة…", "مقارنة الموقع…", "مقارنة الوقت…"],
      found:      "تم العثور على تطابق — وصل إشعار للطرفين",
      lostTitle:  "آيفون 14 أسود",
      lostMeta:   "فُقد في المكتبة المركزية · أمس",
      foundTitle: "جوال آيفون أسود",
      foundMeta:  "وُجد في المكتبة المركزية · اليوم",
    },
    en: {
      scanning:   "Searching for a matching report…",
      checking:   ["Comparing description…", "Comparing photo…", "Comparing location…", "Comparing time…"],
      found:      "Match found — both sides notified",
      lostTitle:  "Black iPhone 14",
      lostMeta:   "Lost at the Central Library · yesterday",
      foundTitle: "Black iPhone",
      foundMeta:  "Found at the Central Library · today",
    },
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let current = 0;
  let status = { key: "scanning", index: 0 };
  let timers = [];
  let tweenRaf = 0;
  let running = false;
  let inView = false;

  function t() {
    const lang = localStorage.getItem("find_lang") || "ar";
    return TEXT[lang] || TEXT.ar;
  }

  /* ---------- نصوص البطاقتين ---------- */
  function renderCards() {
    const T = t();
    const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    set("mvLostTitle", T.lostTitle);
    set("mvLostMeta", T.lostMeta);
    set("mvFoundTitle", T.foundTitle);
    set("mvFoundMeta", T.foundMeta);
  }

  /* ---------- سطر الحالة ---------- */
  function renderStatus() {
    const T = t();
    statusText.textContent = status.key === "checking" ? T.checking[status.index] : T[status.key];
    statusEl.classList.toggle("is-found", status.key === "found");
  }
  function setStatus(key, index = 0) {
    status = { key, index };
    renderStatus();
  }

  /* ---------- نسبة التطابق ---------- */
  function setScore(v) {
    current = v;
    scoreEl.textContent = Math.round(v) + "%";
    bar.style.strokeDashoffset = String(CIRC * (1 - v / 100));
  }
  function tweenScore(to, ms = 700) {
    cancelAnimationFrame(tweenRaf);
    const from = current;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setScore(from + (to - from) * eased);
      if (p < 1) tweenRaf = requestAnimationFrame(step);
    };
    tweenRaf = requestAnimationFrame(step);
  }

  /* ---------- شرارات ذهبية لحظة التطابق ---------- */
  if (sparksEl) {
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("span");
      s.className = "mv-spark";
      s.style.setProperty("--a", (i * (360 / 14)).toFixed(1) + "deg");
      s.style.setProperty("--d", (0.75 + (i % 3) * 0.2).toFixed(2));
      sparksEl.appendChild(s);
    }
  }

  /* ---------- التوقيت ---------- */
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function stopAll() {
    timers.forEach(clearTimeout);
    timers = [];
    cancelAnimationFrame(tweenRaf);
  }

  /* ---------- مراحل الدورة ---------- */
  function reset() {
    stage.classList.remove("is-matched");
    stage.classList.add("is-scanning");
    nodes.forEach((n) => n.classList.remove("is-on"));
    spokes.forEach((s) => s.classList.remove("is-on"));
    setScore(0);
    setStatus("scanning");
  }

  function lightNode(i) {
    nodes[i].classList.add("is-on");
    if (spokes[i]) spokes[i].classList.add("is-on");
    setStatus("checking", i);
    tweenScore(STEPS[i]);
  }

  function showMatch() {
    stage.classList.remove("is-scanning");
    stage.classList.add("is-matched");
    setStatus("found");
  }

  function cycle() {
    stopAll();
    reset();
    STEPS.forEach((_, i) => later(() => lightNode(i), FIRST_DELAY + i * STEP_GAP));
    const done = FIRST_DELAY + STEPS.length * STEP_GAP + 300;
    later(showMatch, done);
    later(cycle, done + HOLD_FOUND);
  }

  function showFinalState() {
    stopAll();
    nodes.forEach((n) => n.classList.add("is-on"));
    spokes.forEach((s) => s.classList.add("is-on"));
    setScore(STEPS[STEPS.length - 1]);
    showMatch();
  }

  function start() {
    if (running) return;
    running = true;
    cycle();
  }
  function pause() {
    if (!running) return;
    running = false;
    stopAll();
  }

  /* ---------- التشغيل ---------- */
  bar.style.strokeDasharray = String(CIRC);
  setScore(0);
  renderCards();

  if (reduced) {
    showFinalState();
  } else {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        if (inView && !document.hidden) start(); else pause();
      }, { threshold: 0.25 }).observe(root);
    } else {
      inView = true;
      start();
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pause();
      else if (inView) start();
    });

    /* ---------- ميلان ثلاثي الأبعاد مع الماوس ---------- */
    if (window.matchMedia("(pointer: fine)").matches) {
      const hero = root.closest(".hero") || root;
      const clamp = (v) => Math.max(-1, Math.min(1, v));
      hero.addEventListener("mousemove", (e) => {
        const r = root.getBoundingClientRect();
        const x = clamp((e.clientX - (r.left + r.width / 2)) / r.width);
        const y = clamp((e.clientY - (r.top + r.height / 2)) / r.height);
        stage.style.setProperty("--ry", (x * 10).toFixed(2) + "deg");
        stage.style.setProperty("--rx", (-y * 10).toFixed(2) + "deg");
      });
      hero.addEventListener("mouseleave", () => {
        stage.style.setProperty("--rx", "0deg");
        stage.style.setProperty("--ry", "0deg");
      });
    }
  }

  // تبديل اللغة: نحدّث نصوص البطاقتين وسطر الحالة فوراً
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-lang-switch]")) return;
    setTimeout(() => { renderCards(); renderStatus(); }, 0);
  });
})();