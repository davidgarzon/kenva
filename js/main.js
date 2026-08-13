/* ============================================================
   KENVA LABS — Main JavaScript
   Neural canvas · Nav · Scroll reveal · Card glow
   ============================================================ */

/* ── Neural Network Canvas ─────────────────────────────────── */
(function initNeural() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  /* Respect prefers-reduced-motion */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');

  const CFG = {
    count:   65,
    speed:   0.25,
    radius:  1.5,
    maxDist: 155,
    node:    [99, 102, 241],
    accent:  [0,  212, 255],
  };

  let nodes = [], W, H, raf;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    build();
  }

  function build() {
    nodes = Array.from({ length: CFG.count }, () => ({
      x:      Math.random() * W,
      y:      Math.random() * H,
      vx:     (Math.random() - 0.5) * CFG.speed,
      vy:     (Math.random() - 0.5) * CFG.speed,
      r:      Math.random() * CFG.radius + 0.5,
      phase:  Math.random() * Math.PI * 2,
      accent: Math.random() < 0.08,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CFG.maxDist) {
          const a = (1 - d / CFG.maxDist) * 0.13;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${CFG.node.join(',')},${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      const pulse = Math.sin(n.phase) * 0.5 + 0.5;
      const a = 0.3 + pulse * 0.5;
      const c = n.accent ? CFG.accent : CFG.node;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * (1 + pulse * 0.2), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.join(',')},${a})`;
      ctx.fill();
    });
  }

  function update() {
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      n.phase += 0.018;
      if (n.x < 0 || n.x > W) { n.vx *= -1; n.x = Math.max(0, Math.min(W, n.x)); }
      if (n.y < 0 || n.y > H) { n.vy *= -1; n.y = Math.max(0, Math.min(H, n.y)); }
    });
  }

  function loop() {
    draw();
    update();
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  loop();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else loop();
  });
})();


/* ── Navigation ────────────────────────────────────────────── */
(function initNav() {
  const nav  = document.getElementById('nav');
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 16);
  }, { passive: true });

  if (ham && menu) {
    ham.addEventListener('click', () => {
      const open = ham.classList.toggle('open');
      menu.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', String(open));
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        ham.classList.remove('open');
        menu.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();


/* ── Scroll Reveal ─────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => io.observe(el));
})();


/* ── Featured card: mouse-follow glow ─────────────────────── */
(function initCardGlow() {
  document.querySelectorAll('.card--featured').forEach(card => {
    const glow = card.querySelector('.card__glow-fx');
    if (!glow) return;

    card.addEventListener('mousemove', ({ clientX, clientY }) => {
      const { left, top } = card.getBoundingClientRect();
      glow.style.background =
        `radial-gradient(circle at ${clientX - left}px ${clientY - top}px, rgba(99,102,241,.14) 0%, transparent 55%)`;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      glow.style.background = '';
    });
  });
})();


/* ── About photo: show only if the file actually loads ────── */
(function initAboutPhoto() {
  const img = document.querySelector('.about__photo');
  if (!img) return;

  if (img.complete) {
    if (img.naturalWidth > 0) img.hidden = false;
    return;
  }
  img.addEventListener('load', () => { img.hidden = false; });
})();
