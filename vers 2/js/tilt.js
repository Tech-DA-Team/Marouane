/**
 * PORTFOLIO 3D - TILT & MAGNETIC PHYSICS
 * Real-time 3D Card Tilts, Glare Highlights & Magnetic Buttons
 */

class Tilt3D {
  constructor() {
    this.initCardTilt();
    this.initMagneticButtons();
  }

  initCardTilt() {
    const cards = document.querySelectorAll('.project-card, .holo-profile-card, .terminal-window, .skill-category-card, .stat-card, .timeline-card');

    cards.forEach((card) => {
      // Ensure glare element exists
      if (!card.querySelector('.card-glare') && card.classList.contains('project-card')) {
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);
      }

      let bounds;

      const onMouseEnter = () => {
        bounds = card.getBoundingClientRect();
      };

      const onMouseMove = (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();

        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const xPct = mouseX / bounds.width;
        const yPct = mouseY / bounds.height;

        const xOffset = (xPct - 0.5) * 2; // -1 to 1
        const yOffset = (yPct - 0.5) * 2; // -1 to 1

        const maxTilt = card.classList.contains('project-card') ? 14 : 8;
        const rotateX = -yOffset * maxTilt;
        const rotateY = xOffset * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        // Update CSS glare variables
        card.style.setProperty('--mouse-x', `${xPct * 100}%`);
        card.style.setProperty('--mouse-y', `${yPct * 100}%`);

        // Parallax inner elements
        const popElements = card.querySelectorAll('.project-details, .category-header, .stat-number');
        popElements.forEach(el => {
          el.style.transform = `translateZ(25px)`;
        });
      };

      const onMouseLeave = () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        
        setTimeout(() => {
          card.style.transition = '';
        }, 500);

        const popElements = card.querySelectorAll('.project-details, .category-header, .stat-number');
        popElements.forEach(el => {
          el.style.transform = 'translateZ(0px)';
        });
      };

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
    });
  }

  initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-hire, .social-btn, .nav-icon-btn, .back-to-top-btn');

    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const bounds = btn.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left - bounds.width / 2;
        const mouseY = e.clientY - bounds.top - bounds.height / 2;

        btn.style.transform = `translate(${mouseX * 0.3}px, ${mouseY * 0.3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
        btn.style.transition = 'transform 0.4s ease';
        setTimeout(() => {
          btn.style.transition = '';
        }, 400);
      });
    });
  }
}

window.Tilt3D = Tilt3D;
