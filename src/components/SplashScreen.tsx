import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
    onComplete?: () => void;
    forceShow?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, forceShow = false }) => {
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [progress, setProgress] = useState<number>(0);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const titleText = "ARIKA COLLABS";
    const taglineText = "Building Intelligent Digital Experiences";

    useEffect(() => {
        // Check session storage or reduced motion preference
        const hasSeenSplash = sessionStorage.getItem('arika_splash_shown');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if ((hasSeenSplash || prefersReducedMotion) && !forceShow) {
            setIsVisible(false);
            if (onComplete) onComplete();
            return;
        }

        // Animate loading bar progress
        const startTime = Date.now();
        const duration = 2500; // 2.5 seconds

        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const currentProgress = Math.min(100, (elapsed / duration) * 100);
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    setIsVisible(false);
                    sessionStorage.setItem('arika_splash_shown', 'true');
                    if (onComplete) onComplete();
                }, 400); // Allow scale-down exit transition
            }
        }, 16);

        return () => clearInterval(progressInterval);
    }, [forceShow, onComplete]);

    // Canvas Floating Gold Particles Effect
    useEffect(() => {
        if (!isVisible) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const width = (canvas.width = window.innerWidth);
        const height = (canvas.height = window.innerHeight);

        const particleCount = 45;
        const particles = Array.from({ length: particleCount }).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.5,
            color: Math.random() > 0.4 ? '#DDA291' : '#E2B3A5',
            opacity: Math.random() * 0.7 + 0.2,
            speedY: -(Math.random() * 0.4 + 0.1),
            speedX: (Math.random() - 0.5) * 0.3,
        }));

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                p.y += p.speedY;
                p.x += p.speedX;

                if (p.y < 0) p.y = height;
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.shadowColor = '#DDA291';
                ctx.shadowBlur = 6;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed inset-0 z-[99999] bg-[#070606] flex flex-col items-center justify-center overflow-hidden pointer-events-auto select-none"
                >
                    {/* Background Canvas Particles */}
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0"
                    />

                    {/* Soft Radial Ambient Lighting */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 0.35, scale: 1 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="absolute w-[600px] h-[600px] rounded-full bg-radial from-[#DDA291]/30 via-[#2B1E1A]/10 to-transparent blur-[120px] pointer-events-none z-0"
                    />

                    {/* Central 3D Glass Logo Container */}
                    <div className="relative z-10 flex flex-col items-center text-center px-6">
                        
                        {/* 3D Drop-In Logo Symbol */}
                        <motion.div
                            initial={{ y: -220, opacity: 0, scale: 0.6, rotateX: 30 }}
                            animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 140,
                                damping: 12,
                                mass: 1.1,
                                delay: 0.1
                            }}
                            className="relative w-28 h-28 md:w-36 md:h-36 mb-8 flex items-center justify-center"
                            style={{ perspective: 1000 }}
                        >
                            {/* Drop Impact Shockwave Ripple */}
                            <motion.div
                                initial={{ scale: 0.2, opacity: 0 }}
                                animate={{ scale: [0.2, 1.8, 2.4], opacity: [0, 0.85, 0] }}
                                transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
                                className="absolute inset-0 rounded-full border-2 border-[#DDA291] bg-[#DDA291]/10 pointer-events-none"
                            />

                            {/* Metallic Ring 1 */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 rounded-full border border-[#DDA291]/40 shadow-[0_0_35px_rgba(221,162,145,0.3)]"
                            />

                            {/* Metallic Ring 2 Counter-Rotating */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-2 rounded-full border border-dashed border-white/20"
                            />

                            {/* Central Emblem Diamond with Metallic Shine */}
                            <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-[#1A1817] via-[#2A2321] to-[#3B2F2C] rounded-2xl border border-[#DDA291]/60 flex items-center justify-center shadow-[0_12px_32px_rgba(0,0,0,0.85)] overflow-hidden transform rotate-45 group">
                                {/* Sweeping Metallic Shine Effect */}
                                <motion.div
                                    initial={{ x: '-150%' }}
                                    animate={{ x: '150%' }}
                                    transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
                                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 pointer-events-none"
                                />

                                <span className="transform -rotate-45 font-display-lg text-2xl md:text-3xl font-extrabold text-[#DDA291] tracking-tighter drop-shadow-[0_2px_10px_rgba(221,162,145,0.5)]">
                                    A
                                </span>
                            </div>
                        </motion.div>

                        {/* Title: ARIKA COLLABS Letter-by-Letter Staggered Reveal */}
                        <div className="flex items-center justify-center gap-[0.15em] mb-3 overflow-hidden">
                            {titleText.split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
                                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.3 + i * 0.04,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                    className={`font-display-lg font-bold text-2xl md:text-4xl tracking-wider ${
                                        char === " " ? "w-3" : "text-white"
                                    }`}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>

                        {/* Tagline: Building Intelligent Digital Experiences */}
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
                            className="text-xs md:text-sm uppercase font-mono tracking-[0.25em] text-[#DDA291]/80 max-w-md font-medium"
                        >
                            {taglineText}
                        </motion.p>
                    </div>

                    {/* Bottom Gold Progress Loading Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#DDA291] via-[#FFF] to-[#C68878] shadow-[0_0_12px_#DDA291]"
                            style={{ width: `${progress}%` }}
                            transition={{ ease: 'linear' }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
