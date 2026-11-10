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
// Quiz Functionality
// ========================================
const QuizState = {
  currentQuestion: 1,
  totalQuestions: 5,
  scores: {
    curie: 0,
    einstein: 0,
    franklin: 0,
    salam: 0,
    youyou: 0,
    chagas: 0,
    doudna: 0,
    johnson: 0,
    li: 0
  },
  answers: []
};

const SCIENTIST_DATA = {
  curie: {
    name: 'Marie Curie',
    image: 'assets/images/Cientistas/Marie_Curie.jpg',
    description: 'Pioneira da radioatividade, única pessoa com Nobel em duas ciências diferentes. Sua dedicação incansável à verdade científica mudou a física e a química para sempre.',
    traits: ['Rigor', 'Persistência', 'Verdade']
  },
  einstein: {
    name: 'Albert Einstein',
    image: 'assets/images/Cientistas/Albert_Einstein.jpg',
    description: 'Gênio da relatividade, voz pela paz mundial e direitos civis. Sua imaginação redefiniu o universo e sua consciência moral guiou a humanidade.',
    traits: ['Imaginação', 'Paz', 'Humanidade']
  },
  franklin: {
    name: 'Rosalind Franklin',
    image: 'assets/images/Cientistas/RosalingFranklin.jpeg',
    description: 'Co descobridora da estrutura do DNA, seu trabalho meticuloso em cristalografia de raios X foi fundamental para a biologia molecular moderna.',
    traits: ['Precisão', 'Integridade', 'Descoberta']
  },
  salam: {
    name: 'Abdus Salam',
    image: 'assets/images/Cientistas/Abdus Salam.jpeg',
    description: 'Unificador das forças fundamentais, Nobel de Física, fundador do ICTP. Dedicou sua vida a levar ciência de ponta ao mundo em desenvolvimento.',
    traits: ['Unificação', 'Equidade', 'Diplomacia']
  },
  youyou: {
    name: 'Tu Youyou',
    image: 'assets/images/Cientistas/TuYouyou.jpeg',
    description: 'Descobridora da artemisinina, salvou milhões de vidas da malária. Uniu medicina tradicional e ciência moderna com humildade e determinação.',
    traits: ['Cura', 'Humildade', 'Impacto']
  },
  chagas: {
    name: 'Carlos Chagas',
    image: 'assets/images/Cientistas/CarlosChagas.jpeg',
    description: 'Descobridor da doença de Chagas, descreveu todo o ciclo do parasita. Visionário da saúde pública tropical no Brasil e no mundo.',
    traits: ['Saúde Pública', 'Visão', 'Dedicação']
  },
  doudna: {
    name: 'Jennifer Doudna',
    image: 'assets/images/Cientistas/Jennifer_Doudna.jpg',
    description: 'Co inventora do CRISPR Cas9, revolucionou a edição genética. Defensora da ética na ciência e do uso responsável da tecnologia.',
    traits: ['Inovação', 'Ética', 'Responsabilidade']
  },
  johnson: {
    name: 'Katherine Johnson',
    image: 'assets/images/Cientistas/KatherineJohnson.jpeg',
    description: 'Matemática da NASA, cálculos orbitais precisos levaram astronautas à Lua. Quebrou barreiras raciais e de gênero com excelência silenciosa.',
    traits: ['Precisão', 'Coragem', 'Excelência']
  },
  li: {
    name: 'Fei-Fei Li',
    image: 'assets/images/Cientistas/Fei-Fei Lis.jpeg',
    description: 'Pioneira da visão computacional e ImageNet, democratiza a IA centrada no ser humano. Advoga por diversidade e ética na inteligência artificial.',
    traits: ['Visão', 'Inclusão', 'Humanidade']
  }
};

