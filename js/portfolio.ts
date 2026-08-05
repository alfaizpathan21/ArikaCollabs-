import { initCustomCursor } from './cursor';
import { initScrollReveal } from './reveal';
import { initBackToTop } from './backToTop';
import { initNavPreview } from './navPreview';
import { initThemeToggle } from './themeToggle';
import { initPageTransitions } from './pageTransition';
import { initPortfolioParallax } from './portfolioMotion';
import { initSplashScreen, bindReplaySplashButtons } from './splashScreen';

document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initThemeToggle();
    initSplashScreen({ duration: 2500 });

    // Replay Splash Screen button handlers (Desktop & Mobile)
    bindReplaySplashButtons();

    initCustomCursor();
    initScrollReveal();
    initBackToTop();
    initNavPreview();
    initPortfolioParallax();

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu && mobileMenuCloseBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
        });
        mobileMenuCloseBtn.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
        });
    }

    // Subtle mouse movement glow effect
    document.addEventListener('mousemove', (e) => {
        const glow = document.querySelector<HTMLElement>('.luminous-glow');
        if (glow) {
            const x = e.clientX / 20;
            const y = e.clientY / 20;
            glow.style.transform = `translate(${x}px, ${y}px)`;
        }
    });

    // Parallax scrolling & scroll progress bar
    const updateScrollEffects = () => {
        const scrolled = window.pageYOffset;
        const heroText = document.querySelector<HTMLElement>('h1');
        if (heroText) {
            heroText.style.transform = `translateY(${scrolled * 0.1}px)`;
        }

        // Scroll Progress Bar
        const scrollProgress = document.getElementById('scroll-progress');
        if (scrollProgress) {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = `${scrollPercent}%`;
        }
    };

    window.addEventListener('scroll', updateScrollEffects);
    updateScrollEffects(); // Initial call
});
