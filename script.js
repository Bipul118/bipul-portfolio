/* ===========================================================
   BIPUL MAITY — PORTFOLIO SCRIPT
   =========================================================== */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------
     THEME TOGGLE (persisted)
  ----------------------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const THEME_KEY = 'bm-portfolio-theme';

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  let savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) { /* storage unavailable */ }

  if (!savedTheme) {
    savedTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  applyTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage unavailable */ }
  });

  /* -----------------------------------------------------------
     FOOTER YEAR
  ----------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------------
     NAVBAR — scrolled state, mobile toggle, active link
  ----------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const scrollProgress = document.getElementById('scrollProgress');
  const navLinkEls = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('main section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 12);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = progress + '%';

    let currentId = '';
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach((sec) => {
      if (scrollPos >= sec.offsetTop) currentId = sec.id;
    });
    navLinkEls.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinkEls.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* -----------------------------------------------------------
     CURSOR GLOW (desktop only, follows pointer)
  ----------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion) {
    let rafId = null;
    window.addEventListener('mousemove', (e) => {
      cursorGlow.classList.add('active');
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      });
    });
    document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
  }

  /* -----------------------------------------------------------
     SCROLL REVEAL
  ----------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('in-view'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* -----------------------------------------------------------
     TERMINAL TYPING EFFECT (hero)
  ----------------------------------------------------------- */
  const terminalText = document.getElementById('terminalText');
  const typingPhrases = [
    'initializing bipul_maity.sys',
    'loading ai_ml_modules...',
    'compiling verilog_rtl...',
    'status: ready_to_build()'
  ];

  function typeLoop() {
    if (!terminalText || prefersReducedMotion) {
      if (terminalText) terminalText.textContent = typingPhrases[0];
      return;
    }
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = typingPhrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        terminalText.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = false;
          setTimeout(() => { deleting = true; tick(); }, 1500);
          return;
        }
      } else {
        charIndex--;
        terminalText.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % typingPhrases.length;
        }
      }

      const speed = deleting ? 28 : 48;
      setTimeout(tick, speed);
    }
    tick();
  }
  typeLoop();

  /* -----------------------------------------------------------
     OSCILLOSCOPE WAVEFORM ANIMATION
  ----------------------------------------------------------- */
  const waveLine = document.getElementById('waveLine');
  const waveLine2 = document.getElementById('waveLine2');

  function buildWavePoints(t, amplitude, freq, width, height, midY, noiseFactor) {
    const points = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const x = (width / steps) * i;
      const phase = (i / steps) * Math.PI * 2 * freq + t;
      const noise = noiseFactor ? Math.sin(phase * 3.3 + t * 2) * (amplitude * 0.18) : 0;
      const y = midY + Math.sin(phase) * amplitude + noise;
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(' ');
  }

  if (waveLine && waveLine2) {
    if (prefersReducedMotion) {
      waveLine.setAttribute('points', buildWavePoints(0, 28, 2, 400, 160, 60, true));
      waveLine2.setAttribute('points', buildWavePoints(1.2, 18, 3, 400, 160, 110, false));
    } else {
      let t = 0;
      function animateWave() {
        t += 0.045;
        waveLine.setAttribute('points', buildWavePoints(t, 28, 2, 400, 160, 60, true));
        waveLine2.setAttribute('points', buildWavePoints(t * 1.3, 16, 3, 400, 160, 112, false));
        requestAnimationFrame(animateWave);
      }
      animateWave();
    }
  }

  /* -----------------------------------------------------------
     HERO CIRCUIT TRACES (generated SVG paths, PCB style)
  ----------------------------------------------------------- */
  const circuitGroup = document.getElementById('circuitTraces');
  if (circuitGroup) {
    const W = 1200, H = 800;
    const traceCount = 9;
    let svgMarkup = '';

    function randomTrace(seedX, seedY) {
      let x = seedX, y = seedY;
      let d = `M ${x} ${y}`;
      const segments = 4 + Math.floor(Math.random() * 3);
      for (let i = 0; i < segments; i++) {
        const horizontal = Math.random() > 0.5;
        if (horizontal) {
          x += (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 90);
        } else {
          y += (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 90);
        }
        x = Math.max(0, Math.min(W, x));
        y = Math.max(0, Math.min(H, y));
        d += ` L ${x.toFixed(0)} ${y.toFixed(0)}`;
      }
      return { d, endX: x, endY: y };
    }

    for (let i = 0; i < traceCount; i++) {
      const startX = Math.random() * W;
      const startY = Math.random() * H;
      const trace = randomTrace(startX, startY);
      svgMarkup += `<path d="${trace.d}" />`;
      svgMarkup += `<circle cx="${startX.toFixed(0)}" cy="${startY.toFixed(0)}" r="3" />`;
      svgMarkup += `<circle cx="${trace.endX.toFixed(0)}" cy="${trace.endY.toFixed(0)}" r="3" />`;
    }
    circuitGroup.innerHTML = svgMarkup;
  }

  /* -----------------------------------------------------------
     GITHUB CONTRIBUTION GRAPH (placeholder, generated)
  ----------------------------------------------------------- */
  const contribGraph = document.getElementById('contribGraph');
  if (contribGraph) {
    const weeks = 26;
    const days = 7;
    let html = '';
    for (let i = 0; i < weeks * days; i++) {
      const r = Math.random();
      let level = 'l0';
      if (r > 0.92) level = 'l4';
      else if (r > 0.8) level = 'l3';
      else if (r > 0.62) level = 'l2';
      else if (r > 0.42) level = 'l1';
      html += `<span class="contrib-cell ${level}"></span>`;
    }
    contribGraph.innerHTML = html;
  }

})();
