import { animate } from 'motion';

/**
 * High-performance Framer Motion parallax zoom-in effect for portfolio item thumbnails.
 * Tracks cursor position relative to the thumbnail container and applies hardware-accelerated
 * scale + 2D translation via Motion's animation engine.
 */
export function initPortfolioParallax(): void {
    const cards = document.querySelectorAll<HTMLElement>(
        '.portfolio-item, .masonry-item, [data-portfolio-thumb], .portfolio-card'
    );

    cards.forEach((card) => {
        const img = card.querySelector<HTMLElement>('img, .portfolio-thumb-img');
        if (!img) return;

        // Ensure parent container clips thumbnail zoom correctly
        const parent = img.parentElement;
        if (parent) {
            parent.style.overflow = 'hidden';
        }

        let isHovered = false;

        card.addEventListener('mouseenter', () => {
            isHovered = true;
            // Smooth zoom-in scale using Framer Motion animate engine
            animate(
                img as any,
                { scale: 1.12, x: 0, y: 0 },
                {
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                }
            );
        });

        card.addEventListener('mousemove', (e: MouseEvent) => {
            if (!isHovered) return;
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate offset from center normalized between -1 and 1
            const deltaX = (e.clientX - centerX) / (rect.width / 2);
            const deltaY = (e.clientY - centerY) / (rect.height / 2);

            // Subtle parallax movement (up to 12px shift)
            const moveX = Math.round(deltaX * 12);
            const moveY = Math.round(deltaY * 12);

            animate(
                img as any,
                {
                    x: moveX,
                    y: moveY,
                    scale: 1.14,
                },
                {
                    duration: 0.25,
                    ease: [0.25, 1, 0.5, 1],
                }
            );
        });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            // Smoothly return image to resting scale and position
            animate(
                img as any,
                {
                    scale: 1.0,
                    x: 0,
                    y: 0,
                },
                {
                    duration: 0.65,
                    ease: [0.16, 1, 0.3, 1],
                }
            );
        });
    });
}
