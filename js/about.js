/* ============================================================
   FIND — صفحة "عن المنصة"
   1) نصوص الصفحة بالعربي والإنجليزي (data-t)
   2) مقارنة "قبل FIND / مع FIND" بالسحب
   3) بطاقات المشاكل اللي تنقلب
   4) محاكي المطابقة — نفس معادلة المطابقة الحقيقية بالضبط
   5) مراحل الخصوصية — وش يشوف الطرف الثاني بكل مرحلة
   6) الخط الزمني اللي يتعبّى مع النزول + ظهور الأقسام تدريجياً
   لا تعتمد على أي مكتبة خارجية.
   ============================================================ */

(function () {
  document.documentElement.classList.add("ab-js");

  const $ = (id) => document.getElementById(id);
  const lang = () => localStorage.getItem("find_lang") || "ar";
  const isRTL = () => document.documentElement.dir !== "ltr";
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  }

  /* ============================================================
     مواقع الحرم (نفس جدول locations) — المبنى يستخدم لنقاط "نفس المبنى"
     ============================================================ */
  const LOCATIONS = [
    { id: 1,  ar: "كلية علوم الحاسب وتقنية المعلومات", en: "College of Computer Science & IT", b: "CCSIT" },
    { id: 2,  ar: "المكتبة المركزية",                   en: "Central Library",                  b: "LIB" },
    { id: 3,  ar: "المسجد",                             en: "Mosque",                           b: "MSQ" },
    { id: 4,  ar: "الكافتيريا",                         en: "Cafeteria",                        b: "CAF" },
    { id: 5,  ar: "المواقف",                            en: "Parking Area",                     b: "PARK" },
    { id: 6,  ar: "قاعات المحاضرات",                    en: "Lecture Halls",                    b: "CCSIT" },
    { id: 7,  ar: "المعامل",                            en: "Laboratories",                     b: "CCSIT" },
    { id: 8,  ar: "المسرح / القاعة الكبرى",             en: "Auditorium",                       b: "AUD" },
    { id: 9,  ar: "صالة الرياضة",                       en: "Sports Hall",                      b: "GYM" },
    { id: 10, ar: "عمادة شؤون الطلاب",                  en: "Deanship of Student Affairs",      b: "DSA" },
    { id: 11, ar: "البوابة الرئيسية",                   en: "Main Gate",                        b: "GATE" },
    { id: 12, ar: "مبنى الإدارة",                       en: "Administration Building",          b: "ADM" },
    { id: 13, ar: "أخرى",                               en: "Other",                            b: null },
  ];

  /* ============================================================
     النصوص
     ============================================================ */
  const TEXT = {
    ar: {
      "hero.title": "نختصر عليك البحث عن غرضك مع منصة FIND",
      "hero.sub": "منصة FIND تحل مشكلة فقدان الأغراض والعثور عليها بطريقة أذكى، وتسهّل عليك التبليغ عنها. فبدل أن تتصفح تطبيقات التواصل الاجتماعي وتسأل عن غرضك المفقود، أو تعلن أنك وجدت غرضاً، ثم قد يصلك رد من شخص محتال بطريقة غير موثوقة، جاءت FIND لتختصر عليك رفع بلاغك، وتبحث لك داخل المنصة عن البلاغات المشابهة له؛ إذ يبدأ النظام بمطابقة بلاغك تلقائياً بأربعة معايير لحظة رفعه.",

      "cmp.before": "قبل FIND",
      "cmp.after": "مع FIND",
      "cmp.group": "قروب الدفعة — 512 عضو",
      "cmp.typing": "14 شخص يكتبون الآن…",
      "cmp.bad1": "رسالتك تضيع بين عدد كبير من الرسائل، وقد يصلك رد من شخص محتال وغير موثوق",
      "cmp.bad2": "التواصل بطريقة غير آمنة",
      "cmp.bad3": "تنتظر ولا تجد رداً أكيداً أو موثوقاً",
      "cmp.step1": "بلاغك",
      "cmp.step1b": "آيفون 14 أسود — المكتبة",
      "cmp.step3": "محادثة آمنة داخل المنصة",
      "cmp.good1": "بلاغك يصل فقط لصاحب البلاغ المشابه له، بناءً على معايير محددة",
      "cmp.good2": "رقمك مخفي لين توافق أنت",
      "cmp.good3": "مطابقة تلقائية للبلاغ لحظة رفعه",
      "cmp.hint": "اسحب الفاصل وشوف الفرق بنفسك",
      "cmp.handle": "اسحب للمقارنة بين قبل FIND ومع FIND",
      "leak": "⚠️ رقمه صار علني لكل القروب",
      chat: [
        { n: "عبدالعزيز", h: 200, text: "أحد لقى سماعة AirPods بالمكتبة؟ 🙏" },
        { n: "ريم", h: 330, text: "ضاع مفتاح سيارتي بالمواقف، اللي يلقاه يكلمني 05X XXX XXXX", leak: true },
        { n: "خالد", h: 30, text: "📌 رفع" },
        { n: "سارة", h: 280, text: "مين نسى شاحن بقاعة 12؟" },
        { n: "فيصل", h: 150, text: "يا جماعة لقيت محفظة بنية بالكافتيريا" },
        { n: "ريم", h: 330, text: "للحين محد رد عليّ 😔" },
        { n: "خالد", h: 30, text: "📌 رفع للمرة الثالثة" },
        { n: "مشرف القروب", h: 0, text: "ترى القروب للدراسة بس!! 😤" },
        { n: "نورة", h: 90, text: "بطاقتي الجامعية ضايعة، تواصلوا معي 05X XXX XXXX", leak: true },
        { n: "تركي", h: 240, text: "حد شاف نظارة سوداء بالمعامل؟" },
      ],

      "flip.sub": "ثلاث مشاكل كان يواجهها كل من يفقد غرضه أو يجد غرض غيره.",
      "flip.problem": "المشكلة",
      "flip.solution": "الحل",
      "flip.tap": "اقلب البطاقة ←",
      "flip.1a": "منشورك يضيع وسط مئات الرسائل في القروبات ومواقع التواصل، وما يوصل للشخص المعني",
      "flip.1b": "بلاغ منظّم برقم مرجعي خاص فيه، يوصل مباشرة لصاحب البلاغ المطابق فقط",
      "flip.2a": "تضطر تنشر رقم جوالك للجميع، وتصير عرضة لأي شخص غريب أو محتال",
      "flip.2b": "رقمك يبقى مخفياً تماماً، وما يظهر للطرف الثاني إلا بعد موافقتك أنت",
      "flip.3a": "تتصفح المنشورات بنفسك كل يوم، وتنتظر رداً قد لا يأتي أبداً",
      "flip.3b": "المنصة تقارن بلاغك تلقائياً مع كل البلاغات، وتنبّهك أول ما تجد بلاغاً مطابقاً",

      "sim.tag": "جرّب بنفسك",
      "sim.desc": "تشابه الوصف والعنوان",
      "sim.descHint": "النظام يقارن كلمات الوصف والعنوان في البلاغين، حتى لو كانت الصياغة مختلفة",
      "sim.img": "تشابه الصورتين",
      "sim.hasImg": "البلاغين فيهم صورة",
      "sim.imgHints": [
        "صورتين شبه متطابقتين",
        "صور متشابهة كثير",
        "تشابه متوسط",
        "تشابه ضعيف",
        "صور مختلفة — ما تاخذ نقاط",
      ],
      "sim.noImg": "بدون صورة: نقاط الصورة (25) تنتقل للوصف، فيصير الوصف من 60 بدل 35 — عشان ما ينظلم البلاغ اللي ما فيه صورة.",
      "sim.loc": "الموقع",
      "sim.lostAt": "مكان الفقدان",
      "sim.foundAt": "مكان العثور",
      "sim.locSame": "نفس المكان تماماً — +20",
      "sim.locBuilding": "مكانين مختلفين بنفس المبنى — +10",
      "sim.locDiff": "مكانين مختلفين — 0",
      "sim.time": "التاريخ والوقت",
      "sim.lostDate": "تاريخ الفقدان",
      "sim.foundDate": "تاريخ العثور",
      "sim.lostTime": "وقت الفقدان (اختياري)",
      "sim.foundTime": "وقت العثور (اختياري)",
      "sim.sameDay": "نفس اليوم",
      "sim.days": (n) => n === 1 ? "بفارق يوم واحد" : n === 2 ? "بفارق يومين" : n <= 10 ? `بفارق ${n} أيام` : `بفارق ${n} يوماً`,
      "sim.bonus4": "والوقت متقارب (ساعتين أو أقل) — +4 إضافية",
      "sim.bonus2": "والوقت متقارب (خلال 6 ساعات) — +2 إضافية",
      "sim.bonus0": "والوقت متباعد — بدون نقاط إضافية",
      "sim.addTime": "أضف وقت الفقدان والعثور عشان تاخذ نقاط إضافية لو كان الوقت متقارب",
      "sim.tooFar": "الفرق أكثر من 60 يوماً — النظام ما يقارن بين البلاغين أصلاً",
      "sim.noDate": "اختر تاريخ الفقدان وتاريخ العثور",
      "sim.barText": "الوصف",
      "sim.barImg": "الصورة",
      "sim.barLoc": "الموقع",
      "sim.barTime": "الوقت",
      "sim.ok": "يظهر كتطابق — ويوصل إشعار للطرفين",
      "sim.no": "أقل من 55% — ما يظهر كتطابق",
      "sim.far": "ما تتم المقارنة — الفرق بين التاريخين أكثر من 60 يوماً",
      "sim.note": "شرط أساسي قبل كل هذا: البلاغين لازم يكونون من نفس الفئة، ومن نوعين مختلفين (مفقود وموجود)، والفرق بين تاريخيهم ما يتجاوز 60 يوماً.",

      "priv.title": "ما الذي يستطيع أن يراه الطرف الآخر؟",
      "priv.s0": "رفعت بلاغك",
      "priv.s1": "صار تطابق",
      "priv.s2": "طلب تواصل",
      "priv.s3": "تمت الموافقة",
      "priv.cardTitle": "بياناتك كما يشوفها الطرف الثاني",
      "priv.pending": "طلب تواصل بانتظار موافقتك",
      "priv.fReport": "تفاصيل البلاغ",
      "priv.fName": "الاسم",
      "priv.fPhone": "رقم الجوال",
      "priv.fChat": "المحادثة",
      "priv.hReport": "مخفي عن الجميع",
      "priv.vReport": "آيفون 14 أسود · المكتبة المركزية",
      "priv.vName": "اسمك الكامل",
      "priv.hChat": "مقفلة",
      "priv.vChat": "مفتوحة داخل المنصة",
      privCaps: [
        "بلاغك الحين محفوظ، بس ما أحد يقدر يشوفه — لا الطلاب ولا أي زائر للمنصة.",
        "لقينا بلاغ مطابق: صاحبه يشوف تفاصيل البلاغ بس (الغرض والمكان والصورة)، أما اسمك ورقمك فمخفيين.",
        "الطرف الثاني طلب التواصل — وللحين ما ينكشف عنك أي شي لين توافق أنت بنفسك.",
        "وافقت: الحين يظهر اسمك ورقمك للطرف الثاني بس، وتنفتح بينكم محادثة داخل المنصة.",
      ],
      "fact.1t": "بلاغك ما يشوفه إلا المعني فيه",
      "fact.1b": "ما يقدر أحد يطّلع على بلاغك إلا صاحب البلاغ المطابق له فعلاً، والمنصة تمنع أي محاولة للوصول له من غيره.",
      "fact.2t": "صورك محفوظة بخصوصية تامة",
      "fact.2b": "صور البلاغات ما تُنشر للعامة أبداً، وما يشوفها إلا الشخص اللي له علاقة ببلاغك.",
      "fact.3t": "تواصل آمن داخل المنصة",
      "fact.3b": "بعد موافقتك، تنفتح محادثة داخل المنصة، بدل ما تضطر تعطي رقمك لشخص غريب من البداية.",

      "jr.1t": "تسجّل الدخول برقمك الخاص بالجامعة",
      "jr.1b": "سواء كنت طالباً أو موظفاً، تدخل برقمك الخاص بالجامعة وكلمة المرور فقط.",
      "jr.1n": "ملاحظة: المنصة مخصصة لمنسوبي الجامعة فقط، فتأكد من كتابة رقمك بشكل صحيح عند إنشاء الحساب.",

      "team.tag": "المطورون",
      "team.title": "الفريق الذي أنشأ FIND",
      "team.body": "مشروع FIND صمّمته مجموعة من الطلاب، وهو منصة ضمن جامعة الإمام عبدالرحمن بن فيصل.",
      "team.lead": "رئيس الفريق",
      "team.member": "عضو الفريق",
      "team.n1": "فهد عادل الغامدي",      "team.a1": "ف",
      "team.n2": "عبدالله محمد الشهيل",   "team.a2": "ع",
      "team.n3": "أحمد محمد الخلف",       "team.a3": "أ",
      "team.n4": "إبراهيم مصطفى الرمّاح",  "team.a4": "إ",
      "team.n5": "حسين سعيد",             "team.a5": "ح",
      "team.n6": "سراج منير الخضاب",      "team.a6": "س",

      "faq.1a": "لا، هي مشروع طلابي أكاديمي ضمن جامعة الإمام عبدالرحمن بن فيصل.",
      "faq.3q": "لماذا يجب تسجيل الدخول برقمي الخاص بالجامعة، سواء كنت طالباً أو موظفاً؟",
    },

    en: {
      "hero.title": "FIND makes searching for your item quick and simple",
      "hero.sub": "FIND solves the problem of losing and finding items in a smarter way, and makes reporting them easy. Instead of scrolling through social media asking about your lost item, or announcing that you found something — and possibly getting a reply from a scammer through an unreliable channel — FIND lets you file your report in seconds and searches the platform for similar reports. The system starts matching your report automatically against four criteria the moment you submit it.",

      "cmp.before": "Before FIND",
      "cmp.after": "With FIND",
      "cmp.group": "Class group — 512 members",
      "cmp.typing": "14 people are typing…",
      "cmp.bad1": "Your message gets lost among countless others, and you may get a reply from an untrustworthy scammer",
      "cmp.bad2": "Contact happens in an unsafe way",
      "cmp.bad3": "You wait without ever getting a certain or reliable answer",
      "cmp.step1": "Your report",
      "cmp.step1b": "Black iPhone 14 — Library",
      "cmp.step3": "Secure in-platform chat",
      "cmp.good1": "Your report only reaches the owner of a similar report, based on specific criteria",
      "cmp.good2": "Your number stays hidden until you approve",
      "cmp.good3": "Automatic matching the moment the report is submitted",
      "cmp.hint": "Drag the divider to see the difference",
      "cmp.handle": "Drag to compare before FIND and with FIND",
      "leak": "⚠️ Their number is now public to the whole group",
      chat: [
        { n: "Abdulaziz", h: 200, text: "Anyone found AirPods in the library? 🙏" },
        { n: "Reem", h: 330, text: "Lost my car key in the parking lot, call me 05X XXX XXXX", leak: true },
        { n: "Khalid", h: 30, text: "📌 bump" },
        { n: "Sara", h: 280, text: "Who left a charger in room 12?" },
        { n: "Faisal", h: 150, text: "Guys, I found a brown wallet in the cafeteria" },
        { n: "Reem", h: 330, text: "Still no reply 😔" },
        { n: "Khalid", h: 30, text: "📌 bump, third time" },
        { n: "Group admin", h: 0, text: "This group is for studying only!! 😤" },
        { n: "Noura", h: 90, text: "Lost my student ID, contact me 05X XXX XXXX", leak: true },
        { n: "Turki", h: 240, text: "Anyone seen black glasses in the labs?" },
      ],

      "flip.sub": "Three problems faced by anyone who loses an item or finds someone else's.",
      "flip.problem": "Problem",
      "flip.solution": "Solution",
      "flip.tap": "Flip the card →",
      "flip.1a": "Your post gets buried among hundreds of messages in groups and social media, and never reaches the right person",
      "flip.1b": "An organized report with its own reference number, delivered only to the owner of a matching report",
      "flip.2a": "You have to share your phone number with everyone, exposing yourself to strangers and scammers",
      "flip.2b": "Your number stays completely hidden and is only shown to the other person after you approve",
      "flip.3a": "You scroll through posts yourself every day, waiting for a reply that may never come",
      "flip.3b": "The platform automatically compares your report with every other report and alerts you as soon as it finds a match",

      "sim.tag": "Try it yourself",
      "sim.desc": "Description & title similarity",
      "sim.descHint": "The system compares the words in both reports' descriptions and titles, even when they are phrased differently",
      "sim.img": "Photo similarity",
      "sim.hasImg": "Both reports have a photo",
      "sim.imgHints": [
        "Nearly identical photos",
        "Very similar photos",
        "Moderately similar",
        "Weak similarity",
        "Different photos — no points",
      ],
      "sim.noImg": "Without a photo, its 25 points move to the description, so text counts out of 60 instead of 35 — reports without photos aren't penalised.",
      "sim.loc": "Location",
      "sim.lostAt": "Where it was lost",
      "sim.foundAt": "Where it was found",
      "sim.locSame": "Exactly the same place — +20",
      "sim.locBuilding": "Different spots in the same building — +10",
      "sim.locDiff": "Different places — 0",
      "sim.time": "Date & time",
      "sim.lostDate": "Date lost",
      "sim.foundDate": "Date found",
      "sim.lostTime": "Time lost (optional)",
      "sim.foundTime": "Time found (optional)",
      "sim.sameDay": "Same day",
      "sim.days": (n) => n === 1 ? "1 day apart" : `${n} days apart`,
      "sim.bonus4": "and close in time (2 hours or less) — +4 bonus",
      "sim.bonus2": "and close in time (within 6 hours) — +2 bonus",
      "sim.bonus0": "but far apart in time — no bonus",
      "sim.addTime": "Add both times to earn bonus points when they are close",
      "sim.tooFar": "More than 60 days apart — the system doesn't compare these reports at all",
      "sim.noDate": "Choose the date lost and the date found",
      "sim.barText": "Description",
      "sim.barImg": "Photo",
      "sim.barLoc": "Location",
      "sim.barTime": "Time",
      "sim.ok": "Shown as a match — both sides get notified",
      "sim.no": "Below 55% — not shown as a match",
      "sim.far": "Not compared — the dates are more than 60 days apart",
      "sim.note": "Before any of this, both reports must share the same category, be opposite types (lost and found), and be at most 60 days apart.",

      "priv.title": "What can the other party see?",
      "priv.s0": "You file a report",
      "priv.s1": "A match is found",
      "priv.s2": "Contact request",
      "priv.s3": "Approved",
      "priv.cardTitle": "Your data as the other person sees it",
      "priv.pending": "Contact request awaiting your approval",
      "priv.fReport": "Report details",
      "priv.fName": "Name",
      "priv.fPhone": "Phone number",
      "priv.fChat": "Chat",
      "priv.hReport": "Hidden from everyone",
      "priv.vReport": "Black iPhone 14 · Central Library",
      "priv.vName": "Your full name",
      "priv.hChat": "Locked",
      "priv.vChat": "Open inside the platform",
      privCaps: [
        "Your report is saved, but nobody can see it — not other students, not any visitor.",
        "A matching report was found: its owner sees only the report details (item, place, photo). Your name and number stay hidden.",
        "The other person requested contact — still nothing about you is revealed until you approve.",
        "You approved: only the other person now sees your name and number, and a chat opens inside the platform.",
      ],
      "fact.1t": "Only the right person sees your report",
      "fact.1b": "Nobody can view your report except the owner of a genuinely matching report, and the platform blocks any other attempt to access it.",
      "fact.2t": "Your photos stay private",
      "fact.2b": "Report photos are never published publicly — only the person connected to your report can see them.",
      "fact.3t": "Safe contact inside the platform",
      "fact.3b": "After you approve, a chat opens inside the platform, so you never have to hand your number to a stranger up front.",

      "jr.1t": "Log in with your university number",
      "jr.1b": "Whether you're a student or an employee, you sign in with your university number and password only.",
      "jr.1n": "Note: the platform is for university members only, so make sure you enter your number correctly when creating your account.",

      "team.tag": "The developers",
      "team.title": "The team that built FIND",
      "team.body": "FIND was designed by a group of students, and it is a platform within Imam Abdulrahman Bin Faisal University.",
      "team.lead": "Team Lead",
      "team.member": "Team Member",
      "team.n1": "Fahad Adel Alghamdi",          "team.a1": "F",
      "team.n2": "Abdullah Muhammad Alshuhail",  "team.a2": "A",
      "team.n3": "Ahmad Mohammed Al-Khalaf",     "team.a3": "A",
      "team.n4": "Ibrahim Mustafa Alrammah",     "team.a4": "I",
      "team.n5": "Hussain Saeed",                "team.a5": "H",
      "team.n6": "Seraj Muneer Alkhadab",        "team.a6": "S",

      "faq.1a": "No, it's an academic student project within Imam Abdulrahman Bin Faisal University.",
      "faq.3q": "Why do I have to log in with my university number, whether I'm a student or an employee?",
    },
  };

  const t = () => TEXT[lang()] || TEXT.ar;

  function applyTexts() {
    const T = t();
    document.querySelectorAll("[data-t]").forEach((el) => {
      const v = T[el.dataset.t];
      if (typeof v === "string") el.textContent = v;
    });
    document.querySelectorAll("[data-t-aria]").forEach((el) => {
      const v = T[el.dataset.tAria];
      if (typeof v === "string") el.setAttribute("aria-label", v);
    });
    renderChat();
    renderLocationOptions();
    updateSim();
    renderPrivacy();
    setCompare(reveal);
  }

  /* ============================================================
     1) قروب الواتساب الفوضوي (قبل FIND)
     ============================================================ */
  const chatTrack = $("abChatTrack");
  const unreadEl = $("abUnread");

  function renderChat() {
    if (!chatTrack) return;
    const T = t();
    const html = T.chat.map((m) => `
      <div class="ab-msg${m.leak ? " is-leak" : ""}">
        <span class="ab-msg-av" style="--h:${m.h}">${esc(m.n.charAt(0))}</span>
        <div class="ab-msg-bubble">
          <b>${esc(m.n)}</b>
          <p>${esc(m.text)}</p>
          ${m.leak ? `<em>${esc(T.leak)}</em>` : ""}
        </div>
      </div>`).join("");
    chatTrack.innerHTML = html + html; // نسختين عشان الحركة تلف بدون انقطاع
  }

  if (unreadEl && !reduced) {
    let unread = 248;
    setInterval(() => {
      unread = unread >= 999 ? 248 : unread + Math.ceil(Math.random() * 3);
      unreadEl.textContent = "+" + unread;
    }, 1300);
  }

  /* ============================================================
     2) مقارنة قبل / بعد بالسحب
     reveal = كم بالمية ظاهر من "مع FIND" (0 → 100)
     ============================================================ */
  const compare = $("abCompare");
  const handle = $("abHandle");
  let reveal = 50;

  function setCompare(r) {
    if (!compare) return;
    reveal = clamp(r, 0, 100);
    const pos = isRTL() ? reveal : 100 - reveal; // مكان الفاصل من يسار الصندوق
    compare.style.setProperty("--pos", pos + "%");
    if (handle) handle.setAttribute("aria-valuenow", Math.round(reveal));
  }

  if (compare && handle) {
    let dragging = false;

    const fromPointer = (clientX) => {
      const r = compare.getBoundingClientRect();
      const pos = clamp(((clientX - r.left) / r.width) * 100, 0, 100);
      setCompare(isRTL() ? pos : 100 - pos);
    };

    compare.addEventListener("pointerdown", (e) => {
      dragging = true;
      compare.classList.add("is-dragging");
      compare.setPointerCapture(e.pointerId);
      fromPointer(e.clientX);
    });
    compare.addEventListener("pointermove", (e) => { if (dragging) fromPointer(e.clientX); });
    const stop = () => { dragging = false; compare.classList.remove("is-dragging"); };
    compare.addEventListener("pointerup", stop);
    compare.addEventListener("pointercancel", stop);

    handle.addEventListener("keydown", (e) => {
      const step = e.shiftKey ? 20 : 5;
      const towardAfter = isRTL() ? "ArrowRight" : "ArrowLeft";
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        setCompare(reveal + (e.key === towardAfter ? step : -step));
      } else if (e.key === "Home") { e.preventDefault(); setCompare(0); }
      else if (e.key === "End") { e.preventDefault(); setCompare(100); }
    });

    // أول ما تظهر: "مع FIND" يمسح الفوضى، ثم يرجع الفاصل للنص
    const intro = () => {
      if (reduced) { setCompare(50); return; }
      const frames = [[0, 0], [1400, 100], [2300, 100], [3100, 50]];
      const start = performance.now();
      compare.classList.add("is-intro");
      const tick = (now) => {
        const el = now - start;
        let i = 0;
        while (i < frames.length - 1 && el > frames[i + 1][0]) i++;
        if (i >= frames.length - 1) { setCompare(50); compare.classList.remove("is-intro"); return; }
        const [t0, v0] = frames[i], [t1, v1] = frames[i + 1];
        const p = (el - t0) / (t1 - t0);
        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        if (!dragging) setCompare(v0 + (v1 - v0) * eased);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    setCompare(0);
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { io.disconnect(); setTimeout(intro, 400); }
      }, { threshold: 0.45 });
      io.observe(compare);
    } else {
      setCompare(50);
    }
  }

  /* ============================================================
     3) بطاقات تنقلب بالضغط (والماوس بالـ CSS)
     ============================================================ */
  document.querySelectorAll(".ab-flip").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("is-flipped"));
  });

  /* ============================================================
     4) محاكي المطابقة — نفس معادلة المطابقة الحقيقية بالضبط:
        الوصف 35 (أو 60 بدون صورة) + الصورة 25 + الموقع 20 + الوقت 20
     ============================================================ */
  const simDesc = $("simDesc");
  const simHasImg = $("simHasImg");
  const simImg = $("simImg");
  const simLocLost = $("simLocLost");
  const simLocFound = $("simLocFound");
  const simDateLost = $("simDateLost");
  const simDateFound = $("simDateFound");
  const simTimeLost = $("simTimeLost");
  const simTimeFound = $("simTimeFound");
  const GAUGE_CIRC = 2 * Math.PI * 84;
  const THRESHOLD = 55;
  const MAX_DAYS = 60;

  const round2 = (v) => Math.round(v * 100) / 100;
  const fmt = (v) => {
    const r = Math.round(v * 10) / 10;
    return Number.isInteger(r) ? String(r) : r.toFixed(1);
  };
  const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const dateToDays = (v) => {
    if (!v) return null;
    const [y, m, d] = v.split("-").map(Number);
    return Math.round(Date.UTC(y, m - 1, d) / 86400000);
  };
  const timeToMinutes = (v) => {
    if (!v) return null;
    const [h, m] = v.split(":").map(Number);
    return h * 60 + m;
  };

  function renderLocationOptions() {
    if (!simLocLost) return;
    const L = lang();
    [simLocLost, simLocFound].forEach((sel) => {
      const current = sel.value || "2";
      sel.innerHTML = LOCATIONS.map((l) => `<option value="${l.id}">${esc(l[L] || l.ar)}</option>`).join("");
      sel.value = current;
    });
  }

  function computeScore() {
    // (1) الوصف + (2) الصورة
    const sim = Number(simDesc.value) / 100;
    const hasImg = simHasImg.checked;
    const imgSim = Number(simImg.value);
    const ham = Math.round(32 * (1 - imgSim / 100)); // فرق البصمة (0 = متطابقة)
    let text, img = 0;
    if (hasImg) {
      text = round2(sim * 35);
      img = ham <= 20 ? round2(((20 - ham) / 20) * 25) : 0;
    } else {
      text = Math.min(round2(sim * 60), 60);
    }

    // (3) الموقع: نفس المكان 20، نفس المبنى 10، غير كذا 0
    const a = LOCATIONS.find((l) => l.id === Number(simLocLost.value));
    const b = LOCATIONS.find((l) => l.id === Number(simLocFound.value));
    let loc = 0, locKind = "diff";
    if (a && b && a.id === b.id) { loc = 20; locKind = "same"; }
    else if (a && b && a.b && a.b === b.b) { loc = 10; locKind = "building"; }

    // (4) الوقت
    const d1 = dateToDays(simDateLost.value);
    const d2 = dateToDays(simDateFound.value);
    let time = 0, days = null, bonus = null;
    if (d1 !== null && d2 !== null) {
      days = Math.abs(d1 - d2);
      if (days === 0) {
        time = 16;
        const t1 = timeToMinutes(simTimeLost.value);
        const t2 = timeToMinutes(simTimeFound.value);
        if (t1 !== null && t2 !== null) {
          const hours = Math.abs(t1 - t2) / 60;
          if (hours <= 2) { time += 4; bonus = 4; }
          else if (hours <= 6) { time += 2; bonus = 2; }
          else bonus = 0;
        }
      }
      else if (days <= 3)  time = 14;
      else if (days <= 7)  time = 10;
      else if (days <= 14) time = 6;
      else if (days <= 30) time = 3;
      else time = 0;
    }

    const total = round2(Math.min(text + img + loc + time, 100));
    return { text, img, loc, locKind, time, days, bonus, total, hasImg, imgSim, ham };
  }

  function setBar(id, valId, value, max) {
    const bar = $(id), val = $(valId);
    if (bar) bar.style.width = (max ? (value / max) * 100 : 0) + "%";
    if (val) val.textContent = `${fmt(value)} / ${max}`;
  }

  function updateSim() {
    if (!simDesc) return;
    const T = t();
    const s = computeScore();

    $("simDescOut").textContent = simDesc.value + "%";
    $("simImgOut").textContent = s.imgSim + "%";

    // الصورة
    const imgHint = $("simImgHint");
    if (s.hasImg) {
      const idx = s.ham <= 3 ? 0 : s.ham <= 8 ? 1 : s.ham <= 14 ? 2 : s.ham <= 20 ? 3 : 4;
      imgHint.textContent = T["sim.imgHints"][idx];
      $("simImgRow").classList.remove("is-off");
    } else {
      imgHint.textContent = T["sim.noImg"];
      $("simImgRow").classList.add("is-off");
    }
    simImg.disabled = !s.hasImg;

    // الموقع
    $("simLocOut").textContent = "+" + s.loc;
    $("simLocHint").textContent = T[{ same: "sim.locSame", building: "sim.locBuilding", diff: "sim.locDiff" }[s.locKind]];

    // الوقت
    $("simTimeOut").textContent = "+" + s.time;
    const timeHint = $("simTimeHint");
    const tooFar = s.days !== null && s.days > MAX_DAYS;
    if (s.days === null) {
      timeHint.textContent = T["sim.noDate"];
    } else if (tooFar) {
      timeHint.textContent = T["sim.tooFar"];
    } else if (s.days === 0) {
      const extra = s.bonus === 4 ? T["sim.bonus4"] : s.bonus === 2 ? T["sim.bonus2"] : s.bonus === 0 ? T["sim.bonus0"] : T["sim.addTime"];
      timeHint.textContent = `${T["sim.sameDay"]} — ${extra}`;
    } else {
      timeHint.textContent = `${T["sim.days"](s.days)} — +${s.time}`;
    }

    // الأشرطة والنتيجة
    setBar("simTextBar", "simTextVal", s.text, s.hasImg ? 35 : 60);
    setBar("simImgBar", "simImgVal", s.img, 25);
    setBar("simLocBar", "simLocVal", s.loc, 20);
    setBar("simTimeBar", "simTimeVal", s.time, 20);
    $("simImgBarRow").classList.toggle("is-off", !s.hasImg);

    $("simTotal").textContent = fmt(s.total) + "%";
    $("simBar").style.strokeDashoffset = String(GAUGE_CIRC * (1 - s.total / 100));

    const ok = !tooFar && s.total >= THRESHOLD;
    const verdict = $("simVerdict");
    verdict.classList.toggle("is-ok", ok);
    verdict.classList.toggle("is-no", !ok);
    $("simVerdictText").textContent = tooFar ? T["sim.far"] : ok ? T["sim.ok"] : T["sim.no"];
  }

  if (simDesc) {
    // قيم افتراضية: فُقد أمس الساعة 2 الظهر، ووُجد اليوم الساعة 10 الصبح
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    simDateLost.value = isoDate(yesterday);
    simDateFound.value = isoDate(today);
    simDateLost.max = simDateFound.max = isoDate(today);
    simTimeLost.value = "14:00";
    simTimeFound.value = "10:00";

    $("simBar").style.strokeDasharray = String(GAUGE_CIRC);
    document.querySelectorAll("#simulator input, #simulator select").forEach((el) => {
      el.addEventListener("input", updateSim);
      el.addEventListener("change", updateSim);
    });
  }

  /* ============================================================
     5) مراحل الخصوصية
     ============================================================ */
  const PRIV_STATES = [
    { report: 0, name: 0, phone: 0, chat: 0, pending: 0 },
    { report: 1, name: 0, phone: 0, chat: 0, pending: 0 },
    { report: 1, name: 0, phone: 0, chat: 0, pending: 1 },
    { report: 1, name: 1, phone: 1, chat: 1, pending: 0 },
  ];
  let privStep = 0;
  let privTimer = null;
  let privAuto = true;
  const privSteps = $("privSteps");

  function renderPrivacy() {
    if (!privSteps) return;
    const state = PRIV_STATES[privStep];
    privSteps.querySelectorAll("button").forEach((b) => {
      const i = Number(b.dataset.step);
      b.classList.toggle("is-active", i === privStep);
      b.classList.toggle("is-done", i < privStep);
      b.setAttribute("aria-pressed", i === privStep ? "true" : "false");
    });
    document.querySelectorAll("#privCard .ab-field").forEach((f) => {
      f.classList.toggle("is-visible", !!state[f.dataset.field]);
    });
    $("privPending").classList.toggle("is-on", !!state.pending);
    $("privCard").dataset.step = privStep;
    $("privCaption").textContent = t().privCaps[privStep];
    privSteps.style.setProperty("--done", privStep / (PRIV_STATES.length - 1));
  }

  function setPriv(i) {
    privStep = i;
    renderPrivacy();
  }

  function startPrivAuto() {
    if (!privAuto || privTimer || reduced) return;
    privTimer = setInterval(() => setPriv((privStep + 1) % PRIV_STATES.length), 3200);
  }
  function stopPrivAuto() {
    clearInterval(privTimer);
    privTimer = null;
  }

  if (privSteps) {
    privSteps.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        privAuto = false;
        stopPrivAuto();
        setPriv(Number(b.dataset.step));
      });
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) startPrivAuto(); else stopPrivAuto();
      }, { threshold: 0.35 }).observe(privSteps.closest(".ab-panel"));
    }
  }

  /* ============================================================
     6) الخط الزمني + ظهور الأقسام
     ============================================================ */
  const journey = $("abJourney");
  const jSteps = journey ? Array.from(journey.querySelectorAll(".ab-jstep")) : [];
  let ticking = false;

  function updateJourney() {
    ticking = false;
    if (!journey) return;
    const r = journey.getBoundingClientRect();
    const mid = window.innerHeight * 0.62;
    const p = clamp((mid - r.top) / r.height, 0, 1);
    journey.style.setProperty("--p", p.toFixed(3));
    jSteps.forEach((s) => s.classList.toggle("is-active", s.getBoundingClientRect().top < mid));
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateJourney); }
  }, { passive: true });
  window.addEventListener("resize", updateJourney);

  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ============================================================
     التشغيل + تبديل اللغة
     ============================================================ */
  function init() {
    applyTexts();
    updateJourney();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-lang-switch]")) setTimeout(applyTexts, 0);
  });
})();
