/**
 * PORTFOLIO 3D - MAIN CONTROLLER
 * Typewriter, Custom Cursor, Stats Counter, 3D Lab Controls, Form Handling & Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Engines
  const audio = new SoundEngine();
  const scene3D = new Portfolio3D();
  const tilt = new Tilt3D();

  // 2. Custom Cursor Follower
  initCustomCursor();

  // 3. Dynamic Typewriter
  initTypewriter();

  // 4. Interactive 3D Lab Controls
  initLabControls(scene3D, audio);

  // 5. Stats Counter Animation on Scroll
  initStatsCounter();

  // 6. Project Filtering System
  initProjectFilters();

  // 7. Contact Form & Toast
  initContactForm(audio);

  // 8. Navigation & Smooth Scroll
  initNavigation();

  // 9. Back to Top Button
  initBackToTop();
});

/* ==========================================================================
   2. CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');

  if (!dot || !ring) return;

  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  const renderCursor = () => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Expand ring on interactive element hover
  const hoverTargets = document.querySelectorAll('a, button, input, textarea, .project-card, .lab-btn, .theme-dot');
  hoverTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      ring.style.width = '55px';
      ring.style.height = '55px';
      ring.style.borderColor = 'var(--primary-glow)';
      ring.style.backgroundColor = 'rgba(var(--accent-glow-rgb), 0.08)';
    });
    target.addEventListener('mouseleave', () => {
      ring.style.width = '38px';
      ring.style.height = '38px';
      ring.style.borderColor = 'rgba(var(--accent-glow-rgb), 0.5)';
      ring.style.backgroundColor = 'transparent';
    });
  });
}

/* ==========================================================================
   3. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const phrases = [
    'Creative Technologist',
    '3D WebGL & Three.js Architect',
    'Full Stack Engineer',
    'Interactive UI / UX Designer',
    'GLSL Shader Crafter'
  ];

  let phraseIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, letterIndex - 1);
      letterIndex--;
      typingSpeed = 50;
    } else {
      target.textContent = currentPhrase.substring(0, letterIndex + 1);
      letterIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && letterIndex === currentPhrase.length) {
      typingSpeed = 2000; // Pause at full phrase
      isDeleting = true;
    } else if (isDeleting && letterIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. 3D LAB CONTROLS
   ========================================================================== */
function initLabControls(scene3D, audio) {
  // Model Selector Buttons (Dev & Design Models)
  const modelBtns = document.querySelectorAll('.lab-btn[data-model], .lab-btn[data-shape]');
  modelBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const model = btn.dataset.model || btn.dataset.shape;
      scene3D.setModel(model);
    });
  });

  // Wireframe Mode Switch
  const wireframeBtn = document.getElementById('btn-toggle-wireframe');
  if (wireframeBtn) {
    let wireframeActive = false;
    wireframeBtn.addEventListener('click', () => {
      wireframeActive = !wireframeActive;
      wireframeBtn.classList.toggle('active', wireframeActive);
      wireframeBtn.textContent = wireframeActive ? 'Wireframe: ON' : 'Wireframe: OFF';
      scene3D.setWireframe(wireframeActive);
    });
  }

  // Theme Dots
  const themeDots = document.querySelectorAll('.theme-dot');
  themeDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      themeDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      const theme = dot.dataset.theme;

      // Apply to HTML document
      document.documentElement.setAttribute('data-theme', theme);
      
      // Update Three.js scene
      scene3D.setTheme(theme);

      // Play audio chime
      audio.playThemeChime();
    });
  });
}

/* ==========================================================================
   5. STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        stats.forEach((stat) => {
          const target = parseInt(stat.dataset.target, 10) || 0;
          const suffix = stat.dataset.suffix || '';
          let count = 0;
          const step = Math.ceil(target / 45);

          const interval = setInterval(() => {
            count += step;
            if (count >= target) {
              count = target;
              clearInterval(interval);
            }
            stat.innerHTML = `${count}<span>${suffix}</span>`;
          }, 30);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) observer.observe(statsGrid);
}

/* ==========================================================================
   6. PROJECT FILTERING
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          gsap.fromTo(card, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. CONTACT FORM & TOAST
   ========================================================================== */
function initContactForm(audio) {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast-notice');

  if (!form || !toast) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#form-name').value.trim();
    const email = form.querySelector('#form-email').value.trim();
    const message = form.querySelector('#form-message').value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Please complete all required fields.', '#ff5f56');
      return;
    }

    // Submit Simulation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Transmitting...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();

      showToast('🚀 Transmission received! I will get back to you shortly.', 'var(--primary-glow)');
      audio.playThemeChime();
    }, 1200);
  });

  function showToast(msg, color) {
    const toastText = document.getElementById('toast-message');
    if (toastText) toastText.textContent = msg;
    if (color) toast.style.borderColor = color;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}

/* ==========================================================================
   8. NAVIGATION & SMOOTH SCROLL
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinksContainer = document.querySelector('.nav-links');
  if (mobileBtn && navLinksContainer) {
    const setMenuState = (isOpen) => {
      navLinksContainer.classList.toggle('is-open', isOpen);
      mobileBtn.setAttribute('aria-expanded', String(isOpen));
    };

    mobileBtn.addEventListener('click', () => {
      setMenuState(!navLinksContainer.classList.contains('is-open'));
    });

    navLinksContainer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          setMenuState(false);
        }
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        setMenuState(false);
      }
    });
  }
}

/* ==========================================================================
   9. BACK TO TOP
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
