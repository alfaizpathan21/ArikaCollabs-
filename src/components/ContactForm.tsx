import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { motion, AnimatePresence } from 'motion/react';

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
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        service: '',
        message: ''
    });

    const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
        name: false,
        email: false,
        service: false,
        message: false
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedData, setSubmittedData] = useState<FormData | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [copiedEmail, setCopiedEmail] = useState(false);

    const handleOpenGmailWeb = (e: React.MouseEvent) => {
        e.preventDefault();
        const email = 'support@arikacollabs.com';
        const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent('ARIKA COLLABS - Campaign Inquiry')}`;
        window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
    };

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        const email = 'support@arikacollabs.com';
        navigator.clipboard.writeText(email)
            .then(() => {
                setCopiedEmail(true);
                setTimeout(() => setCopiedEmail(false), 3000);
            })
            .catch(() => {
                setCopiedEmail(true);
                setTimeout(() => setCopiedEmail(false), 3000);
            });
    };

    // Validate individual field or all fields
    const validate = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};

        // Name validation
        if (!data.name.trim()) {
            newErrors.name = 'Full name is required';
        } else if (data.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!emailRegex.test(data.email.trim())) {
            newErrors.email = 'Please enter a valid email address (e.g. alex@luxury.com)';
        }

        // Service validation
        if (!data.service) {
            newErrors.service = 'Please select a campaign service';
        }

        // Message validation
        if (!data.message.trim()) {
            newErrors.message = 'Project message / brief is required';
        } else if (data.message.trim().length < 10) {
            newErrors.message = `Message is too short (${data.message.trim().length}/10 min characters)`;
        }

        return newErrors;
    };

    const handleBlur = (field: keyof FormData) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const currentErrors = validate(formData);
        setErrors(currentErrors);
    };

    const handleChange = (field: keyof FormData, value: string) => {
        const updatedData = { ...formData, [field]: value };
        setFormData(updatedData);

        // If field was touched, re-validate immediately for real-time feedback
        if (touched[field]) {
            const currentErrors = validate(updatedData);
            setErrors(currentErrors);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        // Mark all fields as touched
        setTouched({
            name: true,
            email: true,
            service: true,
            message: true
        });

        const validationErrors = validate(formData);
        setErrors(validationErrors);

        // If no errors, proceed with API submission
        if (Object.keys(validationErrors).length === 0) {
            setIsSubmitting(true);
            try {
                const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
                const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
                const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

                let success = false;

                // Try client-side EmailJS if keys are provided
                if (serviceId && templateId && publicKey) {
                    try {
                        const templateParams = {
                            to_email: 'alfaiz.pathan@arikacollabs.com',
                            to_name: 'Alfaiz Pathan',
                            from_name: formData.name,
                            user_name: formData.name,
                            name: formData.name,
                            from_email: formData.email,
                            user_email: formData.email,
                            email: formData.email,
                            reply_to: formData.email,
                            service: formData.service,
                            inquiry_type: formData.service,
                            subject: `[ARIKA COLLABS Inquiry] ${formData.service} from ${formData.name}`,
                            message: formData.message,
                        };

                        await emailjs.send(
                            serviceId,
                            templateId,
                            templateParams,
                            publicKey
                        );
                        success = true;
                    } catch (emailJsErr: any) {
                        console.warn('[ContactForm] EmailJS client dispatch failed, attempting backend endpoint...', emailJsErr);
                    }
                }

                // Fallback to backend API route (which also supports EmailJS server-side)
                if (!success) {
                    const response = await fetch('/api/send-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: formData.name,
                            email: formData.email,
                            service: formData.service,
                            message: formData.message
                        })
                    });

                    const data = await response.json();

                    if (!response.ok || !data.success) {
                        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
                    }
                }

                setIsSubmitting(false);
                setSubmittedData(formData);
                setIsSubmitted(true);
            } catch (err: any) {
                setIsSubmitting(false);
                setSubmitError(err.message || 'An error occurred while sending your inquiry. Please try again.');
            }
        }
    };

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
        setIsSubmitted(false);
        setSubmittedData(null);
    };

    return (
        <section id="contact-section" className="w-full max-w-3xl mx-auto my-12 px-4">
            <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-[#DDA291]/30 bg-surface/90 shadow-[0_15px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                
                {/* Decorative background glow ambient ring */}
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#DDA291]/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Section Header */}
                <div className="text-center mb-8">
                    <span className="px-3.5 py-1 rounded-full bg-[#DDA291]/10 text-[#DDA291] text-xs font-mono uppercase tracking-widest border border-[#DDA291]/30 inline-block mb-3">
                        Initiate Collaboration
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface">
                        Curate Your Next Campaign
                    </h2>
                    <p className="text-sm text-gray-400 mt-2 max-w-lg mx-auto">
                        Connect with ARIKA COLLABS talent coordinators for bespoke influencer strategies and luxury brand partnerships.
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {isSubmitted && submittedData ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 24, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.96 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="text-center py-8 px-4"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 15 }}
                                className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#DDA291]/20 border border-[#DDA291] flex items-center justify-center text-[#DDA291] shadow-[0_0_30px_rgba(221,162,145,0.4)]"
                            >
                                <span className="material-symbols-outlined text-3xl">verified</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25, duration: 0.4 }}
                            >
                                <h3 className="text-2xl font-bold text-on-surface mb-2">
                                    Inquiry Received, {submittedData.name}!
                                </h3>
                                <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed mb-6">
                                    Your project brief regarding <strong className="text-[#DDA291]">{submittedData.service}</strong> has been transmitted securely. Our strategy team will reach out to <strong className="text-white">{submittedData.email}</strong> within 24 hours.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.4 }}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 text-left max-w-md mx-auto mb-8 font-mono text-xs space-y-2 text-gray-300 shadow-inner"
                            >
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-500">CLIENT:</span>
                                    <span className="text-white font-semibold">{submittedData.name}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-500">EMAIL:</span>
                                    <span className="text-white">{submittedData.email}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-500">SERVICE:</span>
                                    <span className="text-[#DDA291]">{submittedData.service}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block mb-1">BRIEF SUMMARY:</span>
                                    <span className="text-gray-300 italic block line-clamp-2">"{submittedData.message}"</span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45, duration: 0.4 }}
                            >
                                <button
                                    onClick={handleReset}
                                    className="btn-glow-primary px-6 py-3 rounded-full bg-[#DDA291] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mx-auto cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-sm">refresh</span>
                                    <span>Submit Another Inquiry</span>
                                </button>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-6 text-left"
                            noValidate
                        >
                            {/* Gmail / Email Quick Connect Bar */}
                            <div className="p-4 rounded-xl bg-[#DDA291]/10 border border-[#DDA291]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-8 h-8 rounded-full bg-[#DDA291]/20 border border-[#DDA291] flex items-center justify-center text-[#DDA291] flex-shrink-0">
                                        <span className="material-symbols-outlined text-base">mail</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-mono tracking-wider">Direct Gmail Address</span>
                                        <span className="font-semibold text-[#DDA291] font-mono text-xs">support@arikacollabs.com</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={handleOpenGmailWeb}
                                        className="flex-1 sm:flex-initial px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 font-bold text-[11px] font-mono uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                                        title="Launch Gmail Web Compose in new browser tab"
                                    >
                                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                                        <span>Open Gmail Web</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCopyEmail}
                                        className="flex-1 sm:flex-initial px-4 py-2 rounded-full bg-[#DDA291] hover:bg-white text-black font-bold text-[11px] font-mono uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                                        title="Click to copy Gmail address to clipboard"
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            {copiedEmail ? 'check_circle' : 'content_copy'}
                                        </span>
                                        <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
                                    </button>
                                </div>
                            </div>
                            {/* Grid 2 Columns for Name and Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Name Input */}
                                <div>
                                    <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                                        Full Name <span className="text-[#DDA291]">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="contact-name"
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            onBlur={() => handleBlur('name')}
                                            placeholder="Alexander McQueen"
                                            className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                                                touched.name && errors.name
                                                    ? 'border-red-500/80 bg-red-500/5 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                                                    : touched.name && !errors.name
                                                    ? 'border-emerald-500/60 focus:border-emerald-400'
                                                    : 'border-white/15 focus:border-[#DDA291] focus:shadow-[0_0_15px_rgba(221,162,145,0.25)]'
                                            }`}
                                        />
                                        {touched.name && !errors.name && (
                                            <span className="material-symbols-outlined absolute right-3 top-3 text-emerald-400 text-lg pointer-events-none">
                                                check_circle
                                            </span>
                                        )}
                                    </div>
                                    {touched.name && errors.name && (
                                        <p className="text-red-400 text-xs font-mono mt-1.5 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">error</span>
                                            <span>{errors.name}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Email Input */}
                                <div>
                                    <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                                        Email Address <span className="text-[#DDA291]">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="contact-email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            onBlur={() => handleBlur('email')}
                                            placeholder="alex@luxurybrand.com"
                                            className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                                                touched.email && errors.email
                                                    ? 'border-red-500/80 bg-red-500/5 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                                                    : touched.email && !errors.email
                                                    ? 'border-emerald-500/60 focus:border-emerald-400'
                                                    : 'border-white/15 focus:border-[#DDA291] focus:shadow-[0_0_15px_rgba(221,162,145,0.25)]'
                                            }`}
                                        />
                                        {touched.email && !errors.email && (
                                            <span className="material-symbols-outlined absolute right-3 top-3 text-emerald-400 text-lg pointer-events-none">
                                                check_circle
                                            </span>
                                        )}
                                    </div>
                                    {touched.email && errors.email && (
                                        <p className="text-red-400 text-xs font-mono mt-1.5 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">error</span>
                                            <span>{errors.email}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Service Dropdown Select */}
                            <div>
                                <label htmlFor="contact-service" className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                                    Campaign Focus / Service <span className="text-[#DDA291]">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        id="contact-service"
                                        value={formData.service}
                                        onChange={(e) => handleChange('service', e.target.value)}
                                        onBlur={() => handleBlur('service')}
                                        className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-sm text-white focus:outline-none transition-all duration-300 appearance-none cursor-pointer ${
                                            touched.service && errors.service
                                                ? 'border-red-500/80 bg-red-500/5 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                                                : touched.service && !errors.service
                                                ? 'border-emerald-500/60 focus:border-emerald-400'
                                                : 'border-white/15 focus:border-[#DDA291] focus:shadow-[0_0_15px_rgba(221,162,145,0.25)]'
                                        }`}
                                    >
                                        <option value="" disabled className="bg-neutral-900 text-gray-500">
                                            -- Select a luxury service --
                                        </option>
                                        {SERVICE_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt} className="bg-neutral-900 text-white">
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-3 text-[#DDA291] text-lg pointer-events-none">
                                        unfold_more
                                    </span>
                                </div>
                                {touched.service && errors.service && (
                                    <p className="text-red-400 text-xs font-mono mt-1.5 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">error</span>
                                        <span>{errors.service}</span>
                                    </p>
                                )}
                            </div>

                            {/* Message Textarea */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-gray-300">
                                        Project Brief / Message <span className="text-[#DDA291]">*</span>
                                    </label>
                                    <span className="text-[11px] font-mono text-gray-500">
                                        {formData.message.trim().length} / 500 chars (Min 10)
                                    </span>
                                </div>
                                <div className="relative">
                                    <textarea
                                        id="contact-message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => handleChange('message', e.target.value)}
                                        onBlur={() => handleBlur('message')}
                                        placeholder="Describe your brand goals, target reach, and campaign timeline..."
                                        maxLength={500}
                                        className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none ${
                                            touched.message && errors.message
                                                ? 'border-red-500/80 bg-red-500/5 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                                                : touched.message && !errors.message
                                                ? 'border-emerald-500/60 focus:border-emerald-400'
                                                : 'border-white/15 focus:border-[#DDA291] focus:shadow-[0_0_15px_rgba(221,162,145,0.25)]'
                                        }`}
                                    ></textarea>
                                </div>
                                {touched.message && errors.message && (
                                    <p className="text-red-400 text-xs font-mono mt-1.5 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">error</span>
                                        <span>{errors.message}</span>
                                    </p>
                                )}
                            </div>

                            {/* Submit Error Banner */}
                            {submitError && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-400 text-lg flex-shrink-0">error</span>
                                    <span>{submitError}</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-glow-primary w-full py-4 rounded-xl bg-[#DDA291] text-black font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin text-lg material-symbols-outlined">sync</span>
                                            <span>Transmitting Inquiry...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Transmit Campaign Inquiry</span>
                                            <span className="material-symbols-outlined text-lg">send</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};
