import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    getInstagramVideoList,
    parseInstagramUrl,
    InstagramVideoItem,
    InstagramLiveConfig
} from '../config/instagram';

interface InstagramCardProps {
    item: InstagramVideoItem;
    isVisible: boolean;
}

const InstagramCard: React.FC<InstagramCardProps> = ({ item, isVisible }) => {
    const [parsedConfig, setParsedConfig] = useState<InstagramLiveConfig | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        const config = parseInstagramUrl(item.rawUrl);
        setParsedConfig(config);

        // Independent timer to prevent sticking in loading state
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, [item.rawUrl]);

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    const handleIframeError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    // Aspect ratio container class depending on orientation preference
    const aspectClass = item.aspectRatio === '9:16'
        ? 'aspect-[9/14] sm:aspect-[9/15]'
        : item.aspectRatio === '1:1'
            ? 'aspect-square'
            : 'aspect-video';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full flex flex-col justify-between rounded-2xl instagram-card bg-[#121010]/90 border border-[#DDA291]/30 p-3 sm:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl group hover:border-[#DDA291]/60 transition-all duration-300"
        >
            {/* Top Bar inside Card */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2.5">
                    {/* Instagram Gradient Logo Ring */}
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px] flex items-center justify-center shadow-sm">
                        <div className="w-full h-full bg-[#121010] rounded-full flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <span className="font-bold text-xs text-white block leading-none">
                            arika_collabs
                        </span>
                    </div>
                </div>

                {/* Badge */}
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#DDA291]/15 text-[#DDA291] border border-[#DDA291]/30">
                    {item.badge}
                </span>
            </div>

            {/* Video Frame Area - Fixed Fit Container */}
            <div className={`relative w-full ${aspectClass} rounded-xl bg-black/90 overflow-hidden border border-white/5 flex items-center justify-center`}>
                
                {/* 1. Loading Skeleton */}
                {isLoading && (
                    <div className="absolute inset-0 z-20 bg-[#151211] flex flex-col items-center justify-center gap-3 animate-pulse p-4 text-center">
                        <div className="w-10 h-10 rounded-full bg-[#DDA291]/20 flex items-center justify-center border border-[#DDA291]/30">
                            <svg className="w-5 h-5 fill-[#DDA291]" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </div>
                        <span className="text-[11px] font-mono text-gray-400">Loading Instagram Video...</span>
                    </div>
                )}

                {/* 2. Official Embedded Post/Reel Iframe (Lazy Loaded when visible) */}
                {isVisible && parsedConfig?.isValidInstagramUrl && parsedConfig.isEmbeddableType && parsedConfig.embedUrl && !hasError ? (
                    <iframe
                        title={item.title}
                        src={parsedConfig.embedUrl}
                        className="w-full h-full border-0 rounded-xl object-contain"
                        allowTransparency={true}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        onLoad={handleIframeLoad}
                        onError={handleIframeError}
                    />
                ) : (
                    /* 3. Luxury Fallback Card */
                    <div className="absolute inset-0 z-10 p-5 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#1A1615] via-[#120F0E] to-[#0A0908] rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px] shadow-lg mb-3 flex items-center justify-center">
                            <div className="w-full h-full bg-[#121010] rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </div>
                        </div>

                        <h4 className="font-bold text-sm text-white mb-1 line-clamp-2">
                            {item.title}
                        </h4>

                        <p className="text-[11px] text-gray-400 mb-4">
                            Watch directly on Instagram for the full broadcast experience.
                        </p>

                        <a
                            href={item.rawUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md"
                        >
                            <span>View on Instagram</span>
                            <span className="text-sm">↗</span>
                        </a>
                    </div>
                )}
            </div>

            {/* Bottom Info & CTA */}
            <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-white/5">
                <span className="text-gray-400 font-sans text-[11px] truncate pr-2 max-w-[180px]">
                    {item.title}
                </span>

                <a
                    href={item.rawUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#DDA291] hover:text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-0.5"
                >
                    <span>View</span>
                    <span>↗</span>
                </a>
            </div>
        </motion.div>
    );
};

interface InstagramLiveSectionProps {
    className?: string;
}

export const InstagramLiveSection: React.FC<InstagramLiveSectionProps> = ({ className = '' }) => {
    const [videoList, setVideoList] = useState<InstagramVideoItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        // Load developer-configured video list
        const list = getInstagramVideoList();
        setVideoList(list);
    }, []);

    const totalVideos = videoList.length;

    const handleNext = () => {
        if (totalVideos === 0) return;
        setCurrentIndex((prev) => (prev + 1) % totalVideos);
    };

    const handlePrev = () => {
        if (totalVideos === 0) return;
        setCurrentIndex((prev) => (prev - 1 + totalVideos) % totalVideos);
    };

    return (
        <section
            id="instagram-live-section"
            className={`py-16 sm:py-20 relative overflow-hidden bg-gradient-to-b from-black via-[#0B0908] to-black border-t border-white/10 ${className}`}
        >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#DDA291]/10 rounded-full blur-[150px] pointer-events-none z-0" />

            <div className="max-w-[1300px] mx-auto px-4 sm:px-8 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
                    <div className="text-center sm:text-left max-w-xl">
                        {/* Small Eyebrow Label */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1110] border border-[#DDA291]/40 text-[#DDA291] font-mono text-[11px] uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(221,162,145,0.2)]"
                        >
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <span className="font-bold text-white tracking-wider">INSTAGRAM</span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="font-serif-luxury text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2"
                        >
                            Latest From <span className="rose-gold-text">Arika</span>
                        </motion.h2>

                        {/* Subtitle */}
                        <p className="text-gray-400 text-xs sm:text-sm font-sans leading-relaxed">
                            Explore our latest moments, collaborations and updates.
                        </p>
                    </div>

                    {/* Navigation Arrows */}
                    {totalVideos > 1 && (
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={handlePrev}
                                aria-label="Previous video"
                                className="w-10 h-10 rounded-full border border-[#DDA291]/40 bg-[#121010]/80 text-[#DDA291] flex items-center justify-center hover:bg-[#DDA291] hover:text-black transition-all cursor-pointer shadow-md"
                            >
                                <span className="text-lg font-bold">←</span>
                            </button>
                            <button
                                onClick={handleNext}
                                aria-label="Next video"
                                className="w-10 h-10 rounded-full border border-[#DDA291]/40 bg-[#121010]/80 text-[#DDA291] flex items-center justify-center hover:bg-[#DDA291] hover:text-black transition-all cursor-pointer shadow-md"
                            >
                                <span className="text-lg font-bold">→</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Carousel Container */}
                <div className="relative overflow-hidden w-full">
                    {/* Responsive Grid for Visible Slides */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videoList.length > 0 && [0, 1, 2].map((offset) => {
                            const index = (currentIndex + offset) % totalVideos;
                            const item = videoList[index];
                            if (!item) return null;

                            // Show index 0 always, index 1 on md+, index 2 on lg+
                            const visibilityClass = offset === 0
                                ? 'block'
                                : offset === 1
                                    ? 'hidden md:block'
                                    : 'hidden lg:block';

                            return (
                                <div key={`${item.id}-${index}`} className={`${visibilityClass} w-full`}>
                                    <InstagramCard item={item} isVisible={true} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pagination Dots */}
                {totalVideos > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        {videoList.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                    idx === currentIndex
                                        ? 'w-8 bg-[#DDA291]'
                                        : 'w-2 bg-white/20 hover:bg-white/40'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default InstagramLiveSection;
