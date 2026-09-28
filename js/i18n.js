/* ============================================================
   FIND — i18n (Arabic / English switch)
   ملاحظة: القاموس مضمّن هنا مباشرة (وليس ملف JSON منفصل)
   حتى يعمل الموقع حتى لو فتحته مباشرة بدون سيرفر محلي (file://)،
   لأن fetch() لملفات JSON محلية يُمنع من أغلب المتصفحات على file://.
   لاحقاً لما يكون عندكم سيرفر (GitHub Pages / Live Server)
   يمكن نقل هذا القاموس لملفات ar.json / en.json منفصلة بسهولة.
   ============================================================ */

const DICTIONARY = {
  ar: {
    "nav.home":          "الرئيسية",
    "nav.filing":        "تقديم بلاغ",
    "nav.about":         "عن المنصة",
    "nav.notifications": "بلاغات",
    "nav.signup":        "إنشاء حساب",
    "nav.login":         "تسجيل الدخول",

    "hero.eyebrow":  "منصة بلاغات للمفقودات والموجودات بالجامعة",
    "hero.title":    "غرضك المفقود أقرب مما تتصور",
    "hero.subtitle": "بلّغ عن غرضك المفقود أو الذي وجدته، ودع الباقي على FIND.",
    "hero.cta.lost":  "فقدت غرضاً",
    "hero.cta.found": "وجدت غرضاً",
    "hero.note":      "بلاغاتك لا تظهر إلا لمن يملك بلاغاً مشابهاً فعلياً",

    "hero.signals.label":   "نطابق تلقائياً حسب",
    "hero.signal.desc":     "الوصف",
    "hero.signal.image":    "الصورة",
    "hero.signal.location": "الموقع",
    "hero.signal.time":     "الوقت",

    "match.lost.title": "محفظة جلدية بنية",
    "match.lost.meta":  "مبنى كلية الحاسب — أمس",
    "match.found.title": "محفظة بنية اللون",
    "match.found.meta":  "المكتبة المركزية — اليوم",
    "match.score.label": "تطابق",

    "steps.eyebrow": "كيف تعمل المنصة",
    "steps.title":   "من البلاغ إلى استرجاع الغرض، بثلاث خطوات",
    "steps.1.title": "سجّل دخولك وقدّم بلاغك",
    "steps.1.body":  "سجّل الدخول ببياناتك كطالب أو موظف، ثم اختر مفقود أو موجود وأضف الوصف والصورة والموقع والتاريخ.",
    "steps.2.title": "المطابقة التلقائية",
    "steps.2.body":  "تقارن المنصة بلاغك بجميع البلاغات الأخرى وتعرض لك الأقرب فقط، مع نسبة تطابق واضحة لكل بلاغ مقترح.",
    "steps.3.title": "التأكيد والتواصل",
    "steps.3.body":  "بعد موافقة الطرفين، تُفتح صفحة محادثة خاصة ومراقبة بالكامل داخل المنصة، ويظهر رقم التواصل لكل من الطرفين عند الحاجة، وصولاً لإتمام تسليم الغرض.",

    "trust.title": "الخصوصية بشكل كامل",
    "trust.body":  "بلاغك لا يظهر لأي شخص عشوائي بمتصفح المنصة، فقط يظهر لأصحاب البلاغات المشابهة فعلياً لغرضك.",
    "trust.stat1.num": "0",
    "trust.stat1.txt": "لا تظهر بلاغات لمستخدم جديد بدون أي بلاغ",
    "trust.stat2.num": "٪100",
    "trust.stat2.txt": "البلاغات تمر عبر شروط مطابقة صارمة قبل الظهور لأي مستخدم",
    "trust.stat3.num": "4",
    "trust.stat3.txt": "معايير مطابقة: الوصف، الصورة، الموقع، الوقت",
    "trust.stat4.num": "١",
    "trust.stat4.txt": "نقطة التواصل الوحيدة الآمنة والموثوقة والمراقبة بشكل كامل عن طريق FIND",

    "home.values.tag":   "لماذا FIND؟",
    "home.values.title": "ليس مجرد منصة بلاغات عادية",

    "home.values.speed.title": "مطابقة لحظية",
    "home.values.speed.body":  "اختصار للوقت المستغرق في طرق التواصل المعتادة عبر تطبيقات التواصل الاجتماعي غير الموثوقة في إرجاع الغرض لصاحبه الحقيقي.",

    "home.values.privacy.title": "خصوصية مبنية بالنظام",
    "home.values.privacy.body":  "بياناتك وبلاغاتك محمية بالكامل. أي طلب تواصل يحتاج موافقتك أولاً، وبعدها تُفتح محادثة آمنة ومراقبة بالكامل يظهر فيها رقمك ورقم الطرف الآخر فقط — وتقدر تقفلها نهائياً بعد تأكيد الاستلام، مع الاحتفاظ بسجل التواصل لدى المسؤولين.",

    "home.values.accuracy.title": "دقة تطابق بأربع معايير",
    "home.values.accuracy.body":  "الوصف والصورة والموقع والوقت مجتمعين، بمعنى أن التطابق مع بلاغ آخر ليس عشوائياً وإنما حقيقي.",

    "home.categories.tag":      "كل الفئات",
    "home.categories.title":    "حدد فئة غرضك",
    "home.categories.subtitle": "من الجوالات إلى المفاتيح، بلّغ بالفئة المناسبة ودع المطابقة تكون أدق.",

    "menu.myReports": "بلاغاتي",
    "menu.chat":      "المحادثات",
    "menu.myProfile": "ملفي الشخصي",
    "menu.notifications": "إشعارات",
    "menu.logout":    "تسجيل الخروج",
    "menu.admin":     "لوحة التحكم",

    "auth.signup.title":    "إنشاء حساب جديد",
    "auth.signup.subtitle": "خاص بطلاب ومنسوبي جامعة الإمام عبدالرحمن بن فيصل",
    "auth.login.title":     "تسجيل الدخول",
    "auth.login.subtitle":  "ادخل برقمك الجامعي وكلمة المرور",
    "auth.signup.submit":   "إنشاء الحساب",
    "auth.login.submit":    "تسجيل الدخول",
    "auth.haveAccount":     "لديك حساب؟",
    "auth.noAccount":       "ليس لديك حساب؟",
    "auth.goLogin":         "سجّل الدخول",
    "auth.goSignup":        "أنشئ حساباً",

    "field.fullName":              "الاسم الكامل",
    "field.universityId":          "الرقم الجامعي",
    "field.userType":              "نوع المستخدم",
    "field.userType.student":      "طالب",
    "field.userType.faculty":      "دكتور",
    "field.userType.staff":        "إداري",
    "field.phone":                 "رقم الجوال",
    "field.password":              "كلمة المرور",
    "field.confirmPassword":       "تأكيد كلمة المرور",

    "error.passwordMismatch":   "كلمتا المرور غير متطابقتين",
    "error.universityIdFormat": "الرقم الجامعي يجب أن يكون أرقاماً فقط (6-12 رقم)",
    "error.phoneFormat":        "رقم الجوال غير صحيح، تأكد من صيغته (05xxxxxxxx)",
    "error.genericSignup":      "تعذر إنشاء الحساب، حاول مرة أخرى",
    "error.invalidLogin":       "الرقم الجامعي أو كلمة المرور غير صحيحة",
    "success.signup":           "تم إنشاء حسابك بنجاح",

    "profile.title":        "ملفي الشخصي",
    "profile.fullName":     "الاسم الكامل",
    "profile.universityId": "الرقم الجامعي",
    "profile.userType":     "نوع المستخدم",
    "profile.phone":        "رقم الجوال",
    "profile.logout":       "تسجيل الخروج",

    "footer.rights": "جامعة الإمام عبدالرحمن بن فيصل",
    "footer.about":  "عن المنصة",
    "footer.contact": "اتصل بنا",
    "footer.quicklinks": "روابط الموقع",
    "footer.devteam": "مطوّرو المشروع",
    "footer.teamLead": "رئيس الفريق /",

    "report.lost.tag":      "مفقود",
    "report.lost.title":    "الإبلاغ عن غرض مفقود",
    "report.lost.subtitle": "كل معلومة تضيفها تزيد دقّة المطابقة التلقائية مع البلاغات الأخرى.",
    "report.lost.submit":   "نشر بلاغ المفقودات",

    "report.found.tag":      "موجود",
    "report.found.title":    "الإبلاغ عن غرض موجود",
    "report.found.subtitle": "بياناتك لن تظهر لأحد إلا إذا وُجد بلاغ مفقودات مطابق فعلياً.",
    "report.found.submit":   "نشر بلاغ الموجودات",

    "report.privacyNote": "بلاغك لا يظهر لأي مستخدم عشوائي — فقط لأصحاب البلاغات القريبة من وصفك.",

    "report.section.photo":     "صورة الغرض (اختياري لكنها تحسّن دقة المطابقة كثيراً)",
    "report.section.details":   "تفاصيل الغرض",
    "report.section.whenWhere": "مكان وزمان الفقدان",

    "report.dropzone.title": "اسحب صورة هنا أو اضغط للاختيار",
    "report.dropzone.hint":  "PNG أو JPG — أوضح الصورة، أدق المطابقة",

    "field.title":                 "عنوان مختصر للغرض",
    "field.title.placeholder":     "مثال: محفظة جلدية بنية",
    "field.category":              "الفئة",
    "field.description":           "الوصف التفصيلي",
    "field.description.placeholder": "اذكر أي تفاصيل تميّز الغرض: اللون، العلامة التجارية، خدوش أو علامات مميزة...",
    "field.location":              "الموقع",
    "field.location.placeholder":  "اختر الموقع",
    "field.date":                  "تاريخ الفقدان",
    "field.dateFound":             "تاريخ العثور",
    "field.time":                  "الوقت التقريبي (اختياري)",

    "cat.1":  "إلكترونيات",
    "cat.2":  "جوالات",
    "cat.3":  "محافظ وبطاقات",
    "cat.4":  "مفاتيح",
    "cat.5":  "حقائب",
    "cat.6":  "نظارات",
    "cat.7":  "ساعات ومجوهرات",
    "cat.8":  "كتب ومستلزمات",
    "cat.9":  "ملابس",
    "cat.10": "أخرى",

    "loc.1":  "كلية علوم الحاسب وتقنية المعلومات",
    "loc.2":  "المكتبة المركزية",
    "loc.3":  "المسجد",
    "loc.4":  "الكافتيريا",
    "loc.5":  "المواقف",
    "loc.6":  "قاعات المحاضرات",
    "loc.7":  "المعامل",
    "loc.8":  "المسرح / القاعة الكبرى",
    "loc.9":  "صالة الرياضة",
    "loc.10": "عمادة شؤون الطلاب",
    "loc.11": "البوابة الرئيسية",
    "loc.12": "مبنى الإدارة",
    "loc.13": "أخرى",

    "choice.title":    "وش قاعد تسوي؟",
    "choice.subtitle": "اختر نوع البلاغ عشان نوجّهك للفورم المناسب مباشرة.",

    "choice.lost.title": "فقدت غرضاً",
    "choice.lost.body":  "بلّغ عن غرضك المفقود بالوصف والصورة والموقع، وخلّي المنصة تدوّر لك على أقرب تطابق تلقائياً.",
    "choice.lost.cta":   "الإبلاغ عن مفقود",

    "choice.found.title": "وجدت غرضاً",
    "choice.found.body":  "لقيت غرض غيرك؟ بلّغ عنه وبياناتك ما تظهر لأحد إلا لما يجي بلاغ مفقودات يطابقه فعلياً.",
    "choice.found.cta":   "الإبلاغ عن موجود",

    "success.title":       "تم إرسال بلاغك بنجاح",
    "success.subtitle":    "بمجرد ما نلقى بلاغ يطابقه، بتوصلك رسالة إشعار فوراً.",
    "success.refLabel":    "رقم البلاغ المرجعي",
    "success.viewReports": "عرض بلاغاتي",
    "success.backHome":    "العودة للرئيسية",

    "myReports.title":    "بلاغاتي",
    "myReports.tab.all":  "الكل",
    "myReports.tab.lost": "مفقود",
    "myReports.tab.found":"موجود",
    "myReports.loading":  "جارِ التحميل...",
    "myReports.empty":    "ما عندك أي بلاغ لسا.",
    "myReports.emptyCta": "قدّم بلاغك الأول",

    "matches.title":         "بلاغات مشابهة لبلاغاتك",
    "matches.subtitle":      "هذي البلاغات ظهرت لأنها تطابقت تلقائياً مع بلاغ رفعته أنت — ما تظهر لأي شخص غيرك.",
    "matches.empty":         "ما فيه بلاغات مشابهة لبلاغاتك لحد الآن.",
    "matches.contact":       "تواصل",
    "matches.waiting":       "بانتظار رد الطرف الآخر",
    "matches.incomingClaim": "في طلب تواصل — راجع صفحة الإشعارات للرد عليه",
    "matches.goNotifications": "فتح الإشعارات",
    "matches.approve":       "موافقة",
    "matches.reject":        "رفض",
    "matches.approved":      "تمت الموافقة",
    "matches.rejectedTag":   "تم الرفض",
    "matches.contactLabel":  "التواصل مع",
    "matches.openChat":      "فتح المحادثة",

    "notif.title":     "الإشعارات",
    "notif.markAll":   "تعليم الكل كمقروء",
    "notif.empty":     "ما عندك أي إشعارات لحد الآن.",

    "chat.title":           "المحادثات",
    "chat.conversations":   "محادثاتي",
    "chat.noConversations": "ما عندك أي محادثة بعد — تفتح تلقائياً بعد الموافقة على تطابق.",
    "chat.selectPrompt":    "اختر محادثة من القائمة",
    "chat.placeholder":     "اكتب رسالتك...",
    "chat.send":            "إرسال",
    "chat.resolve":         "تم الاستلام ✅",
    "chat.closedNote":      "هذه المحادثة مغلقة — تم تأكيد استلام الغرض.",

    "admin.title":          "لوحة تحكم الإدارة",
    "admin.stat.total":     "إجمالي البلاغات",
    "admin.stat.lost":      "بلاغات مفقودات",
    "admin.stat.found":     "بلاغات موجودات",
    "admin.stat.resolved":  "تم استرجاعها",
    "admin.stat.unresolved":"قيد الانتظار",
    "admin.stat.rate":      "نسبة الاسترجاع",
    "admin.byCategory":     "حسب الفئة",
    "admin.byLocation":     "حسب الموقع",
    "admin.monthly":        "البلاغات الشهرية",
    "admin.legend.total":   "إجمالي",
    "admin.legend.resolved":"تم استرجاعها",
    "admin.selectYearNote": "اختر سنة محددة (مو \"كل السنوات\") لعرض الرسم الشهري.",

    "about.hero.eyebrow":  "عن المنصة",
    "about.hero.title":    "FIND — نبحث لك عن غرضك قبل لا تدور عليه",
    "about.hero.subtitle": "مشروع طلابي من قسم علوم الحاسب في جامعة الإمام عبدالرحمن بن فيصل، يحل مشكلة المفقودات الجامعية بطريقة أذكى: بدل تصفّح مئات المنشورات على مجموعات واتساب أو حسابات إكس، النظام يطابق بلاغك تلقائياً بأربع معايير، لحظة ما ترفعه.",

    "about.why.tag":   "المشكلة",
    "about.why.title": "ليش بنينا FIND؟",
    "about.why.body1": "قبل المنصة، أي طالب يفقد غرضه كان أمامه خيارين: يعلّق منشوراً بمجموعة واتساب ضخمة ويضيع وسط عشرات الرسائل، أو ينشر رقمه الشخصي علناً بحساب إكس ويصير عرضة لأي شخص. ما فيه طريقة منظّمة تربط بين من فقد ومن وجد.",
    "about.why.body2": "FIND بديل مبني خصيصاً لهذي المشكلة: بلاغ منظّم بدل منشور عشوائي، مطابقة تلقائية بدل تصفّح يدوي، ورقم جوالك ما ينكشف إلا لما يصير فيه تطابق حقيقي ويوافق عليه الطرفان.",

    "about.algo.tag":      "التقنية",
    "about.algo.title":    "كيف تشتغل المطابقة التلقائية؟",
    "about.algo.subtitle": "كل بلاغ جديد يُقارَن تلقائياً بكل البلاغات المعاكسة (مفقود ↔ موجود) على أربع معايير، وتُجمع النتائج بنسبة تطابق واحدة من 0 إلى 100%.",
    "about.algo.text.title": "تشابه الوصف",
    "about.algo.text.body":  "نقارن نص وصف بلاغك مع البلاغات الأخرى باستخدام خوارزمية تشابه نصوص (pg_trgm)، فتكتشف القرابة حتى لو الكلمات مو مطابقة حرفياً.",
    "about.algo.image.title": "بصمة الصورة",
    "about.algo.image.body":  "لو رفعت صورة، نحسب لها بصمة رقمية (dHash) ونقارنها ببصمات باقي الصور عبر حساب Hamming Distance — نفس الغرض تقريباً يطلع له بصمة قريبة حتى لو زاوية التصوير مختلفة.",
    "about.algo.location.title": "الموقع",
    "about.algo.location.body":  "نطابق حسب نفس موقع الفقدان أو العثور داخل الحرم الجامعي — من مبنى كلية الحاسب إلى المكتبة والمواقف.",
    "about.algo.time.title": "التوقيت",
    "about.algo.time.body":  "نقارن تاريخ الفقدان بتاريخ العثور؛ كل ما قربت الفترة بينهم زادت نسبة التطابق.",
    "about.algo.note": "النتيجة تظهر لك كنسبة تطابق واحدة بصفحة \"البلاغات المتطابقة\" — وما تشوف إلا البلاغات اللي تخصك فعلاً.",

    "about.privacy.tag":      "الخصوصية",
    "about.privacy.title":    "خصوصيتك مو مجرد وعد، هي مبنية داخل النظام",
    "about.privacy.subtitle": "كل قاعدة حماية تحت مطبّقة على مستوى قاعدة البيانات نفسها (Row Level Security)، مو مجرد شرط بواجهة المستخدم يقدر أي أحد يتجاوزه.",
    "about.privacy.1.title": "بلاغك محمي بسياسات RLS",
    "about.privacy.1.body":  "قاعدة البيانات نفسها ترفض أي محاولة وصول لبلاغ ما يخصك أو ما له علاقة بتطابق فعلي معك — حتى لو حد حاول يتلاعب بالواجهة.",
    "about.privacy.2.title": "رقم جوالك يظهر مرة وحدة، وبعد الموافقة فقط",
    "about.privacy.2.body":  "ما ينكشف رقمك لأي طرف إلا بعد ما تطلب التواصل ويوافق عليه صاحب البلاغ الآخر صراحة.",
    "about.privacy.3.title": "الصور بحاوية خاصة، مو عامة",
    "about.privacy.3.body":  "صور البلاغات تُخزَّن بحاوية تخزين خاصة (private storage)، ما توصل إلا برابط موقَّع لمن يحق له يشوفها أصلاً.",
    "about.privacy.4.title": "التواصل داخل المنصة أول ما يصير تطابق",
    "about.privacy.4.body":  "بعد الموافقة، تُفتح محادثة داخل المنصة بدل ما تُضطر تبادل رقمك مباشرة مع شخص غريب من البداية.",

    "about.journey.tag":      "الرحلة",
    "about.journey.title":    "من لحظة الفقدان إلى استرجاع الغرض",
    "about.journey.1.title": "تسجّل الدخول برقمك الجامعي",
    "about.journey.1.body":  "بدون إيميل ظاهر أو بيانات خارجية — فقط رقمك الجامعي وكلمة مرورك.",
    "about.journey.2.title": "تقدّم بلاغك",
    "about.journey.2.body":  "تختار مفقود أو موجود، وتضيف الوصف والصورة (اختياري) والموقع والتاريخ.",
    "about.journey.3.title": "المطابقة تشتغل تلقائياً",
    "about.journey.3.body":  "بمجرد ما تنشر بلاغك، النظام يقارنه بكل البلاغات المعاكسة على الفور — بدون أي تدخل يدوي من أحد.",
    "about.journey.4.title": "إشعار وموافقة الطرفين",
    "about.journey.4.body":  "لو فيه تطابق قوي، توصلك إشعار وتقدر تطلب التواصل؛ الطرف الآخر يوافق أو يرفض.",
    "about.journey.5.title": "محادثة وتسليم",
    "about.journey.5.body":  "بعد الموافقة، تُفتح محادثة خاصة ويظهر رقم التواصل، وتقدر تأكد استلام الغرض من نفس الصفحة.",

    "about.project.tag":   "خلف الكواليس",
    "about.project.title": "مشروع طلابي، مو منتجاً تجارياً",
    "about.project.body":  "FIND مشروع ضمن مقرر CSC 305 بقسم علوم الحاسب في جامعة الإمام عبدالرحمن بن فيصل. الهدف الأساسي تطبيق عملي لمهارات بناء نظام متكامل: قاعدة بيانات، خوارزميات مطابقة، صلاحيات وصول دقيقة، وتجربة مستخدم كاملة بلغتين. المنصة تجريبية وغير تابعة رسمياً لإدارة الجامعة.",

    "about.faq.tag":   "أسئلة متكررة",
    "about.faq.title": "الأسئلة المتوقعة",
    "about.faq.1.q": "هل المنصة تابعة رسمياً للجامعة؟",
    "about.faq.1.a": "لا، هي مشروع طلابي أكاديمي ضمن مقرر CSC 305، مو قناة رسمية تابعة لإدارة الجامعة.",
    "about.faq.2.q": "هل استخدام المنصة مجاني؟",
    "about.faq.2.a": "نعم، تقديم البلاغات والتواصل ومتابعة الحالة كلها مجانية بالكامل.",
    "about.faq.3.q": "ليش أحتاج أسجل دخول برقمي الجامعي بالذات؟",
    "about.faq.3.a": "لأجل التأكد من أن كل مستخدمي المنصة من منسوبي الجامعة فقط، وهذا يحمي البلاغات من إساءة الاستخدام من جهات خارجية.",
    "about.faq.4.q": "ما الذي يضمن دقة المطابقة؟",
    "about.faq.4.a": "تعطيك الخوارزمية نسبة تطابق تقديرية مبنية على الوصف والصورة والموقع والوقت، لكن القرار النهائي بالتواصل وتأكيد الاستلام يعود إليك دائماً.",
    "about.faq.5.q": "أريد حذف بلاغ، ما هي الطريقة؟",
    "about.faq.5.a": "من صفحة \"بلاغاتي\" يمكنك حذف أي بلاغ ما زال قيد الانتظار (أي لم يحصل على تطابق تمت الموافقة عليه بعد).",

    "about.cta.title":  "جاهز تبدأ؟",
    "about.cta.body":   "سواء فقدت غرضك أو لقيت غرض غيرك، بلاغك الأول يبدأ المطابقة فوراً.",
    "about.cta.button": "قدّم بلاغك الآن"
  },

  en: {
    "nav.filing":        "File a report",
    "nav.about":         "About the platform",
    "nav.notifications": "Reports",
    "nav.signup":        "Create account",
    "nav.login":         "Login",
    "nav.home":          "Home",

    "hero.eyebrow":  "The university's lost & found reporting platform",
    "hero.title":    "Your lost item is closer than you think",
    "hero.subtitle": "Report what you lost or found, and let FIND handle the rest.",
    "hero.cta.lost":  "I lost something",
    "hero.cta.found": "I found something",
    "hero.note":      "Your report is only visible to someone with a genuinely matching report",

    "hero.signals.label":   "Matched automatically by",
    "hero.signal.desc":     "Description",
    "hero.signal.image":    "Photo",
    "hero.signal.location": "Location",
    "hero.signal.time":     "Time",

    "match.lost.title": "Brown leather wallet",
    "match.lost.meta":  "CCSIT building — yesterday",
    "match.found.title": "Brown wallet",
    "match.found.meta":  "Central Library — today",
    "match.score.label": "match",

    "steps.eyebrow": "How it works",
    "steps.title":   "From report to recovery, in three steps",
    "steps.1.title": "Sign in and file your report",
    "steps.1.body":  "Sign in with your student or staff details, then choose lost or found and add a description, photo, location and date.",
    "steps.2.title": "Automatic matching",
    "steps.2.body":  "The platform compares your report against every other report and shows you only the closest ones, each with a clear match percentage.",
    "steps.3.title": "Confirm and connect",
    "steps.3.body":  "Once both sides agree, a private, fully monitored in-platform chat opens, and each side's contact number is revealed if needed, until the handover is complete.",

    "trust.title": "Complete privacy",
    "trust.body":  "Your report is never visible to a random browsing user — only to people with a genuinely matching report.",
    "trust.stat1.num": "0",
    "trust.stat1.txt": "reports shown to a new user with no report of their own",
    "trust.stat2.num": "100%",
    "trust.stat2.txt": "of reports pass through strict matching checks before reaching any user",
    "trust.stat3.num": "4",
    "trust.stat3.txt": "matching signals: description, photo, location, time",
    "trust.stat4.num": "1",
    "trust.stat4.txt": "the only contact point — secure, trusted, and fully monitored by FIND",

    "home.values.tag":   "Why FIND?",
    "home.values.title": "Not just an ordinary reporting platform",

    "home.values.speed.title": "Instant matching",
    "home.values.speed.body":  "Saves the time usually lost to unreliable social-media chats when trying to get an item back to its real owner.",

    "home.values.privacy.title": "Privacy built into the system",
    "home.values.privacy.body":  "Your data and reports are fully protected. Any contact request needs your approval first, then opens a secure, fully monitored chat that reveals only your number and the other party's — you can close it for good once the handover is confirmed, and the contact record is kept with the platform's admins.",

    "home.values.accuracy.title": "Four-signal match accuracy",
    "home.values.accuracy.body":  "Description, photo, location and time combined, so a match against another report is never a random guess — it's real.",

    "home.categories.tag":      "All categories",
    "home.categories.title":    "Pick your item's category",
    "home.categories.subtitle": "From phones to keys, file under the right category and let the matching be more accurate.",

    "menu.myReports": "My Reports",
    "menu.chat":      "Messages",
    "menu.myProfile": "My Profile",
    "menu.notifications": "Notifications",
    "menu.logout":    "Log out",
    "menu.admin":     "Dashboard",

    "auth.signup.title":    "Create a new account",
    "auth.signup.subtitle": "For students and staff of Imam Abdulrahman Bin Faisal University",
    "auth.login.title":     "Log in",
    "auth.login.subtitle":  "Enter your university ID and password",
    "auth.signup.submit":   "Create account",
    "auth.login.submit":    "Log in",
    "auth.haveAccount":     "Already have an account?",
    "auth.noAccount":       "Don't have an account?",
    "auth.goLogin":         "Log in",
    "auth.goSignup":        "Create one",

    "field.fullName":              "Full name",
    "field.universityId":          "University ID",
    "field.userType":              "User type",
    "field.userType.student":      "Student",
    "field.userType.faculty":      "Faculty",
    "field.userType.staff":        "Admin Staff",
    "field.phone":                 "Phone number",
    "field.password":              "Password",
    "field.confirmPassword":       "Confirm password",

    "error.passwordMismatch":   "Passwords do not match",
    "error.universityIdFormat": "University ID must be 6-12 digits",
    "error.phoneFormat":        "Invalid phone number format (05xxxxxxxx)",
    "error.genericSignup":      "Could not create account, please try again",
    "error.invalidLogin":       "Incorrect university ID or password",
    "success.signup":           "Your account was created successfully",

    "profile.title":        "My profile",
    "profile.fullName":     "Full name",
    "profile.universityId": "University ID",
    "profile.userType":     "Account type",
    "profile.phone":        "Phone number",
    "profile.logout":       "Log out",

        "footer.rights": "Imam Abdulrahman Bin Faisal University",
    "footer.about":  "About",
    "footer.contact": "Contact us",
    "footer.quicklinks": "Site Links",
    "footer.devteam": "Project Developers",
    "footer.teamLead": "Team Lead /",

    "report.lost.tag":      "Lost",
    "report.lost.title":    "Report a lost item",
    "report.lost.subtitle": "Every detail you add improves the accuracy of automatic matching.",
    "report.lost.submit":   "Post lost report",

    "report.found.tag":      "Found",
    "report.found.title":    "Report a found item",
    "report.found.subtitle": "Your info stays hidden unless a genuinely matching lost report exists.",
    "report.found.submit":   "Post found report",

    "report.privacyNote": "Your report is never visible to a random user — only to people with a genuinely close report.",

    "report.section.photo":     "Item photo (optional, but greatly improves matching accuracy)",
    "report.section.details":   "Item details",
    "report.section.whenWhere": "Where and when",

    "report.dropzone.title": "Drag a photo here or click to choose",
    "report.dropzone.hint":  "PNG or JPG — a clearer photo means a better match",

    "field.title":                 "Short item title",
    "field.title.placeholder":     "e.g. Brown leather wallet",
    "field.category":              "Category",
    "field.description":           "Detailed description",
    "field.description.placeholder": "Mention anything that identifies the item: color, brand, scratches or marks...",
    "field.location":              "Location",
    "field.location.placeholder":  "Choose a location",
    "field.date":                  "Date lost",
    "field.dateFound":             "Date found",
    "field.time":                  "Approximate time (optional)",

    "cat.1":  "Electronics",
    "cat.2":  "Mobile Phones",
    "cat.3":  "Wallets & Cards",
    "cat.4":  "Keys",
    "cat.5":  "Bags",
    "cat.6":  "Eyewear",
    "cat.7":  "Watches & Jewelry",
    "cat.8":  "Books & Supplies",
    "cat.9":  "Clothing",
    "cat.10": "Other",

    "loc.1":  "College of Computer Science & IT",
    "loc.2":  "Central Library",
    "loc.3":  "Mosque",
    "loc.4":  "Cafeteria",
    "loc.5":  "Parking Area",
    "loc.6":  "Lecture Halls",
    "loc.7":  "Laboratories",
    "loc.8":  "Auditorium",
    "loc.9":  "Sports Hall",
    "loc.10": "Deanship of Student Affairs",
    "loc.11": "Main Gate",
    "loc.12": "Administration Building",
    "loc.13": "Other",

    "choice.title":    "What are you here to do?",
    "choice.subtitle": "Choose the report type and we'll take you to the right form.",

    "choice.lost.title": "I lost something",
    "choice.lost.body":  "Report your lost item with a description, photo and location, and let the platform find the closest match automatically.",
    "choice.lost.cta":   "Report a lost item",

    "choice.found.title": "I found something",
    "choice.found.body":  "Found someone else's item? Report it — your details stay hidden unless a genuinely matching lost report shows up.",
    "choice.found.cta":   "Report a found item",

    "success.title":       "Your report was submitted",
    "success.subtitle":    "As soon as a matching report shows up, you'll get a notification.",
    "success.refLabel":    "Reference number",
    "success.viewReports": "View my reports",
    "success.backHome":    "Back to home",

    "myReports.title":    "My Reports",
    "myReports.tab.all":  "All",
    "myReports.tab.lost": "Lost",
    "myReports.tab.found":"Found",
    "myReports.loading":  "Loading...",
    "myReports.empty":    "You don't have any reports yet.",
    "myReports.emptyCta": "File your first report",

    "matches.title":         "Reports matching yours",
    "matches.subtitle":      "These reports appeared because they automatically matched one of your reports — no one else can see them.",
    "matches.empty":         "No matching reports yet.",
    "matches.contact":       "Contact",
    "matches.waiting":       "Waiting for a response",
    "matches.incomingClaim": "Contact request — respond from Notifications",
    "matches.goNotifications": "Open notifications",
    "matches.approve":       "Approve",
    "matches.reject":        "Reject",
    "matches.approved":      "Approved",
    "matches.rejectedTag":   "Rejected",
    "matches.contactLabel":  "Contact",
    "matches.openChat":      "Open chat",

    "notif.title":   "Notifications",
    "notif.markAll": "Mark all as read",
    "notif.empty":   "No notifications yet.",

    "chat.title":           "Messages",
    "chat.conversations":   "My conversations",
    "chat.noConversations": "No conversations yet — one opens automatically once a match is approved.",
    "chat.selectPrompt":    "Select a conversation",
    "chat.placeholder":     "Type your message...",
    "chat.send":            "Send",
    "chat.resolve":         "Item received ✅",
    "chat.closedNote":      "This conversation is closed — the handover was confirmed.",

    "admin.title":          "Admin Dashboard",
    "admin.stat.total":     "Total reports",
    "admin.stat.lost":      "Lost reports",
    "admin.stat.found":     "Found reports",
    "admin.stat.resolved":  "Resolved",
    "admin.stat.unresolved":"Pending",
    "admin.stat.rate":      "Resolution rate",
    "admin.byCategory":     "By category",
    "admin.byLocation":     "By location",
    "admin.monthly":        "Monthly reports",
    "admin.legend.total":   "Total",
    "admin.legend.resolved":"Resolved",
    "admin.selectYearNote": "Select a specific year (not \"All years\") to see the monthly chart.",

    "about.hero.eyebrow":  "About the platform",
    "about.hero.title":    "FIND — we look for your item before you have to",
    "about.hero.subtitle": "A student project from the Computer Science department at Imam Abdulrahman Bin Faisal University, solving campus lost & found the smart way: instead of scrolling hundreds of posts on WhatsApp groups or X accounts, the system matches your report automatically on four signals the moment you post it.",

    "about.why.tag":   "The problem",
    "about.why.title": "Why we built FIND",
    "about.why.body1": "Before the platform, a student who lost something had two options: post in a huge WhatsApp group and get buried under dozens of messages, or publish their personal phone number publicly on an X account and be exposed to anyone. There was no structured way to connect who lost something with who found it.",
    "about.why.body2": "FIND was built specifically for this problem: a structured report instead of a random post, automatic matching instead of manual browsing, and a phone number that's only revealed once a real match exists and both sides agree.",

    "about.algo.tag":      "The technology",
    "about.algo.title":    "How does automatic matching work?",
    "about.algo.subtitle": "Every new report is automatically compared against all opposite-type reports (lost ↔ found) on four signals, combined into a single match score from 0 to 100%.",
    "about.algo.text.title": "Description similarity",
    "about.algo.text.body":  "We compare your report's text against other reports using a text-similarity algorithm (pg_trgm), catching resemblance even when the wording isn't identical.",
    "about.algo.image.title": "Image fingerprint",
    "about.algo.image.body":  "If you uploaded a photo, we compute a digital fingerprint (dHash) and compare it against other photos' fingerprints via Hamming distance — roughly the same item produces a close fingerprint even from a different angle.",
    "about.algo.location.title": "Location",
    "about.algo.location.body":  "We match on the actual location the item was lost or found on campus — from the CCSIT building to the library and parking areas.",
    "about.algo.time.title": "Timing",
    "about.algo.time.body":  "We compare the date something was lost against the date it was found; the closer the two dates, the higher the match score.",
    "about.algo.note": "You see the result as a single match score on the \"Matches\" page — and you only ever see reports that genuinely relate to yours.",

    "about.privacy.tag":      "Privacy",
    "about.privacy.title":    "Your privacy isn't a promise, it's built into the system",
    "about.privacy.subtitle": "Every protection below is enforced at the database level itself (Row Level Security), not just a check in the interface someone could bypass.",
    "about.privacy.1.title": "Your report is protected by RLS policies",
    "about.privacy.1.body":  "The database itself rejects any attempt to access a report that isn't yours or genuinely matched with yours — even if someone tampers with the interface.",
    "about.privacy.2.title": "Your phone number is shown once, and only after approval",
    "about.privacy.2.body":  "Your number isn't revealed to anyone until you request contact and the other report's owner explicitly approves it.",
    "about.privacy.3.title": "Photos live in a private bucket, not a public one",
    "about.privacy.3.body":  "Report photos are stored in a private storage bucket and only reachable through a signed link for someone who's actually entitled to see it.",
    "about.privacy.4.title": "Conversations happen in-platform once matched",
    "about.privacy.4.body":  "After approval, a chat opens inside the platform instead of forcing you to exchange your number with a stranger from the start.",

    "about.journey.tag":      "The journey",
    "about.journey.title":    "From the moment you lose something to getting it back",
    "about.journey.1.title": "Sign in with your university ID",
    "about.journey.1.body":  "No visible email or outside data — just your university ID and password.",
    "about.journey.2.title": "File your report",
    "about.journey.2.body":  "Choose lost or found, then add a description, an optional photo, a location and a date.",
    "about.journey.3.title": "Matching runs automatically",
    "about.journey.3.body":  "The moment you publish your report, the system compares it to every opposite report instantly — no manual step from anyone.",
    "about.journey.4.title": "Notification and mutual approval",
    "about.journey.4.body":  "If there's a strong match, you get notified and can request contact; the other side approves or declines.",
    "about.journey.5.title": "Chat and handover",
    "about.journey.5.body":  "Once approved, a private chat opens and a contact number is revealed, and you can confirm the handover from the same page.",

    "about.project.tag":   "Behind the scenes",
    "about.project.title": "A student project, not a commercial product",
    "about.project.body":  "FIND is a project for the CSC 305 course in the Computer Science department at Imam Abdulrahman Bin Faisal University. The goal is hands-on practice building a full system: a database, matching algorithms, fine-grained access control, and a complete bilingual user experience. The platform is experimental and not officially affiliated with university administration.",

    "about.faq.tag":   "FAQ",
    "about.faq.title": "Questions you may have",
    "about.faq.1.q": "Is this officially run by the university?",
    "about.faq.1.a": "No, it's an academic student project for the CSC 305 course, not an official channel run by university administration.",
    "about.faq.2.q": "Is using the platform free?",
    "about.faq.2.a": "Yes, filing reports, contacting other users, and tracking status are all completely free.",
    "about.faq.3.q": "Why do I need to sign in with my university ID specifically?",
    "about.faq.3.a": "To make sure that all users of the platform are members of the university only, which protects reports from misuse by outside parties.",
    "about.faq.4.q": "What ensures the accuracy of matching?",
    "about.faq.4.a": "The algorithm gives you an estimated match score based on description, photo, location and time, but the final decision to contact and confirm always stays with you.",
    "about.faq.5.q": "I want to delete a report — how do I do it?",
    "about.faq.5.a": "From the \"My Reports\" page you can delete any report that's still pending (hasn't received an approved match yet).",

    "about.cta.title":  "Ready to start?",
    "about.cta.body":   "Whether you lost something or found someone else's item, your first report kicks off matching right away.",
    "about.cta.button": "File your report now"
  }
};

