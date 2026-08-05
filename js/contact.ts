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
    initSplashScreen({ duration: 2500 });

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

    // Smooth scroll for internal anchor links (e.g. #inquiry-form, #contact-coordinates)
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

    // Inquiry Topic Pill click handler
    const topicPills = document.querySelectorAll<HTMLButtonElement>('.inquiry-topic-pill');
    const selectDropdown = document.querySelector<HTMLSelectElement>('#inquiry-form select');

    topicPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const topic = pill.getAttribute('data-topic');
            if (topic && selectDropdown) {
                // Find matching option or set value
                for (let i = 0; i < selectDropdown.options.length; i++) {
                    if (selectDropdown.options[i].text.includes(topic) || selectDropdown.options[i].value.includes(topic)) {
                        selectDropdown.selectedIndex = i;
                        break;
                    }
                }
            }

            // Scroll down to form smoothly
            const formContainer = document.getElementById('inquiry-form');
            if (formContainer) {
                const headerOffset = 90;
                const elementPosition = formContainer.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Inquiry Form submission handling
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form fields
            const nameInput = form.querySelector<HTMLInputElement>('input[placeholder="Alexander McQueen"]');
            const emailInput = form.querySelector<HTMLInputElement>('input[placeholder="alex@luxury.com"]');
            
            if (nameInput && emailInput) {
                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                
                if (name && email) {
                    // Create beautiful success message element
                    const successMessage = document.createElement('div');
                    successMessage.className = 'glass-panel p-10 rounded-xl border border-primary text-primary font-medium text-center mt-4';
                    successMessage.innerHTML = `
                        <span class="material-symbols-outlined text-5xl text-primary mb-4 block" style="font-variation-settings: 'FILL' 1;">verified_user</span>
                        <p class="text-xl font-bold mb-2 text-white">Thank you, ${name}!</p>
                        <p class="text-sm text-on-surface-variant leading-relaxed">Your inquiry has been sent successfully. Our elite talent coordinator will contact you at <strong>${email}</strong> shortly.</p>
                    `;
                    
                    // Replace form contents with success message
                    form.innerHTML = '';
                    form.appendChild(successMessage);
                }
            }
        });
    }
});
