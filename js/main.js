/**
 * main.js - Core Application Logic
 * World Science Day for Peace and Development
 */

// ========================================
// Application State
// ========================================
const AppState = {
  stats: [
    { id: 'stat-countries', target: 193, label: 'Países Membros', suffix: '' },
    { id: 'stat-years', target: 23, label: 'Anos de Celebração', suffix: '' },
    { id: 'stat-projects', target: 847, label: 'Projetos Globais', suffix: '+' },
    { id: 'stat-scientists', target: 12000, label: 'Cientistas Envolvidos', suffix: '+' }
  ],
  isInitialized: false
};

// ========================================
// Counter Animation Logic
// ========================================
function initCounters() {
  AppState.stats.forEach(stat => {
    const element = document.getElementById(stat.id);
    if (!element) return;

    // Set data attributes for the counter observer in animations.js
    element.dataset.counter = stat.target;
    element.dataset.counterDuration = '2500';

    // Add suffix if present
    if (stat.suffix) {
      element.dataset.counterSuffix = stat.suffix;
    }
  });
}

// Enhanced counter animation with suffix support
function animateCounterWithSuffix(element, target, duration = 2000) {
  const suffix = element.dataset.counterSuffix || '';
  const start = 0;
  const startTime = performance.now();
  const isLargeNumber = target >= 1000;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * eased);

    if (isLargeNumber) {
      element.textContent = current.toLocaleString() + suffix;
    } else {
      element.textContent = current + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}

// ========================================
// Navigation / Smooth Scroll
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL without scroll
        history.pushState(null, null, targetId);
      }
    });
  });
}

// ========================================
// Active Section Highlighting
// ========================================
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navLinks.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0.1
  });

  sections.forEach(section => observer.observe(section));
}

// ========================================
// Theme Toggle (if needed for future)
// ========================================
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// ========================================
// Loading Screen
// ========================================
function initLoadingScreen() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    loader.classList.add('loaded');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  });
}

// ========================================
// Performance Optimization: Lazy Load Images
// ========================================
function initLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.src = img.dataset.src || img.src;
    });
    return;
  }

  // Fallback IntersectionObserver
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '50px' });

  lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// Console Easter Egg
// ========================================
function initConsoleEasterEgg() {
  console.log('%c🌌 Dia Mundial da Ciência para a Paz e o Desenvolvimento', 'font-size: 20px; font-weight: bold; color: #00f3ff; text-shadow: 0 0 20px #00f3ff;');
  console.log('%c"A ciência é a lanterna que ilumina o caminho da paz."', 'font-size: 14px; color: #bc71ff; font-style: italic;');
  console.log('%cDesenvolvido com ❤️ para a humanidade', 'font-size: 12px; color: #39ff14;');
  console.log('%c🔬 Partículas detectadas no console...', 'font-size: 12px; color: #94a3b8;');
}

// ========================================
// Resize Handler
// ========================================
let resizeTimeout;
function initResizeHandler() {
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Trigger AOS refresh if available
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }

      // Recalculate particle field if needed
      const field = document.querySelector('.particle-field');
      if (field && field.children.length === 0) {
        // Particles will be recreated by animations.js
      }
    }, 150);
  }, { passive: true });
}

// ========================================
// Keyboard Navigation Support
// ========================================
function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    // Escape to top
    if (e.key === 'Escape') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Home key to top
    if (e.key === 'Home' && e.ctrlKey) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // End key to bottom
    if (e.key === 'End' && e.ctrlKey) {
      e.preventDefault();
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  });
}

// ========================================
// Intersection Observer for Section Transitions
// ========================================
function initSectionTransitions() {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
  });

  sections.forEach(section => {
    section.classList.add('section-hidden');
    observer.observe(section);
  });
}

// ========================================
// Main Initialization
// ========================================
function initApp() {
  if (AppState.isInitialized) return;

  // Core features
  initCounters();
  initSmoothScroll();
  initScrollSpy();
  initThemeToggle();
  initLoadingScreen();
  initLazyLoading();
  initConsoleEasterEgg();
  initResizeHandler();
  initKeyboardNav();
  initSectionTransitions();

  AppState.isInitialized = true;

  // Dispatch custom event for other modules
  window.dispatchEvent(new CustomEvent('app:initialized', { detail: AppState }));
}

// ========================================
// Utility Functions
// ========================================
const Utils = {
  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Format number with locale
  formatNumber(num, locale = 'pt-PT') {
    return new Intl.NumberFormat(locale).format(num);
  },

  // Check if element is in viewport
  isInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * (1 - threshold) &&
      rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) * threshold
    );
  },

  // Generate random ID
  generateId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

// ========================================
// Auto-Initialize
// ========================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for external use
window.ScienceDayApp = {
  init: initApp,
  state: AppState,
  utils: Utils,
  animateCounter: animateCounterWithSuffix
};