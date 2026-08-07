import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    email?: string;
}

export const EmailModal: React.FC<EmailModalProps> = ({
    isOpen,
    onClose,
    email = 'support@arikacollabs.com'
}) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const subject = encodeURIComponent('ARIKA COLLABS - Luxury Campaign Inquiry');
    const body = encodeURIComponent('Hello ARIKA COLLABS Team,\n\nI would like to inquire about campaign collaboration services.\n\nName:\nBrand/Company:\nTarget Goals:\n');

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${email}&subject=${subject}&body=${body}`;
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handleOpenGmail = () => {
        window.open(gmailUrl, '_blank', 'noopener,noreferrer');
        onClose();
    };

    const handleOpenOutlook = () => {
        window.open(outlookUrl, '_blank', 'noopener,noreferrer');
        onClose();
    };

    const handleOpenDefaultApp = () => {
        window.open(mailtoUrl, '_self');
        onClose();
    };

    const handleScrollToForm = () => {
        onClose();
        const el = document.getElementById('contact-section') || document.getElementById('inquiry-form');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                {/* Backdrop Click */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                    onClick={onClose}
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="relative w-full max-w-lg bg-[#141211] border border-[#DDA291]/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-white overflow-hidden z-10"
                >
                    {/* Glowing ambient light */}
                    <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#DDA291]/20 rounded-full blur-3xl pointer-events-none" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
                        aria-label="Close modal"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#DDA291]/15 border border-[#DDA291]/40 flex items-center justify-center text-[#DDA291]">
                            <span className="material-symbols-outlined text-2xl">mark_email_read</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#DDA291]">Direct Contact Channel</span>
                            <h3 className="text-xl font-bold tracking-tight">Compose Inquiry</h3>
                        </div>
                    </div>

                    {/* Email Display Card with Copy Button */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 mb-6">
                        <div>
                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Official Support Mail</span>
                            <span className="font-mono font-semibold text-sm text-[#DDA291]">{email}</span>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#DDA291] hover:text-black text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                        >
                            <span className="material-symbols-outlined text-sm">
                                {copied ? 'check_circle' : 'content_copy'}
                            </span>
                            <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                    </div>

                    {/* Options List */}
                    <div className="space-y-3 mb-6">
                        <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">Choose your preferred mail application:</p>

                        {/* Primary Option: Gmail Web */}
                        <button
                            onClick={handleOpenGmail}
                            className="w-full p-4 rounded-2xl bg-gradient-to-r from-red-500/20 via-red-500/10 to-transparent border border-red-500/40 hover:border-red-400 hover:bg-red-500/25 transition-all duration-300 flex items-center justify-between group cursor-pointer text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 font-bold text-lg group-hover:scale-110 transition-transform">
                                    M
                                </div>
                                <div>
                                    <span className="font-bold text-sm text-white block group-hover:text-red-300 transition-colors">
                                        Open in Gmail Web App
                                    </span>
                                    <span className="text-xs text-gray-400">Launches mail.google.com in a new browser tab</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-red-400 group-hover:translate-x-1 transition-transform">
                                open_in_new
                            </span>
                        </button>

                        {/* Secondary Option: Outlook Web */}
                        <button
                            onClick={handleOpenOutlook}
                            className="w-full p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/20 transition-all duration-300 flex items-center justify-between group cursor-pointer text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-sm group-hover:scale-110 transition-transform">
                                    O
                                </div>
                                <div>
                                    <span className="font-semibold text-xs text-white block group-hover:text-blue-300">
                                        Open in Outlook / Webmail
                                    </span>
                                    <span className="text-[11px] text-gray-400">Launches outlook.office.com composer</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-blue-400 text-sm group-hover:translate-x-1 transition-transform">
                                open_in_new
                            </span>
                        </button>

                        {/* Tertiary Option: Default Desktop Mail App */}
                        <button
                            onClick={handleOpenDefaultApp}
                            className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#DDA291]/50 hover:bg-white/10 transition-all duration-300 flex items-center justify-between group cursor-pointer text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#DDA291] group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-lg">mail</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-xs text-white block">
                                        Default System Mail App
                                    </span>
                                    <span className="text-[11px] text-gray-400">Apple Mail, Windows Mail, or Thunderbird</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-gray-400 text-sm group-hover:translate-x-1 transition-transform">
                                launch
                            </span>
                        </button>
                    </div>

                    {/* On-Page Form Shortcut */}
                    <div className="pt-3 border-t border-white/10 text-center">
                        <button
                            onClick={handleScrollToForm}
                            className="text-xs font-mono text-[#DDA291] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                            <span>Prefer using our online form? Scroll to Brief Form</span>
                            <span className="material-symbols-outlined text-sm">arrow_downward</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
