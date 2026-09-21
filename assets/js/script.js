/* ============================================================
   Glen's Mobile Auto Repair Services — interactions
   ============================================================ */
(function () {
  'use strict';

  var PHONE_TEL = 'tel:+18322024204';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header state ---------- */
  var header = document.querySelector('.header');
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 24);
  }

  /* ---------- Mobile navigation ---------- */
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  function setNav(open) {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.toggle('open', open);
    mobileNav.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      setNav(!mobileNav.classList.contains('open'));
    });
  }
  document.addEventListener('click', function (e) {
    if (!mobileNav || !mobileNav.classList.contains('open')) return;
    if (mobileNav.contains(e.target) || (hamburger && hamburger.contains(e.target))) return;
    setNav(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setNav(false);
  });
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setNav(false); });
    });
  }

  /* ---------- Hero: split headline into words ---------- */
  var h1 = document.querySelector('[data-split]');
  if (h1) {
    var words = h1.textContent.trim().split(/\s+/);
    h1.setAttribute('aria-label', words.join(' '));
    h1.innerHTML = words.map(function (w, i) {
      return '<span class="word" style="transition-delay:' + (0.15 + i * 0.08).toFixed(2) + 's">' + w + '</span>';
    }).join(' ');
  }
  var hero = document.getElementById('hero');
  function revealHero() { if (hero) hero.classList.add('ready'); }
  if (document.readyState === 'complete') revealHero();
  else window.addEventListener('load', revealHero);
  setTimeout(revealHero, 700); // safety so content never stays hidden

  /* ---------- Hero: mouse parallax on HUD layers ---------- */
  if (hero && !reduced && window.matchMedia('(pointer:fine)').matches) {
    var layers = hero.querySelectorAll('[data-depth]');
    var heroBg = hero.querySelector('.hero-bg');
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach(function (l) {
        var d = parseFloat(l.getAttribute('data-depth')) || 0.05;
        l.style.transform = 'translate(' + (-x * d * 120).toFixed(1) + 'px,' + (-y * d * 120).toFixed(1) + 'px)';
      });
      if (heroBg) heroBg.style.transform = 'translate(' + (x * 12).toFixed(1) + 'px,' + (y * 12).toFixed(1) + 'px)';
    });
    hero.addEventListener('mouseleave', function () {
      layers.forEach(function (l) { l.style.transform = ''; });
      if (heroBg) heroBg.style.transform = '';
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- We come to you: image scroll parallax ---------- */
  var pimg = document.querySelector('[data-parallax]');
  function onScrollParallax() {
    if (!pimg || reduced) return;
    var r = pimg.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.bottom < 0 || r.top > vh) return;
    var progress = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5
    pimg.style.transform = 'translateY(' + (progress * -40).toFixed(1) + 'px) scale(1.12)';
  }

  /* ---------- Interactive showcase ---------- */
  var SHOWCASE = {
    battery: { icon: '#i-battery', title: 'Battery & Charging', text: 'A no-start or slow crank is often the battery or charging system. We test and replace batteries and inspect the alternator right where your vehicle sits.' },
    brakes: { icon: '#i-brake', title: 'Brakes', text: 'Squealing, grinding or a soft pedal? We service pads, rotors and calipers on-site so your stopping power stays dependable.' },
    engine: { icon: '#i-engine', title: 'Engine', text: 'Warning lights, rough idle or misfires — we diagnose common engine faults and handle practical repairs at your location.' },
    electrical: { icon: '#i-chip', title: 'Electrical', text: 'Parasitic drains, dead accessories and sensor faults are traced with proper diagnostic equipment before any parts are swapped.' }
  };
  var panel = document.getElementById('show-panel');
  var hotspots = document.querySelectorAll('.hotspot');
  var tabs = document.querySelectorAll('.show-tab');
  function selectSystem(key) {
    var data = SHOWCASE[key];
    if (!panel || !data) return;
    panel.querySelector('h3').textContent = data.title;
    panel.querySelector('#sp-text').textContent = data.text;
    var use = panel.querySelector('.sp-ic use');
    if (use) use.setAttribute('href', data.icon);
    if (!reduced) { panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap'); }
    hotspots.forEach(function (h) { h.classList.toggle('active', h.getAttribute('data-key') === key); });
    tabs.forEach(function (t) { t.classList.toggle('active', t.getAttribute('data-key') === key); });
  }
  hotspots.forEach(function (h) {
    var key = h.getAttribute('data-key');
    h.addEventListener('mouseenter', function () { selectSystem(key); });
    h.addEventListener('click', function () { selectSystem(key); });
    h.addEventListener('focus', function () { selectSystem(key); });
  });
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { selectSystem(t.getAttribute('data-key')); });
  });

  /* ---------- Reviews carousel ---------- */
  var track = document.getElementById('rev-track');
  if (track) {
    var slides = track.children.length;
    var idx = 0;
    var dotsWrap = document.getElementById('rev-dots');
    var dots = [];
    for (var i = 0; i < slides; i++) {
      var d = document.createElement('button');
      d.className = 'rev-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to review ' + (i + 1));
      (function (n) { d.addEventListener('click', function () { go(n); }); })(i);
      dotsWrap.appendChild(d);
      dots.push(d);
    }
    function go(n) {
      idx = (n + slides) % slides;
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      dots.forEach(function (dt, j) { dt.classList.toggle('active', j === idx); });
    }
    var prev = document.getElementById('rev-prev');
    var next = document.getElementById('rev-next');
    if (prev) prev.addEventListener('click', function () { go(idx - 1); });
    if (next) next.addEventListener('click', function () { go(idx + 1); });

    var carousel = document.getElementById('rev-carousel');
    var timer = null;
    function startAuto() {
      if (reduced || timer) return;
      timer = setInterval(function () { go(idx + 1); }, 6000);
    }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAuto);
      carousel.addEventListener('mouseleave', startAuto);
      carousel.addEventListener('focusin', stopAuto);
    }
    startAuto();

    // touch swipe
    var startX = null;
    if (carousel) {
      carousel.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; stopAuto(); }, { passive: true });
      carousel.addEventListener('touchend', function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
        startX = null; startAuto();
      });
    }
  }

  /* ---------- Scrollspy for desktop nav ---------- */
  var navLinks = document.querySelectorAll('.nav a[href^="#"]');
  var sections = [];
  navLinks.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    var sec = document.getElementById(id);
    if (sec) sections.push({ link: a, sec: sec });
  });
  function onScrollSpy() {
    var pos = window.scrollY + 120;
    var current = null;
    sections.forEach(function (s) {
      if (s.sec.offsetTop <= pos) current = s;
    });
    navLinks.forEach(function (a) { a.classList.remove('active'); });
    if (current) current.link.classList.add('active');
  }

  /* ---------- Combined scroll handler (rAF) ---------- */
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onScrollHeader();
        onScrollParallax();
        onScrollSpy();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScrollHeader(); onScrollParallax(); onScrollSpy();

  /* ---------- Quote / contact form (validation only — no backend) ---------- */
  var form = document.getElementById('quote-form');
  if (form) {
    var status = document.getElementById('form-status');

    function wrapOf(field) { return field.closest('.form-field'); }
    function setError(field, msg) {
      var w = wrapOf(field);
      if (w) w.classList.add('error');
      var e = w && w.querySelector('.field-error');
      if (e && msg) e.textContent = msg;
    }
    function clearError(field) { var w = wrapOf(field); if (w) w.classList.remove('error'); }
    function showStatus(type, html) {
      if (!status) return;
      status.className = 'form-status show ' + type;
      status.innerHTML = html;
    }

    var validators = {
      name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your name.'; },
      phone: function (v) { return v.replace(/\D/g, '').length >= 10 ? '' : 'Please enter a valid phone number.'; },
      location: function (v) { return v.trim().length >= 2 ? '' : 'Please tell us where the vehicle is.'; }
    };

    Object.keys(validators).forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      field.addEventListener('blur', function () {
        var msg = validators[name](field.value);
        if (msg) setError(field, msg); else clearError(field);
      });
      field.addEventListener('input', function () { clearError(field); });
      field.addEventListener('change', function () { clearError(field); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(validators).forEach(function (name) {
        var field = form.elements[name];
        if (!field) return;
        var msg = validators[name](field.value);
        if (msg) { setError(field, msg); if (!firstBad) firstBad = field; }
        else clearError(field);
      });

      if (firstBad) {
        showStatus('error', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg><span>Please fix the highlighted fields and try again.</span>');
        firstBad.focus();
        return;
      }

      // No backend is connected yet — do NOT claim the message was sent.
      // Wire a real endpoint here, e.g.
      // fetch('/api/request', { method: 'POST', body: new FormData(form) })
      showStatus('success',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>' +
        '<span>Thanks, ' + form.elements['name'].value.trim().split(' ')[0] + '! This demo form is not connected to a backend yet, so nothing was submitted. To request service now, please <a href="' + PHONE_TEL + '" style="color:inherit;text-decoration:underline;font-weight:700">call (832) 202-4204</a>.</span>');
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Ensure call links wired ---------- */
  document.querySelectorAll('a[data-call]').forEach(function (a) {
    if (!a.getAttribute('href') || a.getAttribute('href') === '#') a.setAttribute('href', PHONE_TEL);
  });
})();
