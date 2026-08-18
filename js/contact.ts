import { initCustomCursor } from './cursor';
import { initScrollReveal } from './reveal';
import { initBackToTop } from './backToTop';
import { initNavPreview } from './navPreview';
import { initThemeToggle } from './themeToggle';
import { initPageTransitions } from './pageTransition';

import emailjs from 'emailjs-com';

import {
    showSuccessToast
} from './notifications';

import {
    submitToGoogleSheets
} from '../src/services/googleSheets';


document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // INITIALIZE WEBSITE
    // =========================================================

    initPageTransitions();
    initThemeToggle();
    document.body.classList.add('splash-complete');

    initCustomCursor();
    initScrollReveal();
    initBackToTop();
    initNavPreview();


    // =========================================================
    // MOBILE MENU
    // =========================================================

    const mobileMenuBtn =
        document.getElementById('mobile-menu-btn');

    const mobileMenuCloseBtn =
        document.getElementById('mobile-menu-close-btn');

    const mobileMenu =
        document.getElementById('mobile-menu');

    if (
        mobileMenuBtn &&
        mobileMenu &&
        mobileMenuCloseBtn
    ) {

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
        });

        mobileMenuCloseBtn.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
        });

    }


    // =========================================================
    // SCROLL PROGRESS BAR
    // =========================================================

    const updateScrollEffects = () => {

        const scrollProgress =
            document.getElementById('scroll-progress');

        if (!scrollProgress) {
            return;
        }

        const scrollTop =
            window.scrollY ||
            document.documentElement.scrollTop;

        const docHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        const scrollPercent =
            docHeight > 0
                ? (scrollTop / docHeight) * 100
                : 0;

        scrollProgress.style.width =
            `${scrollPercent}%`;
    };


    window.addEventListener(
        'scroll',
        updateScrollEffects
    );

    updateScrollEffects();


    // =========================================================
    // GLOBAL EMAIL / GMAIL HANDLER
    // =========================================================

    const initMailtoHandler = () => {

        const mailElements =
            document.querySelectorAll<HTMLElement>(
                'a[href^="mailto:"], [aria-label="Email"]'
            );

        mailElements.forEach((element) => {

            element.addEventListener('click', (event) => {

                event.preventDefault();

                const email =
                    'support@arikacollabs.com';


                // -------------------------------------------------
                // COPY EMAIL TO CLIPBOARD
                // -------------------------------------------------

                navigator.clipboard
                    ?.writeText(email)
                    .catch(() => {});


                // -------------------------------------------------
                // SHOW TOAST
                // -------------------------------------------------

                let toast =
                    document.getElementById(
                        'global-mail-toast'
                    );

                if (!toast) {

                    toast =
                        document.createElement('div');

                    toast.id =
                        'global-mail-toast';

                    toast.className =
                        'fixed bottom-8 right-8 z-[200] px-6 py-4 rounded-full bg-[#181615] border border-[#DDA291] text-[#DDA291] font-mono text-xs sm:text-sm shadow-[0_10px_35px_rgba(221,162,145,0.4)] flex items-center gap-3 backdrop-blur-xl transition-all duration-300 opacity-0 translate-y-4';

                    toast.innerHTML = `
                        <span class="material-symbols-outlined text-emerald-400 text-lg">
                            mark_email_read
                        </span>

                        <span class="text-white font-semibold">
                            ✓ Gmail copied: ${email}
                        </span>
                    `;

                    document.body.appendChild(toast);
                }


                setTimeout(() => {

                    if (toast) {

                        toast.classList.remove(
                            'opacity-0',
                            'translate-y-4'
                        );

                        toast.classList.add(
                            'opacity-100',
                            'translate-y-0'
                        );
                    }

                }, 10);


                setTimeout(() => {

                    if (toast) {

                        toast.classList.remove(
                            'opacity-100',
                            'translate-y-0'
                        );

                        toast.classList.add(
                            'opacity-0',
                            'translate-y-4'
                        );
                    }

                }, 4000);


                // -------------------------------------------------
                // SCROLL TO CONTACT FORM
                // -------------------------------------------------

                const inquiryForm =
                    document.getElementById(
                        'inquiry-form'
                    ) ||
                    document.getElementById(
                        'contact-coordinates'
                    ) ||
                    document.getElementById(
                        'contact-section'
                    );

                if (inquiryForm) {

                    inquiryForm.scrollIntoView({
                        behavior: 'smooth'
                    });

                }


                // -------------------------------------------------
                // OPEN GMAIL
                // -------------------------------------------------

                const gmailUrl =
                    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent('ARIKA COLLABS - Campaign Inquiry')}`;

                try {

                    window.open(
                        gmailUrl,
                        '_blank',
                        'noopener,noreferrer'
                    );

                } catch {

                    window.location.href =
                        `mailto:${email}`;
                }

            });

        });

    };


    initMailtoHandler();


    // =========================================================
    // INTERNAL ANCHOR SMOOTH SCROLL
    // =========================================================

    document
        .querySelectorAll<HTMLAnchorElement>(
            'a[href^="#"]'
        )
        .forEach((anchor) => {

            anchor.addEventListener(
                'click',
                (event) => {

                    const href =
                        anchor.getAttribute('href');

                    if (
                        href &&
                        href !== '#' &&
                        href.startsWith('#')
                    ) {

                        const targetElement =
                            document.querySelector(href);

                        if (targetElement) {

                            event.preventDefault();

                            const headerOffset = 90;

                            const elementPosition =
                                targetElement
                                    .getBoundingClientRect()
                                    .top;

                            const offsetPosition =
                                elementPosition +
                                window.pageYOffset -
                                headerOffset;

                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });

                        }

                    }

                }
            );

        });


    // =========================================================
    // INQUIRY TOPIC PILLS
    // =========================================================

    const topicPills =
        document.querySelectorAll<HTMLButtonElement>(
            '.inquiry-topic-pill'
        );

    const globalSelectDropdown =
        document.querySelector<HTMLSelectElement>(
            '#inquiry-form select'
        );


    topicPills.forEach((pill) => {

        pill.addEventListener('click', () => {

            const topic =
                pill.getAttribute('data-topic');

            if (
                topic &&
                globalSelectDropdown
            ) {

                for (
                    let i = 0;
                    i < globalSelectDropdown.options.length;
                    i++
                ) {

                    const option =
                        globalSelectDropdown.options[i];

                    if (
                        option.text
                            .toLowerCase()
                            .includes(topic.toLowerCase()) ||
                        option.value
                            .toLowerCase()
                            .includes(topic.toLowerCase())
                    ) {

                        globalSelectDropdown.selectedIndex =
                            i;

                        break;
                    }

                }

            }


            const formContainer =
                document.getElementById(
                    'inquiry-form'
                );

            if (formContainer) {

                const headerOffset = 90;

                const elementPosition =
                    formContainer
                        .getBoundingClientRect()
                        .top;

                const offsetPosition =
                    elementPosition +
                    window.pageYOffset -
                    headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

            }

        });

    });


    // =========================================================
    // INQUIRY FORM
    // =========================================================

    const form =
        document.querySelector<HTMLFormElement>(
            '#inquiry-form form'
        ) ||
        document.querySelector<HTMLFormElement>(
            'form'
        );


    if (!form) {
        console.warn(
            '[Contact Form] Inquiry form not found.'
        );

        return;
    }


    form.addEventListener(
        'submit',
        async (event) => {

            event.preventDefault();


            // =================================================
            // REMOVE OLD ERRORS
            // =================================================

            const existingError =
                form.querySelector(
                    '.form-error-banner'
                );

            if (existingError) {
                existingError.remove();
            }


            // =================================================
            // FIND FORM ELEMENTS
            // =================================================

            const nameInput =
                form.querySelector<HTMLInputElement>(
                    '#contact-name, input[name="fullName"], input[name="name"]'
                ) ||
                form.querySelectorAll<HTMLInputElement>(
                    'input[type="text"]'
                )[0];


            const companyInput =
                form.querySelector<HTMLInputElement>(
                    '#contact-company, input[name="companyName"], input[name="company"]'
                ) ||
                form.querySelectorAll<HTMLInputElement>(
                    'input[type="text"]'
                )[1];


            const emailInput =
                form.querySelector<HTMLInputElement>(
                    '#contact-email, input[name="email"], input[type="email"]'
                );


            const phoneInput =
                form.querySelector<HTMLInputElement>(
                    '#contact-phone, input[name="phone"], input[type="tel"]'
                );


            const inquirySelect =
                form.querySelector<HTMLSelectElement>(
                    '#contact-inquiry-type, select[name="inquiryType"], select'
                );


            const messageInput =
                form.querySelector<HTMLTextAreaElement>(
                    '#contact-message, textarea[name="campaignMessage"], textarea[name="message"], textarea'
                );


            const submitBtn =
                form.querySelector<HTMLButtonElement>(
                    '#contact-submit-btn, button[type="submit"]'
                ) ||
                form.querySelector<HTMLButtonElement>(
                    'button'
                );


            // =================================================
            // COLLECT VALUES
            // =================================================

            const name =
                nameInput?.value.trim() || '';

            const company =
                companyInput?.value.trim() || '';

            const email =
                emailInput?.value.trim() || '';

            const phone =
                phoneInput?.value.trim() || '';

            const inquiryType =
                inquirySelect?.value.trim() ||
                'Brand Collaboration Campaign';

            const message =
                messageInput?.value.trim() || '';


            // =================================================
            // DEBUG - CHECK WHAT FORM COLLECTED
            // =================================================

            console.log(
                '[Contact Form] Collected data:',
                {
                    name,
                    company,
                    email,
                    phone,
                    inquiryType,
                    message
                }
            );


            // =================================================
            // VALIDATION
            // =================================================

            if (!name) {

                showFormError(
                    form,
                    'Please enter your Full Name.'
                );

                nameInput?.focus();

                return;
            }


            if (!email) {

                showFormError(
                    form,
                    'Please enter your Email Address.'
                );

                emailInput?.focus();

                return;
            }


            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailRegex.test(email)) {

                showFormError(
                    form,
                    'Please enter a valid Email Address (e.g., alex@luxury.com).'
                );

                emailInput?.focus();

                return;
            }


            if (!message) {

                showFormError(
                    form,
                    'Please enter your Campaign Message / Project Brief.'
                );

                messageInput?.focus();

                return;
            }


            // =================================================
            // DISABLE SUBMIT BUTTON
            // =================================================

            if (submitBtn) {

                submitBtn.disabled = true;

                submitBtn.setAttribute(
                    'data-original-text',
                    submitBtn.innerHTML
                );

                submitBtn.innerHTML = `
                    <span class="inline-flex items-center justify-center gap-2.5 font-bold tracking-widest">

                        <svg
                            class="animate-spin h-5 w-5 text-current"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >

                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="3.5"
                            ></circle>

                            <path
                                class="opacity-90"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>

                        </svg>

                        <span>
                            TRANSMITTING INQUIRY...
                        </span>

                    </span>
                `;

            }


            // =================================================
            // SUBMIT
            // =================================================

            try {

                // -------------------------------------------------
                // PREPARE GOOGLE SHEETS DATA
                // -------------------------------------------------

                const googleSheetsData = {

                    fullName: name,

                    companyName: company,

                    email: email,

                    phone: phone,

                    inquiryType: inquiryType,

                    campaignMessage: message

                };


                console.log(
                    '[Contact Form] Sending to Google Sheets:',
                    googleSheetsData
                );


                // -------------------------------------------------
                // START GOOGLE SHEETS SUBMISSION
                // -------------------------------------------------

                const googleSheetsPromise =
                    submitToGoogleSheets(
                        googleSheetsData
                    );


                // -------------------------------------------------
                // EMAIL CONFIGURATION
                // -------------------------------------------------

                const serviceId =
                    import.meta.env
                        .VITE_EMAILJS_SERVICE_ID;

                const templateId =
                    import.meta.env
                        .VITE_EMAILJS_TEMPLATE_ID;

                const publicKey =
                    import.meta.env
                        .VITE_EMAILJS_PUBLIC_KEY;


                let emailSuccess = false;


                // =================================================
                // EMAILJS
                // =================================================

                if (
                    serviceId &&
                    templateId &&
                    publicKey
                ) {

                    try {

                        const templateParams = {

                            to_email:
                                'alfaiz.pathan@arikacollabs.com',

                            to_name:
                                'Alfaiz Pathan',

                            from_name:
                                name,

                            user_name:
                                name,

                            name:
                                name,

                            from_email:
                                email,

                            user_email:
                                email,

                            email:
                                email,

                            reply_to:
                                email,

                            company:
                                company ||
                                'Not provided',

                            phone:
                                phone ||
                                'Not provided',

                            service:
                                inquiryType,

                            inquiry_type:
                                inquiryType,

                            subject:
                                `[ARIKA COLLABS Inquiry] ${inquiryType} from ${name}`,

                            message:
                                message

                        };


                        console.log(
                            '[Contact Form] Sending EmailJS:',
                            templateParams
                        );


                        await emailjs.send(
                            serviceId,
                            templateId,
                            templateParams,
                            publicKey
                        );


                        emailSuccess = true;


                        console.log(
                            '[Contact Form] EmailJS successful.'
                        );


                    } catch (emailJsError) {

                        console.warn(
                            '[Contact Form] EmailJS failed. Trying backend...',
                            emailJsError
                        );

                    }

                }


                // =================================================
                // BACKEND EMAIL FALLBACK
                // =================================================

                if (!emailSuccess) {

                    try {

                        const response =
                            await fetch(
                                '/api/send-email',
                                {
                                    method: 'POST',

                                    headers: {
                                        'Content-Type':
                                            'application/json'
                                    },

                                    body: JSON.stringify({

                                        name,

                                        company,

                                        email,

                                        phone,

                                        service:
                                            inquiryType,

                                        message

                                    })
                                }
                            );


                        let data: any = {};

                        try {
                            data =
                                await response.json();
                        } catch {
                            data = {};
                        }


                        if (
                            response.ok &&
                            data?.success
                        ) {

                            emailSuccess = true;

                            console.log(
                                '[Contact Form] Backend email successful.'
                            );

                        } else {

                            console.warn(
                                '[Contact Form] Backend email failed:',
                                data
                            );

                        }

                    } catch (backendEmailError) {

                        console.warn(
                            '[Contact Form] Backend email request failed:',
                            backendEmailError
                        );

                    }

                }


                // =================================================
                // WAIT FOR GOOGLE SHEETS
                // =================================================

                const googleSheetsResult =
                    await googleSheetsPromise;


                console.log(
                    '[Contact Form] Google Sheets result:',
                    googleSheetsResult
                );


                // =================================================
                // GOOGLE SHEETS FAILED
                // =================================================

                if (!googleSheetsResult.success) {

                    throw new Error(
                        'Your inquiry could not be recorded in Google Sheets. Please try again.'
                    );

                }


                // =================================================
                // GOOGLE SHEETS SUCCESS
                // =================================================

                console.log(
                    '[Contact Form] Google Sheets submission successful.'
                );


                // =================================================
                // SHOW SUCCESS TOAST
                // =================================================

                showSuccessToast({

                    title:
                        'Inquiry Submitted',

                    message:
                        'Thank you! Your inquiry has been received. We will be in touch shortly.',

                    duration:
                        5000

                });


                // =================================================
                // REMOVE ERROR BANNER
                // =================================================

                const existingBanner =
                    form.querySelector(
                        '.form-error-banner'
                    );

                if (existingBanner) {
                    existingBanner.remove();
                }


                // =================================================
                // SUCCESS BANNER
                // =================================================

                let successBanner =
                    form.querySelector<HTMLDivElement>(
                        '.form-success-banner'
                    );


                if (!successBanner) {

                    successBanner =
                        document.createElement('div');

                    successBanner.className =
                        'form-success-banner p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-6 flex items-center justify-between shadow-lg transition-all animate-fade-in';

                    form.insertBefore(
                        successBanner,
                        form.firstChild
                    );

                }


                successBanner.innerHTML = `

                    <div class="flex items-center gap-2.5">

                        <span
                            class="material-symbols-outlined text-emerald-400 text-base"
                            style="font-variation-settings: 'FILL' 1;"
                        >
                            check_circle
                        </span>

                        <span class="font-medium">
                            Inquiry submitted & recorded successfully!
                        </span>

                    </div>

                    <button
                        type="button"
                        class="dismiss-btn text-emerald-400/60 hover:text-emerald-300 transition-colors p-1"
                        aria-label="Dismiss"
                    >

                        <span class="material-symbols-outlined text-sm">
                            close
                        </span>

                    </button>
                `;


                const dismissBtn =
                    successBanner.querySelector(
                        '.dismiss-btn'
                    );


                if (dismissBtn) {

                    dismissBtn.addEventListener(
                        'click',
                        () => {
                            successBanner?.remove();
                        }
                    );

                }


                // =================================================
                // RESET FORM
                // =================================================

                form.reset();


                if (nameInput) {
                    nameInput.value = '';
                }

                if (companyInput) {
                    companyInput.value = '';
                }

                if (emailInput) {
                    emailInput.value = '';
                }

                if (phoneInput) {
                    phoneInput.value = '';
                }

                if (messageInput) {
                    messageInput.value = '';
                }

                if (inquirySelect) {
                    inquirySelect.selectedIndex = 0;
                }


                // =================================================
                // RESTORE BUTTON
                // =================================================

                restoreSubmitButton(
                    submitBtn
                );


                // =================================================
                // EMAIL WARNING
                // =================================================

                if (!emailSuccess) {

                    console.warn(
                        '[Contact Form] Google Sheets succeeded, but email notification failed.'
                    );

                }


            } catch (error: any) {

                console.error(
                    '[Contact Form] Submission failed:',
                    error
                );


                // =================================================
                // RESTORE BUTTON
                // =================================================

                restoreSubmitButton(
                    submitBtn
                );


                // =================================================
                // SHOW ERROR
                // =================================================

                showFormError(
                    form,
                    error?.message ||
                    'An error occurred while submitting your inquiry. Please try again.'
                );

            }

        }
    );


    // =========================================================
    // RESTORE SUBMIT BUTTON
    // =========================================================

    function restoreSubmitButton(
        button: HTMLButtonElement | null
    ) {

        if (!button) {
            return;
        }

        button.disabled = false;

        const originalText =
            button.getAttribute(
                'data-original-text'
            );


        if (originalText) {

            button.innerHTML =
                originalText;

        } else {

            button.innerHTML = `
                <span>
                    INQUIRE NOW
                </span>

                <span class="material-symbols-outlined text-base">
                    send
                </span>
            `;

        }

    }


    // =========================================================
    // SHOW FORM ERROR
    // =========================================================

    function showFormError(
        formElement: HTMLFormElement,
        errorMessage: string
    ) {

        let errorBanner =
            formElement.querySelector<HTMLDivElement>(
                '.form-error-banner'
            );


        if (!errorBanner) {

            errorBanner =
                document.createElement('div');

            errorBanner.className =
                'form-error-banner p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-xs font-mono my-4 flex items-center gap-3 shadow-lg';

            formElement.insertBefore(
                errorBanner,
                formElement.firstChild
            );

        }


        errorBanner.innerHTML = `

            <span
                class="material-symbols-outlined text-red-400 text-lg flex-shrink-0"
            >
                error
            </span>

            <span>
                ${escapeHtml(errorMessage)}
            </span>

        `;

    }


    // =========================================================
    // ESCAPE HTML
    // =========================================================

    function escapeHtml(
        value: string
    ): string {

        const div =
            document.createElement('div');

        div.textContent =
            value;

        return div.innerHTML;

    }

});