const STORAGE_KEY = "find_lang";

/* أسماء فريق التطوير في الفوتر (بالعربي والإنجليزي) */
const FOOTER_TEAM = [
  { ar: "فهد عادل الغامدي",      en: "Fahad Adel Alghamdi", lead: true },
  { ar: "عبدالله محمد الشهيل",    en: "Abdullah Muhammad Alshuhail" },
  { ar: "أحمد محمد الخلف",        en: "Ahmad Mohammed Al-Khalaf" },
  { ar: "إبراهيم مصطفى الرمّاح",   en: "Ibrahim Mustafa Alrammah" },
  { ar: "حسين سعيد",              en: "Hussain Saeed" },
  { ar: "سراج منير الخضاب",       en: "Seraj Muneer Alkhadab" },
];

/* يترجم باقي الفوتر (الأسماء ووصف شعار الجامعة) في كل الصفحات */
function renderFooter(lang, dict) {
  document.querySelectorAll(".site-footer").forEach((footer) => {
    const logo = footer.querySelector(".footer-uni-logo");
    if (logo) logo.alt = dict["footer.rights"];

    const head = footer.querySelector('[data-i18n="footer.devteam"]');
    const col = head && head.parentElement;
    if (!col) return;
    col.querySelectorAll(":scope > span").forEach((s) => s.remove());

    FOOTER_TEAM.forEach((m) => {
      const span = document.createElement("span");
      const name = m[lang] || m.ar;
      if (m.lead) {
        span.className = "footer-lead";
        const em = document.createElement("em");
        em.textContent = dict["footer.teamLead"];
        em.style.marginInlineStart = "0";
        em.style.marginInlineEnd = "6px";
        span.append(em, name);
      } else {
        span.textContent = name;
      }
      col.appendChild(span);
    });
  });
}

function applyLanguage(lang) {
  const dict = DICTIONARY[lang] || DICTIONARY.ar;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
  });

  renderFooter(lang, dict);

  const switchBtn = document.querySelector("[data-lang-switch]");
  if (switchBtn) switchBtn.textContent = lang === "ar" ? "English" : "العربية";

  localStorage.setItem(STORAGE_KEY, lang);
}

function toggleLanguage() {
  const current = localStorage.getItem(STORAGE_KEY) || "ar";
  applyLanguage(current === "ar" ? "en" : "ar");
}

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem(STORAGE_KEY) || "ar";
  applyLanguage(saved);

  const switchBtn = document.querySelector("[data-lang-switch]");
  if (switchBtn) switchBtn.addEventListener("click", toggleLanguage);
});