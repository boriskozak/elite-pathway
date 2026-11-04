/* ============================================
   ELITE PATHWAY — Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Particle Canvas Background ───
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let cssW = 0;
  let cssH = 0;

  function resizeCanvas() {
    // Render at devicePixelRatio (capped at 2x) so particles stay crisp on retina
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cssW = window.innerWidth;
    cssH = window.innerHeight;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * cssW;
      this.y = Math.random() * cssH;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = ['#00e5ff', '#76ff03', '#ffd600', '#b388ff'][Math.floor(Math.random() * 4)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > cssW || this.y < 0 || this.y > cssH) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor(cssW * cssH / 15000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = '#00e5ff';
          ctx.globalAlpha = 0.03 * (1 - dist / 150);
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  let particlesRunning = false;

  function animateParticles() {
    ctx.clearRect(0, 0, cssW, cssH);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
  }

  function startParticles() {
    if (particlesRunning) return;
    particlesRunning = true;
    animateParticles();
  }

  function stopParticles() {
    particlesRunning = false;
    if (animationId) cancelAnimationFrame(animationId);
    animationId = undefined;
  }

  // No point animating a background canvas nobody can see
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopParticles();
    } else {
      startParticles();
    }
  });

  resizeCanvas();
  initParticles();
  if (!document.hidden) startParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });


  // ─── Scroll Effects (navbar state + parallax glows, rAF-throttled) ───
  const nav = document.getElementById('navbar');
  const glows = document.querySelectorAll('.hero-glow');
  let scrollTicking = false;

  function updateScrollEffects() {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 50);
    glows.forEach((glow, i) => {
      const speed = 0.1 + i * 0.05;
      glow.style.transform = `translateY(${scrollY * speed}px)`;
    });
    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(updateScrollEffects);
    }
  }, { passive: true });


  // ─── Mobile Menu ───
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function setMenuOpen(open) {
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    setMenuOpen(!mobileMenu.classList.contains('open'));
  });

  mobileClose.addEventListener('click', () => {
    setMenuOpen(false);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });


  // ─── Scroll Reveal ───
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  // ─── Animated Counters ───
  const counters = document.querySelectorAll('[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const decimals = parseInt(el.dataset.decimals) || 0;
        const duration = 2000;
        const startTime = performance.now();

        function easeOutExpo(t) {
          return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeOutExpo(progress);
          const current = target * easedProgress;

          if (decimals > 0) {
            el.textContent = current.toFixed(decimals) + suffix;
          } else {
            el.textContent = Math.floor(current).toLocaleString() + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            if (decimals > 0) {
              el.textContent = target.toFixed(decimals) + suffix;
            } else {
              el.textContent = target.toLocaleString() + suffix;
            }
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(el => counterObserver.observe(el));


  // ─── Training Tabs ───
  const tabs = document.querySelectorAll('.training-tab');
  const contents = document.querySelectorAll('.training-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      contents.forEach(c => {
        c.classList.remove('active');
        if (c.id === targetId) {
          c.classList.add('active');
        }
      });
    });
  });


  // ─── Recruiting Checklist ───
  const checklistItems = document.querySelectorAll('.phase-checklist li');

  // Load saved state (guard against corrupt or inaccessible storage)
  function loadCheckedState() {
    try {
      return JSON.parse(localStorage.getItem('elitePathwayChecks') || '{}');
    } catch (err) {
      return {};
    }
  }

  function saveCheckedState(state) {
    try {
      localStorage.setItem('elitePathwayChecks', JSON.stringify(state));
    } catch (err) {
      // Private browsing or quota exceeded: checklist just won't persist
    }
  }

  const savedChecks = loadCheckedState();

  checklistItems.forEach((item, index) => {
    // Expose as a real checkbox to assistive tech and keyboard users
    item.setAttribute('role', 'checkbox');
    item.setAttribute('tabindex', '0');

    if (savedChecks[index]) {
      item.classList.add('checked');
    }
    item.setAttribute('aria-checked', item.classList.contains('checked') ? 'true' : 'false');

    item.addEventListener('click', () => toggleChecklistItem(item));

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleChecklistItem(item);
      }
    });
  });

  function toggleChecklistItem(item) {
    item.classList.toggle('checked');
    item.setAttribute('aria-checked', item.classList.contains('checked') ? 'true' : 'false');

    // Save state
    const state = {};
    checklistItems.forEach((el, i) => {
      if (el.classList.contains('checked')) {
        state[i] = true;
      }
    });
    saveCheckedState(state);

    // Confetti burst on check
    if (item.classList.contains('checked')) {
      createMiniConfetti(item);
    }
  }

  function createMiniConfetti(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#00e5ff', '#76ff03', '#ffd600', '#ff3d71', '#b388ff'];

    for (let i = 0; i < 12; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: ${Math.random() * 6 + 4}px;
        height: ${Math.random() * 6 + 4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        left: ${rect.left + 10}px;
        top: ${rect.top + rect.height / 2}px;
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      `;
      document.body.appendChild(confetti);

      requestAnimationFrame(() => {
        confetti.style.transform = `translate(${(Math.random() - 0.5) * 120}px, ${(Math.random() - 1) * 100}px) rotate(${Math.random() * 360}deg)`;
        confetti.style.opacity = '0';
      });

      setTimeout(() => confetti.remove(), 900);
    }
  }


  // ─── Quotes Carousel ───
  const slides = document.querySelectorAll('.quote-slide');
  const dotsContainer = document.getElementById('quoteDots');
  let currentSlide = 0;
  let quoteInterval;

  // Create dots (real buttons, so they are keyboard-operable and labeled)
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `quote-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Show quote ${i + 1} of ${slides.length}`);
    dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    const dots = document.querySelectorAll('.quote-dot');
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    dots[currentSlide].setAttribute('aria-current', 'false');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    dots[currentSlide].setAttribute('aria-current', 'true');

    resetQuoteTimer();
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function resetQuoteTimer() {
    clearInterval(quoteInterval);
    quoteInterval = setInterval(nextSlide, 5000);
  }

  resetQuoteTimer();


  // ─── Smooth Scroll for All Anchor Links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });


});
