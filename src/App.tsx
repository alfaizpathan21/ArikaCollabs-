import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SplashScreen } from './components/SplashScreen';

export default function App() {
    const [splashKey, setSplashKey] = useState<number>(0);
    const [splashComplete, setSplashComplete] = useState<boolean>(false);
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

    const handleReplaySplash = () => {
        sessionStorage.removeItem('arika_splash_shown');
        setSplashKey((prev) => prev + 1);
        setSplashComplete(false);
    };

    return (
        <div className="min-h-screen bg-surface text-on-surface flex flex-col justify-between font-sans selection:bg-[#DDA291] selection:text-black transition-colors duration-500">
            {/* Opening Luxury Splash Screen Component */}
            <SplashScreen key={splashKey} forceShow={splashKey > 0} onComplete={() => setSplashComplete(true)} />

            {/* Top Navigation */}
            <header className="px-8 py-6 flex items-center justify-between border-b border-white/10 bg-surface/80 backdrop-blur-md">
                <span className="font-bold text-xl tracking-wider text-[#DDA291]">ARIKA COLLABS</span>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleToggleTheme}
                        className="px-4 py-2 rounded-full border border-[#DDA291]/40 text-[#DDA291] text-xs font-mono hover:border-[#DDA291] hover:shadow-[0_0_15px_rgba(221,162,145,0.3)] transition-all flex items-center gap-2 cursor-pointer"
                        title="Toggle Light/Dark Theme"
                    >
                        <span className="material-symbols-outlined text-sm">
                            {theme === 'dark' ? 'light_mode' : 'bedtime'}
                        </span>
                        <span>{theme === 'dark' ? 'Dark Luxury' : 'Minimalist Light'}</span>
                    </button>
                    <button
                        onClick={handleReplaySplash}
                        className="px-4 py-2 rounded-full border border-[#DDA291]/40 text-[#DDA291] text-xs font-mono hover:bg-[#DDA291] hover:text-black transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">play_circle</span>
                        Replay Opening Animation
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
                <span className="px-4 py-1.5 rounded-full bg-[#DDA291]/10 text-[#DDA291] text-xs font-mono uppercase tracking-widest border border-[#DDA291]/30 mb-6">
                    Luxury Digital Experience
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                    Building Intelligent <br />
                    <span className="bg-gradient-to-r from-[#DDA291] via-[#FFF] to-[#E2B3A5] bg-clip-text text-transparent">
                        Digital Experiences
                    </span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mb-10 leading-relaxed">
                    Bridging elite digital talent and luxury brands with high-end, 60 FPS animated experiences and curated campaign engineering.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={handleReplaySplash}
                        className="px-8 py-4 rounded-full bg-[#DDA291] text-black font-bold text-sm hover:bg-white transition-all shadow-[0_0_25px_rgba(221,162,145,0.3)]"
                    >
                        Test Splash Intro Again
                    </button>
                </div>
            </motion.main>

            {/* Footer */}
            <footer className="py-6 text-center text-xs text-gray-500 border-t border-white/10">
                © 2026 ARIKA COLLABS. All Rights Reserved.
            </footer>
        </div>
    );
}
