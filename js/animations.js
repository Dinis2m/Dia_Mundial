/**
 * animations.js - Scroll Animations & Interactive Effects
 * World Science Day for Peace and Development
 */

// ========================================
// AOS (Animate On Scroll) Configuration
// ========================================
const AOS_CONFIG = {
  duration: 1000,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  once: true,
  mirror: false,
  anchorPlacement: 'top-bottom',
  offset: 80,
  delay: 0,
  startEvent: 'DOMContentLoaded',
  disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? true : false,
};

// Initialize AOS
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init(AOS_CONFIG);
    // Refresh on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => AOS.refresh(), 100);
    });
  }
}

// ========================================
// Particle Field Generator
// ========================================
function createParticleField() {
  const field = document.querySelector('.particle-field');
  if (!field) return;

  const particleCount = window.innerWidth < 768 ? 15 : 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 20;
    const duration = 15 + Math.random() * 15;

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      opacity: ${0.2 + Math.random() * 0.4};
    `;

    field.appendChild(particle);
  }
}

// ========================================
// 3D Card Hover Effects
// ========================================
function init3DCardEffects() {
  const cards = document.querySelectorAll('.element-card');

  cards.forEach(card => {
    let rafId = null;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      targetX = (e.clientX - centerX) / (rect.width / 2) * 8; // max 8deg
      targetY = (e.clientY - centerY) / (rect.height / 2) * 8;

      if (!rafId) animate();
    });

    card.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      if (!rafId) animate();
    });

    function animate() {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      const rotateY = currentX.toFixed(2);
      const rotateX = (-currentY).toFixed(2);

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateZ(20px)
      `;

      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        rafId = requestAnimationFrame(animate);
      } else {
        card.style.transform = '';
        rafId = null;
      }
    }
  });
}

// ========================================
// Hero Accelerator Ring Animation
// ========================================
function initAcceleratorRing() {
  const ringContainer = document.querySelector('.accelerator-ring');
  if (!ringContainer) return;

  // Create SVG dynamically for the accelerator ring
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 200 200');
  svg.style.width = '100%';
  svg.style.height = '100%';

  // Definitions
  const defs = document.createElementNS(svgNS, 'defs');
  const grad = document.createElementNS(svgNS, 'linearGradient');
  grad.setAttribute('id', 'accelGrad');
  grad.setAttribute('x1', '0%');
  grad.setAttribute('y1', '0%');
  grad.setAttribute('x2', '100%');
  grad.setAttribute('y2', '100%');

  const stops = [
    { offset: '0%', color: '#00f3ff' },
    { offset: '50%', color: '#bc71ff' },
    { offset: '100%', color: '#39ff14' }
  ];

  stops.forEach(stop => {
    const stopEl = document.createElementNS(svgNS, 'stop');
    stopEl.setAttribute('offset', stop.offset);
    stopEl.setAttribute('stop-color', stop.color);
    grad.appendChild(stopEl);
  });

  defs.appendChild(grad);
  svg.appendChild(defs);

  // Rings
  const radii = [90, 70, 50];
  const durations = [8, 6, 4];
  const directions = [1, -1, 1];

  radii.forEach((r, i) => {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('class', 'ring');
    circle.setAttribute('cx', '100');
    circle.setAttribute('cy', '100');
    circle.setAttribute('r', r);
    circle.style.strokeDasharray = (r * 2 * Math.PI).toFixed(2);
    circle.style.animation = `ring-rotate ${durations[i]}s linear infinite`;
    if (directions[i] === -1) circle.style.animationDirection = 'reverse';
    svg.appendChild(circle);
  });

  // Particles
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const r = 70;
    const x = 100 + r * Math.cos(angle);
    const y = 100 + r * Math.sin(angle);

    const particle = document.createElementNS(svgNS, 'circle');
    particle.setAttribute('class', `particle particle-${i + 1}`);
    particle.setAttribute('cx', x);
    particle.setAttribute('cy', y);
    particle.setAttribute('r', '4');
    particle.style.animationDelay = `${i * 0.5}s`;
    svg.appendChild(particle);
  }

  ringContainer.appendChild(svg);
}

// ========================================
// Scroll Progress Indicator
// ========================================
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / docHeight;
    progressBar.style.transform = `scaleX(${progress})`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// ========================================
// Back to Top Button
// ========================================
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========================================
// Magnetic Button Effect
// ========================================
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ========================================
// Parallax Scroll Elements
// ========================================
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const yPos = scrollY * speed;
      el.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
}

// ========================================
// Text Reveal Animation (Split Text)
// ========================================
function initTextReveal() {
  const elements = document.querySelectorAll('[data-text-reveal]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const delay = parseFloat(el.dataset.textRevealDelay) || 0;
        const stagger = parseFloat(el.dataset.textRevealStagger) || 0.03;

        el.innerHTML = '';
        [...text].forEach((char, i) => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? ' ' : char;
          span.style.cssText = `
            display: inline-block;
            opacity: 0;
            transform: translateY(100%);
            animation: char-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            animation-delay: ${delay + i * stagger}s;
          `;
          el.appendChild(span);
        });

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  elements.forEach(el => observer.observe(el));
}

// ========================================
// Counter Animation
// ========================================
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = Math.floor(start + (target - start) * eased);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}

// ========================================
// Intersection Observer for Counters
// ========================================
function initCounterObserver() {
  const counters = document.querySelectorAll('[data-counter]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counter, 10);
        const duration = parseInt(el.dataset.counterDuration, 10) || 2000;

        animateCounter(el, target, duration);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5, rootMargin: '0px 0px -50px 0px' });

  counters.forEach(counter => observer.observe(counter));
}

// ========================================
// Glow Follow Mouse (for cards)
// ========================================
function initGlowFollow() {
  const cards = document.querySelectorAll('.glass-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// ========================================
// Reduced Motion Check
// ========================================
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ========================================
// Main Initialization
// ========================================
function initAnimations() {
  // Core animations
  initAOS();
  createParticleField();
  init3DCardEffects();
  initAcceleratorRing();
  initScrollProgress();
  initBackToTop();
  initMagneticButtons();
  initParallax();
  initTextReveal();
  initCounterObserver();
  initGlowFollow();

  // Add char-reveal keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes char-reveal {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

// Export for manual initialization if needed
window.ScienceDayAnimations = {
  init: initAnimations,
  animateCounter,
  AOS_CONFIG
};