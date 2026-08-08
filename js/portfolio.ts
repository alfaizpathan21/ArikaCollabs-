import { initCustomCursor } from './cursor';
import { initScrollReveal } from './reveal';
import { initBackToTop } from './backToTop';
import { initNavPreview } from './navPreview';
import { initThemeToggle } from './themeToggle';
import { initPageTransitions } from './pageTransition';
import { initPortfolioParallax } from './portfolioMotion';
import { initSplashScreen } from './splashScreen';
import { getInstagramVideoList, parseInstagramUrl, InstagramVideoItem } from '../src/config/instagram';

function initInstagramLiveSection() {
    const container = document.getElementById('ig-cards-container');
    const dotsContainer = document.getElementById('ig-pagination-dots');
    const prevBtn = document.getElementById('ig-carousel-prev');
    const nextBtn = document.getElementById('ig-carousel-next');

    if (!container) return;

    const videos: InstagramVideoItem[] = getInstagramVideoList();
    if (!videos || videos.length === 0) return;

    let currentIndex = 0;

    function getItemsPerPage(): number {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    function renderCarousel() {
        if (!container) return;

        const itemsPerPage = getItemsPerPage();
        const maxIndex = Math.max(0, videos.length - itemsPerPage);
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        const visibleVideos = videos.slice(currentIndex, currentIndex + itemsPerPage);

        container.innerHTML = visibleVideos.map(video => {
            const parsed = parseInstagramUrl(video.rawUrl);
            const isEmbed = parsed.isValidInstagramUrl && parsed.isEmbeddableType && parsed.embedUrl;

            return `
                <div class="instagram-card rounded-2xl bg-[#121010]/90 border border-[#DDA291]/30 p-3 sm:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:border-[#DDA291]/60 hover:shadow-[0_20px_50px_rgba(221,162,145,0.15)] group">
                    <!-- Card Top Header -->
                    <div class="flex items-center justify-between px-2 py-2 mb-2 border-b border-white/10">
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1px] flex items-center justify-center shadow-sm">
                                <div class="w-full h-full bg-[#121010] rounded-full flex items-center justify-center">
                                    <svg class="w-3 h-3 fill-white" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </div>
                            </div>
                            <span class="text-xs font-bold text-white tracking-wide">arika_collabs</span>
                        </div>
                        <span class="px-2 py-0.5 rounded-full bg-[#1A1110] border border-[#DDA291]/30 text-[#DDA291] font-mono text-[10px] uppercase font-bold">
                            ${video.badge}
                        </span>
                    </div>

                    <!-- Embed or Media Fallback Box -->
                    <div class="relative w-full aspect-[9/14] sm:aspect-[9/13] rounded-xl bg-black/80 overflow-hidden border border-white/5 flex items-center justify-center my-2">
                        ${isEmbed ? `
                            <iframe
                                title="${video.title}"
                                src="${parsed.embedUrl}"
                                class="w-full h-full border-0 rounded-xl"
                                loading="lazy"
                                allowtransparency="true"
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            ></iframe>
                        ` : `
                            <div class="absolute inset-0 p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#181514] via-[#120F0E] to-[#0A0908]">
                                <div class="relative mb-4">
                                    <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 blur-md opacity-40 animate-pulse"></div>
                                    <div class="relative w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px] flex items-center justify-center shadow-lg">
                                        <div class="w-full h-full bg-[#121010] rounded-full flex items-center justify-center">
                                            <svg class="w-6 h-6 fill-white" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <h4 class="font-bold text-sm text-white mb-1 line-clamp-1">${video.title}</h4>
                                <p class="text-xs text-gray-400 mb-4 font-sans line-clamp-2">Watch official video stream directly on Instagram</p>
                                <a href="${video.rawUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-bold text-xs hover:opacity-90 shadow-md transition-all">
                                    <span>Watch Stream</span>
                                    <span class="text-xs">↗</span>
                                </a>
                            </div>
                        `}
                    </div>

                    <!-- Card Bottom Info -->
                    <div class="px-2 pt-2 flex items-center justify-between">
                        <span class="text-xs text-gray-300 font-medium line-clamp-1 truncate max-w-[180px]">${video.title}</span>
                        <a href="${video.rawUrl}" target="_blank" rel="noopener noreferrer" class="text-[11px] font-semibold text-[#DDA291] hover:text-white transition-colors shrink-0">
                            Open App ↗
                        </a>
                    </div>
                </div>
            `;
        }).join('');

        // Pagination Dots
        if (dotsContainer) {
            const totalPages = Math.max(1, videos.length - itemsPerPage + 1);
            dotsContainer.innerHTML = Array.from({ length: totalPages }).map((_, idx) => `
                <button
                    data-page="${idx}"
                    aria-label="Go to slide ${idx + 1}"
                    class="h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-[#DDA291]' : 'w-2 bg-white/20 hover:bg-white/40'}"
                ></button>
            `).join('');

            dotsContainer.querySelectorAll<HTMLButtonElement>('button[data-page]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const page = parseInt(btn.getAttribute('data-page') || '0', 10);
                    currentIndex = page;
                    renderCarousel();
                });
            });
        }

        if (prevBtn) {
            (prevBtn as HTMLButtonElement).disabled = currentIndex <= 0;
            prevBtn.style.opacity = currentIndex <= 0 ? '0.4' : '1';
        }

        if (nextBtn) {
            const maxIdx = Math.max(0, videos.length - itemsPerPage);
            (nextBtn as HTMLButtonElement).disabled = currentIndex >= maxIdx;
            nextBtn.style.opacity = currentIndex >= maxIdx ? '0.4' : '1';
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                renderCarousel();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const itemsPerPage = getItemsPerPage();
            const maxIdx = Math.max(0, videos.length - itemsPerPage);
            if (currentIndex < maxIdx) {
                currentIndex++;
                renderCarousel();
            }
        });
    }

    window.addEventListener('resize', () => renderCarousel());
    renderCarousel();
}

document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initThemeToggle();
    initSplashScreen({ duration: 3000 });
    initInstagramLiveSection();

    initCustomCursor();
    initScrollReveal();
    initBackToTop();
    initNavPreview();
    initPortfolioParallax();

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

    // Subtle mouse movement glow effect
    document.addEventListener('mousemove', (e) => {
        const glow = document.querySelector<HTMLElement>('.luminous-glow');
        if (glow) {
            const x = e.clientX / 20;
            const y = e.clientY / 20;
            glow.style.transform = `translate(${x}px, ${y}px)`;
        }
    });

    // Parallax scrolling & scroll progress bar
    const updateScrollEffects = () => {
        const scrolled = window.pageYOffset;
        const heroText = document.querySelector<HTMLElement>('h1');
        if (heroText) {
            heroText.style.transform = `translateY(${scrolled * 0.1}px)`;
        }

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
});
