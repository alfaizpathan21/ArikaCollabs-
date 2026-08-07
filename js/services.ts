import { initCustomCursor } from './cursor';
import { initScrollReveal } from './reveal';
import { initBackToTop } from './backToTop';
import { initNavPreview } from './navPreview';
import { initThemeToggle } from './themeToggle';
import { initPageTransitions } from './pageTransition';
import { initSplashScreen, bindReplaySplashButtons } from './splashScreen';

document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initThemeToggle();
    initSplashScreen({ duration: 3000 });

    // Replay Splash Screen button handlers (Desktop & Mobile)
    bindReplaySplashButtons();

    initCustomCursor();
    initScrollReveal();
    initBackToTop();
    initNavPreview();

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

    // Light tracking for glow effect on cards
    document.addEventListener('mousemove', (e) => {
        const glows = document.querySelectorAll<HTMLElement>('.luminous-glow');
        const x = e.clientX;
        const y = e.clientY;
        
        glows.forEach((glow, index) => {
            const speed = 0.05 + (index * 0.02);
            
            const targetX = (x - window.innerWidth / 2) * speed;
            const targetY = (y - window.innerHeight / 2) * speed;
            
            glow.style.transform = `translate(${targetX}px, ${targetY}px)`;
            glow.dataset.x = targetX.toString();
            glow.dataset.y = targetY.toString();
        });
    });

    // Smooth scroll for internal anchor links (e.g. #services-grid)
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href && href !== '#' && href.startsWith('#')) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 90;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Scroll progress bar
    const updateScrollEffects = () => {
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
