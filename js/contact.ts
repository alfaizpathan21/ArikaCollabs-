import { initCustomCursor } from './cursor';
import { initScrollReveal } from './reveal';
import { initBackToTop } from './backToTop';
import { initNavPreview } from './navPreview';
import { initThemeToggle } from './themeToggle';
import { initPageTransitions } from './pageTransition';
import { initSplashScreen } from './splashScreen';
import emailjs from 'emailjs-com';

document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initThemeToggle();
    initSplashScreen({ duration: 3000 });

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

                // 3. Smooth scroll to inquiry form if present
                const inquiryForm = document.getElementById('inquiry-form') || document.getElementById('contact-coordinates') || document.getElementById('contact-section');
                if (inquiryForm) {
                    inquiryForm.scrollIntoView({ behavior: 'smooth' });
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
    const form = document.querySelector<HTMLFormElement>('#inquiry-form form') || document.querySelector<HTMLFormElement>('form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear existing error banners if any
            const existingError = form.querySelector('.form-error-banner');
            if (existingError) {
                existingError.remove();
            }

            // Collect form fields
            const inputs = Array.from(form.querySelectorAll<HTMLInputElement>('input'));
            const nameInput = inputs.find(i => i.type === 'text' && i.placeholder.includes('McQueen')) || inputs[0];
            const companyInput = inputs.find(i => i.placeholder.includes('Arika')) || inputs[1];
            const emailInput = form.querySelector<HTMLInputElement>('input[type="email"]');
            const phoneInput = form.querySelector<HTMLInputElement>('input[type="tel"]');
            const selectDropdown = form.querySelector<HTMLSelectElement>('select');
            const messageInput = form.querySelector<HTMLTextAreaElement>('textarea');
            const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]') || form.querySelector<HTMLButtonElement>('button');

            const name = nameInput ? nameInput.value.trim() : '';
            const company = companyInput ? companyInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const inquiryType = selectDropdown ? selectDropdown.value : 'Brand Collaboration Campaign';
            const message = messageInput ? messageInput.value.trim() : '';

            // Client-side Validation
            if (!name) {
                showFormError(form, 'Please enter your Full Name.');
                if (nameInput) nameInput.focus();
                return;
            }

            if (!email) {
                showFormError(form, 'Please enter your Email Address.');
                if (emailInput) emailInput.focus();
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormError(form, 'Please enter a valid Email Address (e.g., alex@luxury.com).');
                if (emailInput) emailInput.focus();
                return;
            }

            if (!message) {
                showFormError(form, 'Please enter your Campaign Message / Project Brief.');
                if (messageInput) messageInput.focus();
                return;
            }

            // Set Loading & Duplicate Prevention state on submit button
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
                submitBtn.innerHTML = `
                    <span class="inline-flex items-center justify-center gap-2">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        SENDING INQUIRY...
                    </span>
                `;
            }

            try {
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
                            company: company || 'Not provided',
                            phone: phone || 'Not provided',
                            service: inquiryType,
                            inquiry_type: inquiryType,
                            subject: `[ARIKA COLLABS Inquiry] ${inquiryType} from ${name}`,
                            message: message,
                        };

                        await emailjs.send(
                            serviceId,
                            templateId,
                            templateParams,
                            publicKey
                        );
                        success = true;
                    } catch (emailJsErr: any) {
                        console.warn('[Contact Page] EmailJS client dispatch failed, attempting backend endpoint...', emailJsErr);
                    }
                }

                if (!success) {
                    const response = await fetch('/api/send-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name,
                            company,
                            email,
                            phone,
                            service: inquiryType,
                            message
                        })
                    });

                    const data = await response.json();

                    if (!response.ok || !data.success) {
                        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
                    }
                }

                // Create success message element
                const successMessage = document.createElement('div');
                successMessage.className = 'glass-panel p-10 rounded-xl border border-primary text-primary font-medium text-center mt-4 shadow-[0_10px_30px_rgba(221,162,145,0.2)] animate-fade-in';
                successMessage.innerHTML = `
                    <span class="material-symbols-outlined text-5xl text-primary mb-4 block" style="font-variation-settings: 'FILL' 1;">verified_user</span>
                    <p class="text-xl font-bold mb-2 text-white">Thank you, ${name}!</p>
                    <p class="text-sm text-on-surface-variant leading-relaxed mb-4">Your campaign inquiry has been transmitted directly to our executive team (<strong>alfaiz.pathan@arikacollabs.com</strong>). We will contact you at <strong>${email}</strong> shortly.</p>
                    <div class="p-4 rounded-lg bg-black/40 border border-white/10 text-xs text-gray-300 text-left font-mono space-y-1 mt-4">
                        <div><strong class="text-primary">Service:</strong> ${inquiryType}</div>
                        ${company ? `<div><strong class="text-primary">Company:</strong> ${company}</div>` : ''}
                        ${phone ? `<div><strong class="text-primary">Phone:</strong> ${phone}</div>` : ''}
                    </div>
                `;

                form.innerHTML = '';
                form.appendChild(successMessage);
            } catch (err: any) {
                // Restore button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    const originalText = submitBtn.getAttribute('data-original-text');
                    if (originalText) {
                        submitBtn.innerHTML = originalText;
                    } else {
                        submitBtn.innerHTML = 'SUBMIT INQUIRY';
                    }
                }

                // Show error message and preserve user-entered form data
                showFormError(form, err.message || 'An error occurred while sending your email. Please try again.');
            }
        });
    }

    function showFormError(formElement: HTMLFormElement, errorMessage: string) {
        let errorBanner = formElement.querySelector<HTMLDivElement>('.form-error-banner');
        if (!errorBanner) {
            errorBanner = document.createElement('div');
            errorBanner.className = 'form-error-banner p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-xs font-mono my-4 flex items-center gap-3 shadow-lg';
            formElement.insertBefore(errorBanner, formElement.firstChild);
        }
        errorBanner.innerHTML = `
            <span class="material-symbols-outlined text-red-400 text-lg flex-shrink-0">error</span>
            <span>${errorMessage}</span>
        `;
    }
});
