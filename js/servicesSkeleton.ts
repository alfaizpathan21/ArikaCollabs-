/**
 * ARIKA COLLABS - Services Preview Skeleton Loader
 * Prevents Layout Shift (CLS) on page load with a luxury rose-gold shimmering skeleton loader.
 */
export function initServicesSkeleton(): void {
    const skeletonGrid = document.getElementById('services-skeleton-grid');
    const contentGrid = document.getElementById('services-preview-content');

    if (!skeletonGrid || !contentGrid) return;

    // Smoothly transition from skeleton shimmer to initialized content
    const revealLoadedServices = () => {
        // Fade out skeleton loader
        skeletonGrid.style.transition = 'opacity 0.4s ease';
        skeletonGrid.style.opacity = '0';
        skeletonGrid.style.pointerEvents = 'none';

        // After skeleton fade out, hide skeleton and fade in actual service content
        setTimeout(() => {
            skeletonGrid.classList.add('hidden');
            contentGrid.classList.remove('opacity-0', 'pointer-events-none');
            contentGrid.classList.add('opacity-100');
            
            // Trigger stagger entrance for loaded cards
            const serviceCards = contentGrid.querySelectorAll('.service-card');
            serviceCards.forEach((card, idx) => {
                setTimeout(() => {
                    card.classList.add('active');
                }, idx * 100);
            });
        }, 400);
    };

    // Allow shimmering skeleton to reserve exact card dimensions while content initializes
    if (document.readyState === 'complete') {
        setTimeout(revealLoadedServices, 600);
    } else {
        window.addEventListener('load', () => {
            setTimeout(revealLoadedServices, 500);
        });
        // Safety fallback timer
        setTimeout(revealLoadedServices, 1200);
    }
}
