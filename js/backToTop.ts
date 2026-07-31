/**
 * Back to Top Button Module
 * Dynamically creates a high-end luxury 'Back to Top' floating button
 * and toggles visibility precisely when the user scrolls past the hero section.
 */

export function initBackToTop(): void {
    let button = document.getElementById('back-to-top-btn');

    if (!button) {
        button = document.createElement('button');
        button.id = 'back-to-top-btn';
        button.setAttribute('aria-label', 'Back to top');
        button.className = 'fixed bottom-8 right-8 z-50 p-3.5 rounded-full bg-[#1A1A1A]/90 border border-[#DDA291]/40 text-[#DDA291] backdrop-blur-md shadow-2xl transition-all duration-300 opacity-0 pointer-events-none translate-y-4 hover:bg-[#DDA291] hover:text-[#0F0F0E] hover:border-[#DDA291] hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center group';
        button.innerHTML = `
            <span class="material-symbols-outlined text-2xl transition-transform duration-300 group-hover:-translate-y-1">arrow_upward</span>
            <span class="absolute right-full mr-3 px-3 py-1.5 rounded-md bg-[#181615] border border-white/10 text-xs font-mono text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl hidden sm:block">Back to top</span>
        `;
        document.body.appendChild(button);
    }

    // Identify the Hero section on the current page
    const getHeroElement = (): HTMLElement | null => {
        return (
            document.querySelector('section[id*="hero"]') ||
            document.querySelector('.hero-section') ||
            document.querySelector('main > section:first-of-type') ||
            document.querySelector('section:first-of-type') ||
            document.querySelector('header + section')
        ) as HTMLElement | null;
    };

    const toggleButtonVisibility = () => {
        const heroEl = getHeroElement();
        let isPastHero = false;

        if (heroEl) {
            const rect = heroEl.getBoundingClientRect();
            // Visible when hero section's bottom edge is scrolled past the top header viewport threshold (80px)
            isPastHero = rect.bottom < 80;
        } else {
            // Fallback scroll threshold if no hero section exists
            isPastHero = window.scrollY > 300;
        }

        if (isPastHero) {
            button?.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
            button?.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
        } else {
            button?.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            button?.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        }
    };

    window.addEventListener('scroll', toggleButtonVisibility, { passive: true });
    window.addEventListener('resize', toggleButtonVisibility, { passive: true });
    toggleButtonVisibility();

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

