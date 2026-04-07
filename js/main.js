/* ============================================================
   KENVA LAB — Main JavaScript
   Neural canvas · Nav · Reveal · Typing · Mouse FX
   ============================================================ */

/* ── Neural Network Canvas ─────────────────────────────────── */
(function initNeural() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CFG = {
    count:      72,
    speed:      0.28,
    radius:     1.6,
    maxDist:    160,
    baseAlpha:  0.55,
    colors: {
      node:  [99, 102, 241],   // indigo
      conn:  [99, 102, 241],
      accentNode: [0, 212, 255], // cyan
    },
  };

  let nodes = [];
  let W, H, raf;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    build();
  }

  function build() {
    nodes = Array.from({ length: CFG.count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * CFG.speed,
      vy: (Math.random() - 0.5) * CFG.speed,
      r:  Math.random() * CFG.radius + 0.5,
      phase: Math.random() * Math.PI * 2,
      accent: Math.random() < 0.08,  // ~8% cyan
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* connections */
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CFG.maxDist) {
          const a = (1 - d / CFG.maxDist) * 0.14;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${CFG.colors.conn.join(',')},${a})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    /* nodes */
    nodes.forEach(n => {
      const pulse = Math.sin(n.phase) * 0.5 + 0.5;
      const a = 0.35 + pulse * 0.5;
      const [r, g, b] = n.accent ? CFG.colors.accentNode : CFG.colors.node;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * (1 + pulse * 0.25), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
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

  window.addEventListener('resize', resize);
  resize();
  loop();

  /* Pause when tab hidden (save CPU) */
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
      ham.setAttribute('aria-expanded', open);
    });

    /* close on link click */
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        ham.classList.remove('open');
        menu.classList.remove('open');
      });
    });
  }

  /* Smooth scroll for all internal anchors */
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


/* ── Typing Effect ─────────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'push boundaries.',
    'solve real problems.',
    'augment human creativity.',
    'redefine what\'s possible.',
    'make intelligence accessible.',
    'transform how we work.',
  ];

  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];

    if (deleting) {
      el.textContent = phrase.slice(0, --ci);
    } else {
      el.textContent = phrase.slice(0, ++ci);
    }

    let delay = deleting ? 38 : 65;

    if (!deleting && ci === phrase.length)  { delay = 2200; deleting = true; }
    else if (deleting && ci === 0)          { deleting = false; pi = (pi + 1) % phrases.length; delay = 380; }

    setTimeout(tick, delay);
  }

  setTimeout(tick, 1400);
})();


/* ── Hero parallax on mouse move ───────────────────────────── */
(function initParallax() {
  const hero  = document.querySelector('.hero__content');
  const title = document.querySelector('.hero__title');
  if (!hero || !title || window.matchMedia('(max-width:860px)').matches) return;

  document.addEventListener('mousemove', ({ clientX, clientY }) => {
    const cx = (clientX / window.innerWidth  - 0.5) * 2;
    const cy = (clientY / window.innerHeight - 0.5) * 2;
    title.style.transform = `translate(${cx * 6}px, ${cy * 4}px)`;
  }, { passive: true });
})();


/* ── Featured card: mouse-follow glow ─────────────────────── */
(function initCardGlow() {
  document.querySelectorAll('.card--featured').forEach(card => {
    const glow = card.querySelector('.card__glow-fx');
    if (!glow) return;

    card.addEventListener('mousemove', ({ clientX, clientY }) => {
      const { left, top } = card.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(99,102,241,.14) 0%, transparent 55%)`;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      glow.style.background = '';
    });
  });
})();


/* ── Stagger child reveal for section headers ──────────────── */
(function initStagger() {
  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(entry.target.children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.08}s`;
            child.classList.add('visible');
          });
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.values-grid').forEach(el => io.observe(el));
})();
