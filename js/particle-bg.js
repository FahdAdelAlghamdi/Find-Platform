/* ============================================================
   FIND — Wave-mesh background (all pages)
   شبكة نقطية كاملة تغطي الصفحة وتتحرك مثل تموّج الماء: كل نقطة
   بالشبكة تهتز رأسياً (وبانزياح أفقي بسيط) وفق دالة موجية تعتمد
   على موقعها والزمن، والخطوط بينها تلمع أكثر عند قمة الموجة —
   بمزيج بين الأزرق الباهت والأبيض، مع لمسة ذهبية خفيفة عشوائية
   على بعض النقاط. المؤشر يزيد تموّج النقاط القريبة منه بلطف.

   خلف نص العنوان (هيرو الرئيسية، أو عنوان أي صفحة داخلية) نطفّئ
   سطوع الشبكة تدريجياً عشان ما تطلع نقطة ساطعة وكأنها دائرة بيضاء
   فوق الكلام — بدون ما نغيّر شكل الشبكة بباقي الصفحة.

   لا تعتمد على أي مكتبة خارجية.
   ============================================================ */

(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // منطقة حماية النص من سطوع الشبكة: أي صفحة تحدد عنصرها بـ
  // data-mesh-shield، وإلا نستخدم عنوان الصفحة حسب نوعها
  const heroEl =
    document.querySelector("[data-mesh-shield]") ||
    document.querySelector(
      ".hero-content, .notif-head, .matches-head, .reports-head, .admin-head, " +
      ".report-header, .choice-head, .success-card, " +
      ".chat-page > .container > .heading, .section > .container > h1.heading"
    );

  const STAR_A = [148, 172, 202]; // أزرق باهت — قاع الموجة
  const STAR_B = [232, 238, 246]; // أبيض تقريباً — منتصف الموجة
  const GOLD_A = [184, 134, 59];  // --gold-500 — لمسة القمة الذهبية
  const GOLD_B = [217, 183, 122]; // --gold-300

  let W, H, grid = [], cols = 0, rows = 0, spacing = 60;
  const mouse = { x: -9999, y: -9999 };

  const lerp = (a, b, t) => a + (b - a) * t;
  const lerpColor = (c1, c2, t) =>
    `${Math.round(lerp(c1[0], c2[0], t))},${Math.round(lerp(c1[1], c2[1], t))},${Math.round(lerp(c1[2], c2[2], t))}`;

  /* ---------- بناء شبكة النقاط (تغطي كامل الشاشة + هامش) ---------- */
  function buildGrid() {
    spacing = W < 700 ? 46 : W < 1100 ? 56 : 68;
    cols = Math.ceil(W / spacing) + 2;
    rows = Math.ceil(H / spacing) + 2;

    grid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          baseX: c * spacing,
          baseY: r * spacing,
          gold: Math.random() < 0.07,
        });
      }
      grid.push(row);
    }
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildGrid();
  }

  /* ---------- دالة الموجة: تموّج قطري يجمع بين موجتين بسرعتين مختلفتين ---------- */
  const AMP_Y = 14;   // ارتفاع تموّج الشبكة رأسياً
  const AMP_X = 5;    // انزياح أفقي بسيط لإحساس أكثر سيولة
  const K1 = 0.012, K2 = 0.02;
  const SPEED = 0.9;

  function waveAt(x, y, t) {
    return 0.6 * Math.sin(x * K1 - t * SPEED) +
           0.4 * Math.sin(y * K2 + t * SPEED * 0.8 + x * 0.004);
  }

  /* مكان منطقة النص — يُحسب مرة وحدة بكل فريم (مو لكل نقطة) */
  function getShieldRect() {
    if (!heroEl) return null;
    const r = heroEl.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return null;
    return r;
  }

  /* ---------- منطقة التخفيف خلف النص ----------
     نرجع 1 (سطوع طبيعي) خارج المنطقة، وتنخفض تدريجياً كل ما
     قربنا من مربع النص لحد قيمة دنيا بالداخل — بدون حافة حادة. */
  function heroDamping(x, y, r) {
    if (!r) return 1;

    const pad = 22, fade = 70, minInside = 0.16;
    const left = r.left - pad, right = r.right + pad;
    const top = r.top - pad, bottom = r.bottom + pad;

    const dx = Math.max(left - x, 0, x - right);
    const dy = Math.max(top - y, 0, y - bottom);
    const dist = Math.max(dx, dy);

    if (dist <= 0) return minInside;
    if (dist >= fade) return 1;
    return lerp(minInside, 1, dist / fade);
  }

  function step(tMs) {
    ctx.clearRect(0, 0, W, H);
    const t = tMs * 0.001;
    const shield = getShieldRect();

    /* موضع كل نقطة بعد تطبيق الموجة + تأثير طفيف من الماوس،
       وحساب معامل التخفيف الخاص بها إذا وقعت خلف النص */
    const pos = new Array(rows);
    for (let r = 0; r < rows; r++) {
      pos[r] = new Array(cols);
      for (let c = 0; c < cols; c++) {
        const node = grid[r][c];
        const w = waveAt(node.baseX, node.baseY, t);
        let x = node.baseX + w * AMP_X;
        let y = node.baseY + w * AMP_Y;

        const dx = x - mouse.x, dy = y - mouse.y;
        const dist2 = dx * dx + dy * dy;
        const REPEL = 110;
        if (dist2 < REPEL * REPEL) {
          const dist = Math.sqrt(dist2) || 1;
          const force = (1 - dist / REPEL) * 14;
          x += (dx / dist) * force;
          y += (dy / dist) * force;
        }

        pos[r][c] = { x, y, w, gold: node.gold, damp: heroDamping(x, y, shield) };
      }
    }

    /* خطوط الشبكة: كل نقطة توصل بجارتها يميناً وتحتها فقط
       (يكفي لرسم شبكة كاملة متصلة بدون تكرار كل خط مرتين) */
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const p = pos[r][c];
        const pb = (p.w + 1) / 2;

        if (c < cols - 1) {
          const q = pos[r][c + 1];
          const damp = (p.damp + q.damp) / 2;
          const b = ((pb + (q.w + 1) / 2) / 2) * damp;
          const gold = p.gold || q.gold;
          ctx.strokeStyle = gold
            ? `rgba(217,183,122,${(0.08 + b * 0.22) * damp})`
            : `rgba(148,172,202,${(0.06 + b * 0.16) * damp})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
        if (r < rows - 1) {
          const q = pos[r + 1][c];
          const damp = (p.damp + q.damp) / 2;
          const b = ((pb + (q.w + 1) / 2) / 2) * damp;
          const gold = p.gold || q.gold;
          ctx.strokeStyle = gold
            ? `rgba(217,183,122,${(0.08 + b * 0.22) * damp})`
            : `rgba(148,172,202,${(0.06 + b * 0.16) * damp})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    /* النقاط نفسها — تلمع أبيض عند قمة الموجة وتخفت أزرق عند قاعها،
       وتنكمش وتخفت أكثر خلف النص حتى ما تطلع كدائرة بارزة */
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const p = pos[r][c];
        const tw = ((p.w + 1) / 2) * p.damp;
        const rgb = p.gold ? lerpColor(GOLD_A, GOLD_B, tw) : lerpColor(STAR_A, STAR_B, tw);
        const alpha = lerp(0.45, 1, p.damp);
        ctx.fillStyle = `rgba(${rgb},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (1.3 + tw * 1.1) * lerp(0.6, 1, p.damp), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* خطوط ذهبية خفيفة من النقاط القريبة لمؤشر الماوس */
    if (mouse.x > -999) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = pos[r][c];
          const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (d < 150) {
            ctx.strokeStyle = `rgba(184,134,59,${(1 - d / 150) * 0.35 * p.damp})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    if (!prefersReduced) requestAnimationFrame(step);
  }

  window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  requestAnimationFrame(step);
})();