import React, { useState } from 'react';
import emailjs from 'emailjs-com';

import { showSuccessToast } from '../../js/notifications';
import { submitToGoogleSheets } from '../services/googleSheets';


interface FormData {
    name: string;
    email: string;
    service: string;
    message: string;
}


interface FormErrors {
    name?: string;
    email?: string;
    service?: string;
    message?: string;
}


const SERVICE_OPTIONS = [
    'Influencer Campaign Curation',
    'Brand Strategy & Positioning',
    'High-End Media Production',
    'Private VIP Talent Partnerships',
    'General Agency Inquiry'
];


export const ContactForm: React.FC = () => {

    // =========================================================
    // FORM STATE
    // =========================================================

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        service: '',
        message: ''
    });


    const [touched, setTouched] = useState<
        Record<keyof FormData, boolean>
    >({
        name: false,
        email: false,
        service: false,
        message: false
    });


    const [errors, setErrors] =
        useState<FormErrors>({});


    const [isSubmitting, setIsSubmitting] =
        useState(false);


    const [isSubmitted, setIsSubmitted] =
        useState(false);


    const [submitError, setSubmitError] =
        useState<string | null>(null);


    const [copiedEmail, setCopiedEmail] =
        useState(false);


    // =========================================================
    // GMAIL
    // =========================================================

    const handleOpenGmailWeb = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {

        e.preventDefault();

        const email =
            'support@arikacollabs.com';


        const gmailComposeUrl =
            `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                email
            )}&su=${encodeURIComponent(
                'ARIKA COLLABS - Campaign Inquiry'
            )}`;


        window.open(
            gmailComposeUrl,
            '_blank',
            'noopener,noreferrer'
        );
    };


    // =========================================================
    // COPY EMAIL
    // =========================================================

    const handleCopyEmail = async (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {

        e.preventDefault();

        const email =
            'support@arikacollabs.com';


        try {

            await navigator.clipboard.writeText(email);

            setCopiedEmail(true);

            setTimeout(() => {
                setCopiedEmail(false);
            }, 3000);

        } catch {

            // Even if clipboard permission fails,
            // keep the UI responsive.

            setCopiedEmail(true);

            setTimeout(() => {
                setCopiedEmail(false);
            }, 3000);
        }
    };


    // =========================================================
    // VALIDATION
    // =========================================================

    const validate = (
        data: FormData
    ): FormErrors => {

        const newErrors: FormErrors = {};


        // -----------------------------------------------------
        // NAME
        // -----------------------------------------------------

        if (!data.name.trim()) {

            newErrors.name =
                'Full name is required';

        } else if (
            data.name.trim().length < 2
        ) {

            newErrors.name =
                'Name must be at least 2 characters';
        }


        // -----------------------------------------------------
        // EMAIL
        // -----------------------------------------------------

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!data.email.trim()) {

            newErrors.email =
                'Email address is required';

        } else if (
            !emailRegex.test(
                data.email.trim()
            )
        ) {

            newErrors.email =
                'Please enter a valid email address (e.g. alex@luxury.com)';
        }


        // -----------------------------------------------------
        // SERVICE
        // -----------------------------------------------------

        if (!data.service) {

            newErrors.service =
                'Please select a campaign service';
        }


        // -----------------------------------------------------
        // MESSAGE
        // -----------------------------------------------------

        if (!data.message.trim()) {

            newErrors.message =
                'Project message / brief is required';

        } else if (
            data.message.trim().length < 10
        ) {

            newErrors.message =
                `Message is too short (${data.message.trim().length}/10 min characters)`;
        }


        return newErrors;
    };


    // =========================================================
    // FIELD BLUR
    // =========================================================

    const handleBlur = (
        field: keyof FormData
    ) => {

        setTouched((previous) => ({
            ...previous,
            [field]: true
        }));


        const currentErrors =
            validate(formData);


        setErrors(currentErrors);
    };


    // =========================================================
    // FIELD CHANGE
    // =========================================================

    const handleChange = (
        field: keyof FormData,
        value: string
    ) => {

        const updatedData = {
            ...formData,
            [field]: value
        };


        setFormData(updatedData);


        if (touched[field]) {

            const currentErrors =
                validate(updatedData);


            setErrors(currentErrors);
        }


        // Clear previous submit error
        if (submitError) {
            setSubmitError(null);
        }
    };


    // =========================================================
    // SUBMIT FORM
    // =========================================================

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();


        setSubmitError(null);


        // -----------------------------------------------------
        // MARK EVERYTHING TOUCHED
        // -----------------------------------------------------

        setTouched({
            name: true,
            email: true,
            service: true,
            message: true
        });


        // -----------------------------------------------------
        // VALIDATE
        // -----------------------------------------------------

        const validationErrors =
            validate(formData);


        setErrors(validationErrors);


        if (
            Object.keys(validationErrors).length > 0
        ) {

            return;
        }


        // -----------------------------------------------------
        // START SUBMISSION
        // -----------------------------------------------------

        setIsSubmitting(true);


        try {

            // =================================================
            // NORMALIZE VALUES
            // =================================================

            const name =
                formData.name.trim();

            const email =
                formData.email.trim();

            const service =
                formData.service.trim();

            const message =
                formData.message.trim();


            // =================================================
            // DEBUG FORM DATA
            // =================================================

            console.log(
                '[ContactForm] Form data:',
                {
                    name,
                    email,
                    service,
                    message
                }
            );


            // =================================================
            // GOOGLE SHEETS DATA
            // =================================================
            //
            // IMPORTANT:
            // These names MUST match googleSheets.ts
            //
            // fullName
            // companyName
            // email
            // phone
            // inquiryType
            // campaignMessage
            //
            // =================================================

            const googleSheetsData = {

                fullName: name,

                companyName: '',

                email: email,

                phone: '',

                inquiryType: service,

                campaignMessage: message

            };


            console.log(
                '[ContactForm] Sending to Google Sheets:',
                googleSheetsData
            );


            // =================================================
            // START GOOGLE SHEETS REQUEST
            // =================================================

            const googleSheetsPromise =
                submitToGoogleSheets(
                    googleSheetsData
                );


            // =================================================
            // EMAIL CONFIGURATION
            // =================================================

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

                        service:
                            service,

                        inquiry_type:
                            service,

                        subject:
                            `[ARIKA COLLABS Inquiry] ${service} from ${name}`,

                        message:
                            message
                    };


                    console.log(
                        '[ContactForm] Sending EmailJS data:',
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
                        '[ContactForm] EmailJS sent successfully.'
                    );


                } catch (emailJsError) {

                    console.warn(
                        '[ContactForm] EmailJS failed:',
                        emailJsError
                    );

                }

            } else {

                console.warn(
                    '[ContactForm] EmailJS environment variables are missing.'
                );
            }


            // =================================================
            // BACKEND EMAIL FALLBACK
            // =================================================

            if (!emailSuccess) {

                try {

                    console.log(
                        '[ContactForm] Trying backend email endpoint...'
                    );


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

                                    email,

                                    service,

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


                    console.log(
                        '[ContactForm] Backend email response:',
                        data
                    );


                    if (
                        response.ok &&
                        data?.success
                    ) {

                        emailSuccess = true;

                        console.log(
                            '[ContactForm] Backend email sent successfully.'
                        );

                    } else {

                        console.warn(
                            '[ContactForm] Backend email failed.'
                        );

                    }

                } catch (backendError) {

                    console.warn(
                        '[ContactForm] Backend email request failed:',
                        backendError
                    );

                }

            }


            // =================================================
            // WAIT FOR GOOGLE SHEETS
            // =================================================

            const googleSheetsResult =
                await googleSheetsPromise;


            console.log(
                '[ContactForm] Google Sheets result:',
                googleSheetsResult
            );


            // =================================================
            // CHECK GOOGLE SHEETS RESULT
            // =================================================

            if (
                !googleSheetsResult ||
                googleSheetsResult.success !== true
            ) {

                throw new Error(
                    googleSheetsResult?.error ||
                    'Your inquiry could not be recorded in Google Sheets. Please try again.'
                );
            }


            // =================================================
            // GOOGLE SHEETS SUCCESS
            // =================================================

            console.log(
                '[ContactForm] Google Sheets submission successful.'
            );


            // =================================================
            // FINAL SUCCESS
            // =================================================

            setIsSubmitting(false);

            setIsSubmitted(true);


            // =================================================
            // SUCCESS TOAST
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
            // RESET FORM
            // =================================================

            setFormData({
                name: '',
                email: '',
                service: '',
                message: ''
            });


            setTouched({
                name: false,
                email: false,
                service: false,
                message: false
            });


            setErrors({});


            // =================================================
            // EMAIL WARNING
            // =================================================

            if (!emailSuccess) {

                console.warn(
                    '[ContactForm] Google Sheets succeeded, but email notification failed.'
                );

            }


        } catch (error: any) {

            console.error(
                '[ContactForm] Submission failed:',
                error
            );


            setIsSubmitting(false);


            setSubmitError(
                error?.message ||
                'An error occurred while sending your inquiry. Please try again.'
            );

        }

    };


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setFormData({
            name: '',
            email: '',
            service: '',
            message: ''
        });


        setTouched({
            name: false,
            email: false,
            service: false,
            message: false
        });


        setErrors({});

        setSubmitError(null);

        setIsSubmitted(false);
    };


    // =========================================================
    // INPUT CLASS HELPER
    // =========================================================

    const getInputClass = (
        field: keyof FormData
    ) => {

        const hasError =
            touched[field] &&
            errors[field];

        const isValid =
            touched[field] &&
            !errors[field];


        if (hasError) {

            return `
                w-full
                px-4
                py-3
                rounded-xl
                bg-black/40
                border
                text-sm
                text-white
                placeholder-gray-500
                focus:outline-none
                transition-all
                duration-300
                border-red-500/80
                bg-red-500/5
                focus:border-red-500
                shadow-[0_0_15px_rgba(239,68,68,0.25)]
            `;

        }


        if (isValid) {

            return `
                w-full
                px-4
                py-3
                rounded-xl
                bg-black/40
                border
                text-sm
                text-white
                placeholder-gray-500
                focus:outline-none
                transition-all
                duration-300
                border-emerald-500/60
                focus:border-emerald-400
            `;

        }


        return `
            w-full
            px-4
            py-3
            rounded-xl
            bg-black/40
            border
            text-sm
            text-white
            placeholder-gray-500
            focus:outline-none
            transition-all
            duration-300
            border-white/15
            focus:border-[#DDA291]
            focus:shadow-[0_0_15px_rgba(221,162,145,0.25)]
        `;
    };


    // =========================================================
    // SELECT CLASS
    // =========================================================

    const getSelectClass = () => {

        if (
            touched.service &&
            errors.service
        ) {

            return `
                w-full
                px-4
                py-3
                rounded-xl
                bg-black/40
                border
                text-sm
                text-white
                focus:outline-none
                transition-all
                duration-300
                appearance-none
                cursor-pointer
                border-red-500/80
                bg-red-500/5
                focus:border-red-500
            `;

        }


        if (
            touched.service &&
            !errors.service
        ) {

            return `
                w-full
                px-4
                py-3
                rounded-xl
                bg-black/40
                border
                text-sm
                text-white
                focus:outline-none
                transition-all
                duration-300
                appearance-none
                cursor-pointer
                border-emerald-500/60
                focus:border-emerald-400
            `;

        }


        return `
            w-full
            px-4
            py-3
            rounded-xl
            bg-black/40
            border
            text-sm
            text-white
            focus:outline-none
            transition-all
            duration-300
            appearance-none
            cursor-pointer
            border-white/15
            focus:border-[#DDA291]
            focus:shadow-[0_0_15px_rgba(221,162,145,0.25)]
        `;
    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <section
            id="contact-section"
            className="w-full max-w-3xl mx-auto my-12 px-4"
        >

            <div
                className="
                    glass-panel
                    p-6
                    sm:p-10
                    rounded-2xl
                    border
                    border-[#DDA291]/30
                    bg-surface/90
                    shadow-[0_15px_50px_rgba(0,0,0,0.5)]
                    relative
                    overflow-hidden
                "
            >

                {/* Decorative glow */}

                <div
                    className="
                        absolute
                        -top-24
                        -right-24
                        w-60
                        h-60
                        bg-[#DDA291]/10
                        rounded-full
                        blur-3xl
                        pointer-events-none
                    "
                />


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="text-center mb-8">

                    <span
                        className="
                            px-3.5
                            py-1
                            rounded-full
                            bg-[#DDA291]/10
                            text-[#DDA291]
                            text-xs
                            font-mono
                            uppercase
                            tracking-widest
                            border
                            border-[#DDA291]/30
                            inline-block
                            mb-3
                        "
                    >
                        Initiate Collaboration
                    </span>


                    <h2
                        className="
                            text-2xl
                            sm:text-3xl
                            font-extrabold
                            tracking-tight
                            text-on-surface
                        "
                    >
                        Curate Your Next Campaign
                    </h2>


                    <p
                        className="
                            text-sm
                            text-gray-400
                            mt-2
                            max-w-lg
                            mx-auto
                        "
                    >
                        Connect with ARIKA COLLABS talent
                        coordinators for bespoke influencer
                        strategies and luxury brand partnerships.
                    </p>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 text-left"
                    noValidate
                >

                    {/* =================================================
                        SUCCESS
                    ================================================= */}

                    {isSubmitted && (

                        <div
                            className="
                                p-3.5
                                rounded-xl
                                bg-emerald-500/10
                                border
                                border-emerald-500/30
                                text-emerald-300
                                text-xs
                                font-mono
                                flex
                                items-center
                                justify-between
                                shadow-lg
                                animate-fade-in
                            "
                        >

                            <div className="flex items-center gap-2.5">

                                <span
                                    className="material-symbols-outlined text-emerald-400 text-base"
                                    style={{
                                        fontVariationSettings:
                                            "'FILL' 1"
                                    }}
                                >
                                    check_circle
                                </span>


                                <span className="font-medium">
                                    Inquiry submitted successfully!
                                    We'll reply shortly.
                                </span>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setIsSubmitted(false)
                                }
                                className="
                                    text-emerald-400/60
                                    hover:text-emerald-300
                                    transition-colors
                                    p-1
                                "
                                aria-label="Dismiss"
                            >

                                <span className="material-symbols-outlined text-sm">
                                    close
                                </span>

                            </button>

                        </div>

                    )}


                    {/* =================================================
                        GMAIL BAR
                    ================================================= */}

                    <div
                        className="
                            p-4
                            rounded-xl
                            bg-[#DDA291]/10
                            border
                            border-[#DDA291]/30
                            flex
                            flex-col
                            sm:flex-row
                            items-center
                            justify-between
                            gap-3
                            text-xs
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                text-white
                            "
                        >

                            <div
                                className="
                                    w-8
                                    h-8
                                    rounded-full
                                    bg-[#DDA291]/20
                                    border
                                    border-[#DDA291]
                                    flex
                                    items-center
                                    justify-center
                                    text-[#DDA291]
                                    flex-shrink-0
                                "
                            >

                                <span className="material-symbols-outlined text-base">
                                    mail
                                </span>

                            </div>


                            <div>

                                <span
                                    className="
                                        text-gray-400
                                        block
                                        text-[10px]
                                        uppercase
                                        font-mono
                                        tracking-wider
                                    "
                                >
                                    Direct Gmail Address
                                </span>


                                <span
                                    className="
                                        font-semibold
                                        text-[#DDA291]
                                        font-mono
                                        text-xs
                                    "
                                >
                                    support@arikacollabs.com
                                </span>

                            </div>

                        </div>


                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                w-full
                                sm:w-auto
                            "
                        >

                            <button
                                type="button"
                                onClick={handleOpenGmailWeb}
                                className="
                                    flex-1
                                    sm:flex-initial
                                    px-4
                                    py-2
                                    rounded-full
                                    bg-red-500/20
                                    hover:bg-red-500/30
                                    border
                                    border-red-500/50
                                    text-red-300
                                    font-bold
                                    text-[11px]
                                    font-mono
                                    uppercase
                                    tracking-wider
                                    transition-all
                                    duration-300
                                    flex
                                    items-center
                                    justify-center
                                    gap-1.5
                                    cursor-pointer
                                    hover:scale-105
                                    active:scale-95
                                "
                            >

                                <span className="material-symbols-outlined text-sm">
                                    open_in_new
                                </span>

                                <span>
                                    Open Gmail Web
                                </span>

                            </button>


                            <button
                                type="button"
                                onClick={handleCopyEmail}
                                className="
                                    flex-1
                                    sm:flex-initial
                                    px-4
                                    py-2
                                    rounded-full
                                    bg-[#DDA291]
                                    hover:bg-white
                                    text-black
                                    font-bold
                                    text-[11px]
                                    font-mono
                                    uppercase
                                    tracking-wider
                                    transition-all
                                    duration-300
                                    flex
                                    items-center
                                    justify-center
                                    gap-1.5
                                    cursor-pointer
                                    shadow-sm
                                    hover:scale-105
                                    active:scale-95
                                "
                            >

                                <span className="material-symbols-outlined text-sm">
                                    {copiedEmail
                                        ? 'check_circle'
                                        : 'content_copy'}
                                </span>


                                <span>
                                    {copiedEmail
                                        ? 'Copied!'
                                        : 'Copy'}
                                </span>

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        NAME + EMAIL
                    ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            gap-6
                        "
                    >

                        {/* NAME */}

                        <div>

                            <label
                                htmlFor="contact-name"
                                className="
                                    block
                                    text-xs
                                    font-mono
                                    uppercase
                                    tracking-wider
                                    text-gray-300
                                    mb-2
                                "
                            >
                                Full Name

                                <span className="text-[#DDA291]">
                                    *
                                </span>

                            </label>


                            <div className="relative">

                                <input
                                    id="contact-name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleChange(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                    onBlur={() =>
                                        handleBlur('name')
                                    }
                                    placeholder="Alexander McQueen"
                                    autoComplete="name"
                                    className={getInputClass('name')}
                                />


                                {touched.name &&
                                    !errors.name && (

                                        <span
                                            className="
                                                material-symbols-outlined
                                                absolute
                                                right-3
                                                top-3
                                                text-emerald-400
                                                text-lg
                                                pointer-events-none
                                            "
                                        >
                                            check_circle
                                        </span>

                                    )}

                            </div>


                            {touched.name &&
                                errors.name && (

                                    <p
                                        className="
                                            text-red-400
                                            text-xs
                                            font-mono
                                            mt-1.5
                                            flex
                                            items-center
                                            gap-1
                                        "
                                    >

                                        <span className="material-symbols-outlined text-xs">
                                            error
                                        </span>

                                        <span>
                                            {errors.name}
                                        </span>

                                    </p>

                                )}

                        </div>


                        {/* EMAIL */}

                        <div>

                            <label
                                htmlFor="contact-email"
                                className="
                                    block
                                    text-xs
                                    font-mono
                                    uppercase
                                    tracking-wider
                                    text-gray-300
                                    mb-2
                                "
                            >
                                Email Address

                                <span className="text-[#DDA291]">
                                    *
                                </span>

                            </label>


                            <div className="relative">

                                <input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        handleChange(
                                            'email',
                                            e.target.value
                                        )
                                    }
                                    onBlur={() =>
                                        handleBlur('email')
                                    }
                                    placeholder="alex@luxurybrand.com"
                                    autoComplete="email"
                                    className={getInputClass('email')}
                                />


                                {touched.email &&
                                    !errors.email && (

                                        <span
                                            className="
                                                material-symbols-outlined
                                                absolute
                                                right-3
                                                top-3
                                                text-emerald-400
                                                text-lg
                                                pointer-events-none
                                            "
                                        >
                                            check_circle
                                        </span>

                                    )}

                            </div>


                            {touched.email &&
                                errors.email && (

                                    <p
                                        className="
                                            text-red-400
                                            text-xs
                                            font-mono
                                            mt-1.5
                                            flex
                                            items-center
                                            gap-1
                                        "
                                    >

                                        <span className="material-symbols-outlined text-xs">
                                            error
                                        </span>

                                        <span>
                                            {errors.email}
                                        </span>

                                    </p>

                                )}

                        </div>

                    </div>


                    {/* =================================================
                        SERVICE
                    ================================================= */}

                    <div>

                        <label
                            htmlFor="contact-service"
                            className="
                                block
                                text-xs
                                font-mono
                                uppercase
                                tracking-wider
                                text-gray-300
                                mb-2
                            "
                        >
                            Campaign Focus / Service

                            <span className="text-[#DDA291]">
                                *
                            </span>

                        </label>


                        <div className="relative">

                            <select
                                id="contact-service"
                                name="service"
                                value={formData.service}
                                onChange={(e) =>
                                    handleChange(
                                        'service',
                                        e.target.value
                                    )
                                }
                                onBlur={() =>
                                    handleBlur('service')
                                }
                                className={getSelectClass()}
                            >

                                <option
                                    value=""
                                    disabled
                                    className="bg-neutral-900 text-gray-500"
                                >
                                    -- Select a luxury service --
                                </option>


                                {SERVICE_OPTIONS.map(
                                    (option) => (

                                        <option
                                            key={option}
                                            value={option}
                                            className="bg-neutral-900 text-white"
                                        >
                                            {option}
                                        </option>

                                    )
                                )}

                            </select>


                            <span
                                className="
                                    material-symbols-outlined
                                    absolute
                                    right-3
                                    top-3
                                    text-[#DDA291]
                                    text-lg
                                    pointer-events-none
                                "
                            >
                                unfold_more
                            </span>

                        </div>


                        {touched.service &&
                            errors.service && (

                                <p
                                    className="
                                        text-red-400
                                        text-xs
                                        font-mono
                                        mt-1.5
                                        flex
                                        items-center
                                        gap-1
                                    "
                                >

                                    <span className="material-symbols-outlined text-xs">
                                        error
                                    </span>

                                    <span>
                                        {errors.service}
                                    </span>

                                </p>

                            )}

                    </div>


                    {/* =================================================
                        MESSAGE
                    ================================================= */}

                    <div>

                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                mb-2
                            "
                        >

                            <label
                                htmlFor="contact-message"
                                className="
                                    block
                                    text-xs
                                    font-mono
                                    uppercase
                                    tracking-wider
                                    text-gray-300
                                "
                            >
                                Project Brief / Message

                                <span className="text-[#DDA291]">
                                    *
                                </span>

                            </label>


                            <span
                                className="
                                    text-[11px]
                                    font-mono
                                    text-gray-500
                                "
                            >
                                {formData.message.trim().length}
                                {' '}/ 500 chars (Min 10)
                            </span>

                        </div>


                        <div className="relative">

                            <textarea
                                id="contact-message"
                                name="message"
                                rows={4}
                                value={formData.message}
                                onChange={(e) =>
                                    handleChange(
                                        'message',
                                        e.target.value
                                    )
                                }
                                onBlur={() =>
                                    handleBlur('message')
                                }
                                placeholder="Describe your brand goals, target reach, and campaign timeline..."
                                maxLength={500}
                                className={getInputClass('message')}
                            />

                        </div>


                        {touched.message &&
                            errors.message && (

                                <p
                                    className="
                                        text-red-400
                                        text-xs
                                        font-mono
                                        mt-1.5
                                        flex
                                        items-center
                                        gap-1
                                    "
                                >

                                    <span className="material-symbols-outlined text-xs">
                                        error
                                    </span>

                                    <span>
                                        {errors.message}
                                    </span>

                                </p>

                            )}

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {submitError && (

                        <div
                            className="
                                p-4
                                rounded-xl
                                bg-red-500/10
                                border
                                border-red-500/40
                                text-red-300
                                text-xs
                                font-mono
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <span
                                className="
                                    material-symbols-outlined
                                    text-red-400
                                    text-lg
                                    flex-shrink-0
                                "
                            >
                                error
                            </span>


                            <span>
                                {submitError}
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        SUBMIT
                    ================================================= */}

                    <div className="pt-2">

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="
                                btn-glow-primary
                                w-full
                                py-4
                                rounded-xl
                                bg-[#DDA291]
                                text-black
                                font-bold
                                text-sm
                                uppercase
                                tracking-wider
                                flex
                                items-center
                                justify-center
                                gap-2
                                cursor-pointer
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                                transition-all
                                shadow-[0_4px_20px_rgba(221,162,145,0.3)]
                                hover:shadow-[0_4px_25px_rgba(221,162,145,0.5)]
                            "
                        >

                            {isSubmitting ? (

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2.5
                                        font-bold
                                        tracking-widest
                                    "
                                >

                                    <svg
                                        className="animate-spin h-5 w-5 text-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >

                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="3.5"
                                        />

                                        <path
                                            className="opacity-90"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />

                                    </svg>


                                    <span>
                                        SENDING INQUIRY...
                                    </span>

                                </span>

                            ) : (

                                <>
                                    <span>
                                        INQUIRE NOW
                                    </span>

                                    <span className="material-symbols-outlined text-lg">
                                        send
                                    </span>
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </section>

    );
};