function initQuiz() {
  const quizForm = document.getElementById('quiz-form');
  const quizResult = document.getElementById('quiz-result');
  const quizRestart = document.getElementById('quiz-restart');
  const progressDots = document.querySelectorAll('.quiz-progress-dot');

  if (!quizForm) return;

  // Handle option selection
  quizForm.addEventListener('click', (e) => {
    const option = e.target.closest('.quiz-option');
    if (!option) return;

    const question = option.closest('.quiz-question');
    const questionNum = parseInt(question.dataset.question, 10);

    // Clear previous selection in this question
    question.querySelectorAll('.quiz-option').forEach(opt => {
      opt.classList.remove('selected');
      opt.setAttribute('aria-pressed', 'false');
    });

    // Select this option
    option.classList.add('selected');
    option.setAttribute('aria-pressed', 'true');

    // Store answer
    const value = option.dataset.value;
    const scientists = option.dataset.scientist.split(',');
    QuizState.answers[questionNum - 1] = { value, scientists };

    // Update scores
    scientists.forEach(sci => {
      if (QuizState.scores[sci] !== undefined) {
        QuizState.scores[sci]++;
      }
    });

    // Auto-advance after short delay
    setTimeout(() => {
      if (questionNum < QuizState.totalQuestions) {
        goToQuestion(questionNum + 1);
      } else {
        showResult();
      }
    }, 400);
  });

  // Keyboard support for quiz options
  quizForm.addEventListener('keydown', (e) => {
    const option = e.target.closest('.quiz-option');
    if (!option) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      option.click();
    }
  });

  // Restart quiz
  if (quizRestart) {
    quizRestart.addEventListener('click', resetQuiz);
  }

  function goToQuestion(num) {
    // Hide current question
    const currentQ = document.querySelector(`.quiz-question[data-question="${QuizState.currentQuestion}"]`);
    if (currentQ) {
      currentQ.classList.add('hidden');
      currentQ.setAttribute('aria-hidden', 'true');
    }

    // Show next question
    const nextQ = document.querySelector(`.quiz-question[data-question="${num}"]`);
    if (nextQ) {
      nextQ.classList.remove('hidden');
      nextQ.setAttribute('aria-hidden', 'false');
    }

    // Update progress dots
    progressDots.forEach((dot, index) => {
      dot.classList.toggle('active', index + 1 === num);
      dot.classList.toggle('completed', index + 1 < num);
    });

    // Update progress bar aria
    const progressBar = document.querySelector('.quiz-progress');
    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', num);
    }

    QuizState.currentQuestion = num;

    // Scroll to quiz header on mobile
    if (window.innerWidth < 768) {
      const quizHeader = document.querySelector('.quiz-header');
      if (quizHeader) {
        quizHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function showResult() {
    // Find top scientist
    let topScientist = 'curie';
    let maxScore = -1;
    for (const [key, score] of Object.entries(QuizState.scores)) {
      if (score > maxScore) {
        maxScore = score;
        topScientist = key;
      }
    }

    const scientist = SCIENTIST_DATA[topScientist];

    // Hide form, show result
    quizForm.classList.add('hidden');
    quizForm.setAttribute('aria-hidden', 'true');

    if (quizResult) {
      quizResult.classList.remove('hidden');
      quizResult.setAttribute('aria-hidden', 'false');

      // Populate result
      const resultImage = quizResult.querySelector('#result-avatar');
      const resultName = quizResult.querySelector('#result-name');
      const resultDescription = quizResult.querySelector('#result-desc');
      const resultTraits = quizResult.querySelector('#result-tags');

      if (resultImage) {
        resultImage.src = scientist.image;
        resultImage.alt = scientist.name;
      }
      if (resultName) resultName.textContent = scientist.name;
      if (resultDescription) resultDescription.textContent = scientist.description;
      if (resultTraits) {
        resultTraits.innerHTML = scientist.traits.map(trait =>
          `<span class="result-trait">${trait}</span>`
        ).join('');
      }
    }

    // Announce to screen readers
    announceResult(scientist.name);
  }

  function resetQuiz() {
    // Reset state
    QuizState.currentQuestion = 1;
    QuizState.scores = {
      curie: 0, einstein: 0, franklin: 0, salam: 0, youyou: 0,
      chagas: 0, doudna: 0, johnson: 0, li: 0
    };
    QuizState.answers = [];

    // Reset UI
    quizForm.classList.remove('hidden');
    quizForm.setAttribute('aria-hidden', 'false');
    if (quizResult) {
      quizResult.classList.add('hidden');
      quizResult.setAttribute('aria-hidden', 'true');
    }

    // Reset all questions
    document.querySelectorAll('.quiz-question').forEach((q, index) => {
      q.classList.toggle('hidden', index !== 0);
      q.setAttribute('aria-hidden', index !== 0);
      q.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
        opt.setAttribute('aria-pressed', 'false');
      });
    });

    // Reset progress
    progressDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === 0);
      dot.classList.remove('completed');
    });

    const progressBar = document.querySelector('.quiz-progress');
    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', 1);
    }

    // Scroll to quiz
    const quizSection = document.getElementById('quiz');
    if (quizSection) {
      quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function announceResult(name) {
    const liveRegion = document.getElementById('quiz-live-region');
    if (liveRegion) {
      liveRegion.textContent = `Resultado: você é ${name}`;
    }
  }
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
  initQuiz();

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