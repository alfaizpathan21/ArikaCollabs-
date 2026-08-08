import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactForm } from './components/ContactForm';
import { EmailModal } from './components/EmailModal';
import { InstagramLiveSection } from './components/InstagramLiveSection';

export default function App() {
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        return (localStorage.getItem('arika_theme') as 'dark' | 'light') || 'dark';
    });

    useEffect(() => {
        const html = document.documentElement;
        if (theme === 'light') {
            html.classList.remove('dark');
            html.classList.add('light');
        } else {
            html.classList.remove('light');
            html.classList.add('dark');
        }
        localStorage.setItem('arika_theme', theme);
    }, [theme]);

    const handleToggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const handleEmailClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const email = 'support@arikacollabs.com';

        // 1. Show interactive Email Option Modal
        setIsEmailModalOpen(true);

        // 2. Direct launch Gmail web compose window in new browser tab
        const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent('ARIKA COLLABS - Campaign Inquiry')}`;
        try {
            window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
        } catch {
            // popup blocked or handled by modal
        }

        // 3. Copy email address to clipboard
        navigator.clipboard.writeText(email)
            .then(() => {
                setToastMessage(`✓ Opened Gmail & copied support@arikacollabs.com`);
            })
            .catch(() => {
                setToastMessage(`Email: ${email}`);
            });

        setTimeout(() => {
            setToastMessage(null);
        }, 5000);
    };

    return (
        <div className="min-h-screen bg-surface text-on-surface flex flex-col justify-between font-sans selection:bg-[#DDA291] selection:text-black transition-colors duration-500 relative">
            {/* Toast Notification Banner for Gmail / Email copy */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-full bg-[#181615] border border-[#DDA291] text-[#DDA291] font-mono text-xs sm:text-sm shadow-[0_10px_35px_rgba(221,162,145,0.4)] flex items-center gap-3 backdrop-blur-xl"
                    >
                        <span className="material-symbols-outlined text-lg text-emerald-400">mark_email_read</span>
                        <span className="font-semibold text-white">{toastMessage}</span>
                        <button
                            onClick={() => setToastMessage(null)}
                            className="ml-2 hover:text-white transition-colors cursor-pointer text-gray-400"
                            aria-label="Close notification"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top Navigation */}
            <header className="px-8 py-6 flex items-center justify-between border-b border-white/10 bg-surface/80 backdrop-blur-md">
                <span className="font-bold text-xl tracking-wider text-[#DDA291] drop-shadow-[0_0_10px_rgba(221,162,145,0.2)]">ARIKA COLLABS</span>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleEmailClick}
                        className="btn-glow-outline px-4 py-2 rounded-full border border-[#DDA291]/40 text-[#DDA291] text-xs font-mono flex items-center gap-2 cursor-pointer group"
                        title="Direct Email: support@arikacollabs.com"
                    >
                        <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:scale-125">mail</span>
                        <span className="hidden sm:inline font-semibold">Gmail Support</span>
                    </button>
                    <button
                        onClick={handleToggleTheme}
                        className="btn-glow-outline px-4 py-2 rounded-full border border-[#DDA291]/40 text-[#DDA291] text-xs font-mono flex items-center gap-2 cursor-pointer group"
                        title="Toggle Light/Dark Theme"
                    >
                        <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:rotate-45">
                            {theme === 'dark' ? 'light_mode' : 'bedtime'}
                        </span>
                        <span>{theme === 'dark' ? 'Dark Luxury' : 'Minimalist Light'}</span>
                    </button>
                </div>
            </header>

            {/* Hero Main Area */}
            <motion.main
                initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-4xl mx-auto px-6 py-20 text-center flex-1 flex flex-col items-center justify-center"
            >
                <span className="px-4 py-1.5 rounded-full bg-[#DDA291]/10 text-[#DDA291] text-xs font-mono uppercase tracking-widest border border-[#DDA291]/30 mb-6 shadow-[0_0_15px_rgba(221,162,145,0.2)]">
                    Luxury Digital Experience
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                    Building Intelligent <br />
                    <span className="bg-gradient-to-r from-[#DDA291] via-[#FFF] to-[#E2B3A5] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(221,162,145,0.3)]">
                        Digital Experiences
                    </span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mb-10 leading-relaxed">
                    Bridging elite digital talent and luxury brands with high-end, 60 FPS animated experiences and curated campaign engineering.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={handleEmailClick}
                        className="btn-glow-primary group px-8 py-4 rounded-full bg-[#DDA291] text-black font-bold text-sm hover:bg-white cursor-pointer flex items-center gap-2"
                        title="Click to copy Gmail & initiate inquiry"
                    >
                        <span>Gmail / Campaign Inquiry</span>
                        <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:translate-y-0.5 group-hover:scale-110">mail</span>
                    </button>
                </div>
            </motion.main>

            {/* Developer-Controlled Instagram Live Section */}
            <InstagramLiveSection />

            {/* Interactive Contact & Inquiry Form */}
            <ContactForm />

            {/* Footer */}
            <footer className="py-8 text-center text-xs text-gray-500 border-t border-white/10 flex flex-col items-center gap-3">
                <button
                    onClick={handleEmailClick}
                    className="flex items-center gap-2 text-[#DDA291] hover:text-white transition-colors cursor-pointer font-mono text-xs"
                >
                    <span className="material-symbols-outlined text-sm">mail</span>
                    <span>support@arikacollabs.com</span>
                </button>
                <div>© 2026 ARIKA COLLABS. All Rights Reserved.</div>
            </footer>

            {/* Email & Gmail Compose Modal */}
            <EmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
            />
        </div>
    );
}
