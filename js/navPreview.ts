/**
 * Navigation Hover Thumbnail Preview Module
 * Displays an elegant, high-end thumbnail card preview of target page content
 * when hovering over top navigation menu links on desktop devices.
 */

interface PagePreviewData {
    title: string;
    badge: string;
    description: string;
    imageUrl: string;
}

const PREVIEW_DATA: Record<string, PagePreviewData> = {
    'index.html': {
        title: 'Home & Experience',
        badge: 'Main Showcase',
        description: 'Interactive 3D logo, luxury campaigns & brand metrics.',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80'
    },
    'services.html': {
        title: 'Bespoke Services',
        badge: 'Capabilities',
        description: 'Talent representation, viral campaigns & creative strategy.',
        imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=500&q=80'
    },
    'portfolio.html': {
        title: 'Featured Works',
        badge: 'Case Studies',
        description: 'High-impact campaigns for global luxury & fashion icons.',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80'
    },
    'about.html': {
        title: 'About Arika',
        badge: 'Our Heritage',
        description: 'Meet our visionaries, philosophy & curated influencer network.',
        imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80'
    },
    'contact.html': {
        title: 'Concierge Inquiry',
        badge: 'Get In Touch',
        description: 'Connect with our team for exclusive collaborations.',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'
    }
};

export function initNavPreview(): void {
    // Only run on desktop viewport
    if (window.innerWidth < 768) return;

    let previewCard = document.getElementById('nav-hover-preview-card');

    if (!previewCard) {
        previewCard = document.createElement('div');
        previewCard.id = 'nav-hover-preview-card';
        previewCard.className = 'fixed z-[9990] pointer-events-none w-64 p-3 rounded-xl bg-[#141211]/95 border border-[#DDA291]/35 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.6)] shadow-[#DDA291]/10 transition-all duration-300 ease-out opacity-0 scale-95 translate-y-2 flex flex-col gap-2.5';
        
        previewCard.innerHTML = `
            <div class="relative w-full h-28 rounded-lg overflow-hidden border border-white/10 group">
                <img id="nav-preview-img" class="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105" src="" alt="Page Preview"/>
                <div class="absolute inset-0 bg-gradient-to-t from-[#0F0F0E] via-transparent to-transparent opacity-80"></div>
                <span id="nav-preview-badge" class="absolute top-2 left-2 text-[10px] font-bold font-label-lg tracking-wider text-[#0F0F0E] bg-[#DDA291] px-2 py-0.5 rounded-full uppercase shadow-md"></span>
            </div>
            <div class="flex flex-col gap-0.5">
                <h4 id="nav-preview-title" class="font-display-md text-sm font-bold text-white tracking-wide"></h4>
                <p id="nav-preview-desc" class="text-[11px] text-on-surface-variant leading-tight"></p>
            </div>
        `;

        document.body.appendChild(previewCard);
    }

    const previewImg = document.getElementById('nav-preview-img') as HTMLImageElement;
    const previewBadge = document.getElementById('nav-preview-badge');
    const previewTitle = document.getElementById('nav-preview-title');
    const previewDesc = document.getElementById('nav-preview-desc');

    const navLinks = document.querySelectorAll<HTMLAnchorElement>('nav a.nav-link, nav a.navbar-btn-interactive, .nav-link-preview');

    navLinks.forEach((link) => {
        const href = link.getAttribute('href') || '';
        const pageKey = Object.keys(PREVIEW_DATA).find(key => href.endsWith(key) || (key === 'index.html' && (href === '/' || href === '')));
        
        if (!pageKey || !PREVIEW_DATA[pageKey]) return;

        const data = PREVIEW_DATA[pageKey];

        link.addEventListener('mouseenter', () => {
            if (window.innerWidth < 768 || !previewCard) return;

            if (previewImg) previewImg.src = data.imageUrl;
            if (previewBadge) previewBadge.innerText = data.badge;
            if (previewTitle) previewTitle.innerText = data.title;
            if (previewDesc) previewDesc.innerText = data.description;

            const rect = link.getBoundingClientRect();
            const cardWidth = 256; // 64 * 4px = 256px
            let left = rect.left + rect.width / 2 - cardWidth / 2;

            // Constrain left to prevent overflowing viewport edges
            left = Math.max(16, Math.min(left, window.innerWidth - cardWidth - 16));

            const top = rect.bottom + 12;

            previewCard.style.left = `${left}px`;
            previewCard.style.top = `${top}px`;

            previewCard.classList.remove('opacity-0', 'scale-95', 'translate-y-2');
            previewCard.classList.add('opacity-100', 'scale-100', 'translate-y-0');
        });

        link.addEventListener('mouseleave', () => {
            if (!previewCard) return;
            previewCard.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
            previewCard.classList.add('opacity-0', 'scale-95', 'translate-y-2');
        });
    });
}
