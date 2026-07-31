import { animate } from 'motion';

/**
 * Initializes Framer Motion powered page transitions.
 * Provides a smooth fade-in / fade-out transition between pages
 * with high-end luxury aesthetics (blur, subtle scale, rose-gold accent curtain).
 */
export function initPageTransitions() {
    // 1. Ensure or create transition overlay element
    let overlay = document.getElementById('page-transition-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'page-transition-overlay';
        overlay.className = 'fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center bg-[#0A0A09] transition-colors duration-300';
        overlay.innerHTML = `
            <div id="page-transition-brand" class="flex flex-col items-center justify-center gap-3 opacity-0 transform scale-95">
                <div class="w-10 h-10 rounded-full border border-[#DDA291]/40 flex items-center justify-center bg-[#DDA291]/10 backdrop-blur-md shadow-[0_0_20px_rgba(221,162,145,0.2)]">
                    <span class="material-symbols-outlined text-[#DDA291] text-lg animate-pulse">auto_awesome</span>
                </div>
                <span class="text-xs font-mono tracking-[0.3em] uppercase text-[#DDA291]/90">ARIKA COLLABS</span>
            </div>
            <div id="page-transition-bar" class="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#DDA291] to-transparent"></div>
        `;
        document.body.appendChild(overlay);
    }

    const brandEl = overlay.querySelector('#page-transition-brand') as HTMLElement | null;
    const barEl = overlay.querySelector('#page-transition-bar') as HTMLElement | null;

    // Make body visible if hidden
    document.body.style.opacity = '1';

    // 2. Play Page Entrance Animation (Fade In)
    const playEntrance = () => {
        if (!overlay) return;
        
        const mainContent = (document.querySelector('main') || document.body) as HTMLElement;

        // Animate main content in
        animate(mainContent, {
            opacity: [0, 1],
            y: [12, 0],
            filter: ['blur(6px)', 'blur(0px)']
        } as Parameters<typeof animate>[1], {
            duration: 0.5,
            easing: [0.22, 1, 0.36, 1]
        } as Parameters<typeof animate>[2]);

        // Fade out overlay
        animate(overlay as HTMLElement, {
            opacity: [1, 0]
        } as Parameters<typeof animate>[1], {
            duration: 0.4,
            easing: 'ease-out'
        } as Parameters<typeof animate>[2]).then(() => {
            if (overlay) {
                overlay.style.pointerEvents = 'none';
                overlay.style.display = 'none';
            }
        });
    };

    // If page is loaded, run entrance
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        playEntrance();
    } else {
        window.addEventListener('DOMContentLoaded', playEntrance);
    }

    // Reset overlay on browser back/forward cache restore
    window.addEventListener('pageshow', (event) => {
        if (event.persisted && overlay) {
            overlay.style.display = 'none';
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        }
    });

    // 3. Play Page Exit Animation on internal link clicks
    const handleLinkClick = (e: MouseEvent) => {
        const anchor = (e.currentTarget as HTMLElement).closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href) return;

        // Skip anchor links (#), javascript:, mailto:, tel:, target="_blank", or external URLs
        if (
            href.startsWith('#') ||
            href.startsWith('javascript:') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            anchor.getAttribute('target') === '_blank' ||
            e.ctrlKey || e.metaKey || e.shiftKey || e.altKey
        ) {
            return;
        }

        // Check if destination is internal HTML page or root
        const currentPath = window.location.pathname;
        const targetUrl = new URL(anchor.href, window.location.href);

        if (targetUrl.origin !== window.location.origin) {
            return; // External link
        }

        // If clicking link to current page & anchor, don't trigger full transition
        if (targetUrl.pathname === currentPath && targetUrl.hash) {
            return;
        }

        e.preventDefault();

        // Show overlay for exit transition
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.pointerEvents = 'all';

            // Animate brand icon & progress bar
            if (brandEl) {
                animate(brandEl, { opacity: [0, 1], scale: [0.9, 1] } as Parameters<typeof animate>[1], { duration: 0.3 } as Parameters<typeof animate>[2]);
            }
            if (barEl) {
                animate(barEl, { width: ['0%', '100%'] } as Parameters<typeof animate>[1], { duration: 0.45, easing: 'ease-in-out' } as Parameters<typeof animate>[2]);
            }

            // Animate page overlay fade in & page content fade/blur out
            const mainContent = (document.querySelector('main') || document.body) as HTMLElement;
            
            animate(mainContent, {
                opacity: [1, 0.3],
                y: [0, -10],
                filter: ['blur(0px)', 'blur(8px)']
            } as Parameters<typeof animate>[1], {
                duration: 0.35,
                easing: [0.4, 0, 0.2, 1]
            } as Parameters<typeof animate>[2]);

            animate(overlay as HTMLElement, {
                opacity: [0, 1]
            } as Parameters<typeof animate>[1], {
                duration: 0.35,
                easing: [0.4, 0, 0.2, 1]
            } as Parameters<typeof animate>[2]).then(() => {
                window.location.href = anchor.href;
            });
        } else {
            window.location.href = anchor.href;
        }
    };

    // Attach click listener to internal links
    const attachLinkListeners = () => {
        const links = document.querySelectorAll<HTMLAnchorElement>('a[href]');
        links.forEach((link) => {
            link.removeEventListener('click', handleLinkClick);
            link.addEventListener('click', handleLinkClick);
        });
    };

    attachLinkListeners();

    // Re-attach periodically or after dynamic DOM additions if any
    const observer = new MutationObserver(() => {
        attachLinkListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

