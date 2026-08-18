import { initCustomCursor } from './cursor';
import { initScrollReveal } from './reveal';
import { initBackToTop } from './backToTop';
import { initHero3DLogo } from './hero3DLogo';
import { initNavPreview } from './navPreview';
import { initThemeToggle } from './themeToggle';
import { initPageTransitions } from './pageTransition';
import { initPortfolioParallax } from './portfolioMotion';
import { initWhyChooseMotion } from './whyChooseMotion';
import { initServicesSkeleton } from './servicesSkeleton';
import emailjs from 'emailjs-com';
import { showSuccessToast, showSuccessModal } from './notifications';
import { submitToGoogleSheets } from '../src/services/googleSheets';

document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initThemeToggle();
    initPortfolioParallax();
    initWhyChooseMotion();
    initServicesSkeleton();

    document.body.classList.add('splash-complete');

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

    // Initialize global Gmail / Mail icon click handler
    const initMailtoHandler = () => {
        const mailElements = document.querySelectorAll<HTMLElement>('a[href^="mailto:"], [aria-label="Email"]');
        mailElements.forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const email = 'support@arikacollabs.com';

                // 1. Copy to clipboard
                navigator.clipboard.writeText(email).catch(() => {});

                // 2. Show floating toast notification
                let toast = document.getElementById('global-mail-toast');
                if (!toast) {
                    toast = document.createElement('div');
                    toast.id = 'global-mail-toast';
                    toast.className = 'fixed bottom-8 right-8 z-[200] px-6 py-4 rounded-full bg-[#181615] border border-[#DDA291] text-[#DDA291] font-mono text-xs sm:text-sm shadow-[0_10px_35px_rgba(221,162,145,0.4)] flex items-center gap-3 backdrop-blur-xl transition-all duration-300 opacity-0 translate-y-4';
                    toast.innerHTML = `
                        <span class="material-symbols-outlined text-emerald-400 text-lg">mark_email_read</span>
                        <span class="text-white font-semibold">✓ Gmail copied: ${email}</span>
                    `;
                    document.body.appendChild(toast);
                }

                // Trigger animation
                setTimeout(() => {
                    if (toast) {
                        toast.classList.remove('opacity-0', 'translate-y-4');
                        toast.classList.add('opacity-100', 'translate-y-0');
                    }
                }, 10);

                // Hide after 4s
                setTimeout(() => {
                    if (toast) {
                        toast.classList.remove('opacity-100', 'translate-y-0');
                        toast.classList.add('opacity-0', 'translate-y-4');
                    }
                }, 4000);

                // 3. Smooth scroll to contact section if present
                const contactSection = document.getElementById('contact-section') || document.getElementById('inquiry-form');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }

                // 4. Open Gmail Web compose window directly in new browser tab
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent('ARIKA COLLABS - Campaign Inquiry')}`;
                try {
                    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
                } catch {
                    window.open(`mailto:${email}`, '_self');
                }
            });
        });
    };

    initMailtoHandler();

    // Homepage Quick Inquiry Form Handler
    const homeForm = document.querySelector<HTMLFormElement>('#home-inquiry-form') || document.querySelector<HTMLFormElement>('form');
    if (homeForm) {
        homeForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const existingBanner = homeForm.querySelector('.form-error-banner');
            if (existingBanner) existingBanner.remove();

            const nameInput = homeForm.querySelector<HTMLInputElement>('#home-inquiry-name') || 
                              homeForm.querySelector<HTMLInputElement>('input[name="name"]') ||
                              homeForm.querySelector<HTMLInputElement>('input[type="text"]');

            const emailInput = homeForm.querySelector<HTMLInputElement>('#home-inquiry-email') || 
                               homeForm.querySelector<HTMLInputElement>('input[name="email"]') ||
                               homeForm.querySelector<HTMLInputElement>('input[type="email"]');

            const messageInput = homeForm.querySelector<HTMLTextAreaElement>('#home-inquiry-message') || 
                                 homeForm.querySelector<HTMLTextAreaElement>('textarea[name="message"]') ||
                                 homeForm.querySelector<HTMLTextAreaElement>('textarea');

            const submitBtn = homeForm.querySelector<HTMLButtonElement>('#home-inquire-btn') || 
                              homeForm.querySelector<HTMLButtonElement>('button[type="submit"]');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const comment = messageInput ? messageInput.value.trim() : '';
            const messageContent = comment ? comment : `Quick campaign inquiry submitted from homepage by ${name} (${email}).`;

            if (!name) {
                if (nameInput) nameInput.focus();
                return;
            }

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                if (emailInput) emailInput.focus();
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
                submitBtn.innerHTML = `
                    <span class="inline-flex items-center justify-center gap-2.5 font-bold tracking-widest">
                        <svg class="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3.5"></circle>
                            <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>SENDING INQUIRY...</span>
                    </span>
                `;
            }

            try {
                // 1. Submit to Google Sheets (Google Apps Script Web App Integration)
                const googleSheetsPromise = submitToGoogleSheets({
                    fullName: name,
                    companyName: '',
                    company: '',
                    email: email,
                    phone: '',
                    phoneCoordinate: '',
                    inquiryType: 'Homepage Quick Inquiry',
                    campaignMessage: messageContent,
                });

                // 2. Email Transmission (EmailJS / Node server)
                const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
                const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
                const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

                let success = false;

                if (serviceId && templateId && publicKey) {
                    try {
                        const templateParams = {
                            to_email: 'alfaiz.pathan@arikacollabs.com',
                            to_name: 'Alfaiz Pathan',
                            from_name: name,
                            user_name: name,
                            name: name,
                            from_email: email,
                            user_email: email,
                            email: email,
                            reply_to: email,
                            service: 'Homepage Quick Inquiry',
                            inquiry_type: 'Homepage Quick Inquiry',
                            subject: `[ARIKA COLLABS Inquiry] Quick Inquiry from ${name}`,
                            message: messageContent,
                        };

                        await emailjs.send(
                            serviceId,
                            templateId,
                            templateParams,
                            publicKey
                        );
                        success = true;
                    } catch (emailJsErr: any) {
                        console.warn('[Home Page] EmailJS client dispatch failed, attempting backend endpoint...', emailJsErr);
                    }
                }

                if (!success) {
                    const response = await fetch('/api/send-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name,
                            email,
                            service: 'Homepage Quick Inquiry',
                            message: messageContent
                        })
                    });

                    const data = await response.json();

                    if (!response.ok || !data.success) {
                        const gsRes = await googleSheetsPromise;
                        if (!gsRes.success) {
                            throw new Error(data.error || 'Submission failed');
                        }
                    }
                }

                // Await google sheets submission
                await googleSheetsPromise;

                // Show small toast notification
                showSuccessToast({
                    title: 'Inquiry Submitted',
                    message: `Thank you! Your inquiry has been received. We'll be in touch shortly.`,
                    duration: 5000,
                });

                // Clear any error banner
                const existingBanner = homeForm.querySelector('.form-error-banner');
                if (existingBanner) existingBanner.remove();

                // Show small, clean inline success message
                let successBanner = homeForm.querySelector<HTMLDivElement>('.form-success-banner');
                if (!successBanner) {
                    successBanner = document.createElement('div');
                    successBanner.className = 'form-success-banner p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-4 flex items-center justify-between shadow-lg transition-all animate-fade-in';
                    homeForm.insertBefore(successBanner, homeForm.firstChild);
                }
                successBanner.innerHTML = `
                    <div class="flex items-center gap-2.5">
                        <span class="material-symbols-outlined text-emerald-400 text-base" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                        <span class="font-medium">Inquiry submitted & recorded successfully!</span>
                    </div>
                    <button type="button" class="dismiss-btn text-emerald-400/60 hover:text-emerald-300 transition-colors p-1" aria-label="Dismiss">
                        <span class="material-symbols-outlined text-sm">close</span>
                    </button>
                `;

                const dismissBtn = successBanner.querySelector('.dismiss-btn');
                if (dismissBtn) {
                    dismissBtn.addEventListener('click', () => successBanner?.remove());
                }

                // Explicitly clear all form fields
                homeForm.reset();
                if (nameInput) nameInput.value = '';
                if (emailInput) emailInput.value = '';
                if (messageInput) messageInput.value = '';

                // Restore button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    const originalText = submitBtn.getAttribute('data-original-text');
                    if (originalText) {
                        submitBtn.innerHTML = originalText;
                    } else {
                        submitBtn.innerHTML = '<span>INQUIRE NOW</span><span class="material-symbols-outlined text-base">send</span>';
                    }
                }
            } catch (err: any) {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    const originalText = submitBtn.getAttribute('data-original-text');
                    if (originalText) submitBtn.innerHTML = originalText;
                }

                const banner = document.createElement('div');
                banner.className = 'form-error-banner p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono my-3';
                banner.textContent = err.message || 'Failed to send inquiry. Please try again.';
                homeForm.insertBefore(banner, homeForm.firstChild);
            }
        });
    }
});
