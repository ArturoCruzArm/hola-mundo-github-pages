/**
 * Hola Mundo - GitHub Pages Demo
 * JavaScript ES6+ con funcionalidad moderna
 */

// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Obtener tema guardado o usar preferencia del sistema
function getTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return prefersDark.matches ? 'dark' : 'light';
}

// Aplicar tema
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Inicializar tema
setTheme(getTheme());

// Toggle tema al hacer clic
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Escuchar cambios en preferencia del sistema
prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// ===== Animated Counter =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

// ===== Intersection Observer para animaciones =====
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Activar contador cuando la sección de stats sea visible
            if (entry.target.classList.contains('stats')) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

// Observar secciones
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ===== Smooth Scroll para navegación =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Header scroll effect =====
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = 'var(--shadow-md)';
    } else {
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ===== Console Easter Egg =====
console.log(`
%c🚀 ¡Hola Mundo!

%c¿Te gusta este proyecto?
Échale un vistazo al código fuente.

Tech Stack:
• HTML5 Semántico
• CSS3 con Variables
• JavaScript ES6+
• GitHub Pages
• Service Workers (PWA)

`,
'font-size: 24px; font-weight: bold;',
'font-size: 14px; color: #6366f1;'
);

// ===== Performance Mark =====
if (window.performance) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`⚡ Página cargada en ${loadTime.toFixed(2)}ms`);
    });
}
