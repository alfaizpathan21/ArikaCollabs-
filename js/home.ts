import { initCustomCursor } from './cursor';
import { initScrollReveal } from './reveal';
import { initBackToTop } from './backToTop';
import { initHero3DLogo } from './hero3DLogo';
import { initNavPreview } from './navPreview';
import { initSplashScreen, bindReplaySplashButtons } from './splashScreen';
import { initThemeToggle } from './themeToggle';
import { initPageTransitions } from './pageTransition';
import { initPortfolioParallax } from './portfolioMotion';

document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initThemeToggle();
    initPortfolioParallax();

    // Initialize Opening Luxury Splash Screen
    initSplashScreen({
        duration: 2500,
        onComplete: () => {
            // Trigger smooth reveal of home page elements
            document.body.classList.add('splash-complete');
        }
    });

    // Replay Splash Screen button handlers (Desktop & Mobile)
    bindReplaySplashButtons();

    initCustomCursor();
    initScrollReveal();
    initBackToTop();
    initNavPreview();
    initHero3DLogo('hero-3d-logo-container');

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

    // Horizontal Campaign Timeline Scroll Controls & Drag-to-Scroll Flow
    const timelineContainer = document.getElementById('timeline-scroll-container');
    const timelinePrevBtn = document.getElementById('timeline-prev-btn') as HTMLButtonElement | null;
    const timelineNextBtn = document.getElementById('timeline-next-btn') as HTMLButtonElement | null;
    const timelineStageIndicator = document.getElementById('timeline-stage-indicator');
    const timelineProgressBar = document.getElementById('timeline-progress-bar');

    const stageTitles = [
        "Stage 01 of 08 Active — Initiation (Brand Enquiry)",
        "Stage 02 of 08 Active — Discovery (Strategy Meeting)",
        "Stage 03 of 08 Active — Curation (Creator Shortlisting)",
        "Stage 04 of 08 Active — Blueprint (Campaign Planning)",
        "Stage 05 of 08 Active — Creation (Content Production)",
        "Stage 06 of 08 Active — Launch (Publishing)",
        "Stage 07 of 08 Active — Analytics (Performance Tracking)",
        "Stage 08 of 08 Active — Synthesis (ROI Report)"
    ];

    if (timelineContainer) {
        const stageCards = Array.from(timelineContainer.children) as HTMLElement[];

        const updateTimelineFlow = () => {
            const maxScrollLeft = timelineContainer.scrollWidth - timelineContainer.clientWidth;
            const scrollLeft = timelineContainer.scrollLeft;

            // Prev/Next buttons
            if (timelinePrevBtn) timelinePrevBtn.disabled = scrollLeft <= 10;
            if (timelineNextBtn) timelineNextBtn.disabled = scrollLeft >= maxScrollLeft - 10;

            // Scroll progress percentage (min 12.5% for stage 1, max 100%)
            const percent = maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) : 0;
            const barWidth = 12.5 + (percent * 87.5);
            if (timelineProgressBar) {
                timelineProgressBar.style.width = `${Math.min(100, Math.max(12.5, barWidth))}%`;
            }

            // Determine active stage index
            const stageIndex = Math.min(
                7,
                Math.max(0, Math.floor((scrollLeft + 160) / 320))
            );

            if (timelineStageIndicator && stageTitles[stageIndex]) {
                timelineStageIndicator.textContent = stageTitles[stageIndex];
            }

            // Highlight active stage card & node
            stageCards.forEach((card, idx) => {
                const nodeCircle = card.querySelector('.rounded-full') as HTMLElement | null;
                const cardBox = card.querySelector('.timeline-card') as HTMLElement | null;

                if (idx === stageIndex) {
                    if (nodeCircle) {
                        nodeCircle.classList.add('scale-110', 'border-[#DDA291]', 'bg-[#2A2320]', 'shadow-[0_0_25px_rgba(221,162,145,0.5)]');
                    }
                    if (cardBox) {
                        cardBox.classList.add('border-[#DDA291]/60', 'bg-[#181615]');
                        cardBox.classList.remove('border-white/10');
                    }
                } else {
                    if (nodeCircle) {
                        nodeCircle.classList.remove('scale-110', 'bg-[#2A2320]', 'shadow-[0_0_25px_rgba(221,162,145,0.5)]');
                    }
                    if (cardBox) {
                        cardBox.classList.remove('border-[#DDA291]/60', 'bg-[#181615]');
                        cardBox.classList.add('border-white/10');
                    }
                }
            });
        };

        if (timelinePrevBtn) {
            timelinePrevBtn.addEventListener('click', () => {
                timelineContainer.scrollBy({ left: -340, behavior: 'smooth' });
            });
        }

        if (timelineNextBtn) {
            timelineNextBtn.addEventListener('click', () => {
                timelineContainer.scrollBy({ left: 340, behavior: 'smooth' });
            });
        }

        timelineContainer.addEventListener('scroll', updateTimelineFlow, { passive: true });
        updateTimelineFlow();

        // Mouse Drag-to-Scroll support
        let isDown = false;
        let startX = 0;
        let scrollLeftPos = 0;

        // Mouse Wheel Vertical-to-Horizontal Scroll Mapping
        timelineContainer.addEventListener('wheel', (e: WheelEvent) => {
            // If deltaX is active (trackpad horizontal swipe), let standard scroll handle it
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

            const maxScrollLeft = timelineContainer.scrollWidth - timelineContainer.clientWidth;
            const currentScroll = timelineContainer.scrollLeft;

            // Smoothly translate vertical wheel scroll into horizontal timeline flow
            if ((e.deltaY > 0 && currentScroll < maxScrollLeft - 2) || (e.deltaY < 0 && currentScroll > 2)) {
                e.preventDefault();
                timelineContainer.scrollLeft += e.deltaY * 1.25;
            }
        }, { passive: false });

        timelineContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            timelineContainer.classList.add('cursor-grabbing');
            startX = e.pageX - timelineContainer.offsetLeft;
            scrollLeftPos = timelineContainer.scrollLeft;
        });

        timelineContainer.addEventListener('mouseleave', () => {
            isDown = false;
            timelineContainer.classList.remove('cursor-grabbing');
        });

        timelineContainer.addEventListener('mouseup', () => {
            isDown = false;
            timelineContainer.classList.remove('cursor-grabbing');
        });

        timelineContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - timelineContainer.offsetLeft;
            const walk = (x - startX) * 1.8;
            timelineContainer.scrollLeft = scrollLeftPos - walk;
        });
    }

    // Scroll progress bar and scroll effects
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
