import { animate, inView, stagger } from 'motion';

/**
 * High-End Framer Motion Reveal & Micro-Interactions for 'Why Choose ARIKA' Section
 * 
 * Implements:
 * - Subtle staggered viewport entrance with cubic-bezier easing
 * - Luxury blur-to-focus and slight scale-up transition
 * - Hardware-accelerated 3D depth tilt & gentle lift on hover
 * - High-precision icon bounce, number accent scaling & border illumination
 */
export function initWhyChooseMotion(): void {
    const section = document.querySelector<HTMLElement>('#why-choose-section, .why-choose-section') 
        || document.querySelector<HTMLElement>('.why-choose-card')?.closest('section');
    
    if (!section) return;

    const cards = Array.from(section.querySelectorAll<HTMLElement>('.why-choose-card'));
    if (!cards.length) return;

    // Check for user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Prepare cards for Framer Motion reveal
    cards.forEach((card) => {
        // Disable CSS transitions temporarily to give full control to Framer Motion
        card.style.transition = 'none';
        card.style.opacity = '0';
        card.style.transform = prefersReducedMotion ? 'none' : 'translateY(40px) scale(0.96)';
        card.style.filter = prefersReducedMotion ? 'none' : 'blur(6px)';
        card.style.willChange = 'opacity, transform, filter';
        card.setAttribute('data-framer-animated', 'false');
    });

    let hasAnimated = false;

    const triggerReveal = () => {
        if (hasAnimated) return;
        hasAnimated = true;

        if (prefersReducedMotion) {
            animate(
                cards,
                { opacity: [0, 1] },
                { duration: 0.4, delay: stagger(0.08) }
            ).then(() => {
                cards.forEach(card => {
                    card.setAttribute('data-framer-animated', 'true');
                    card.style.filter = '';
                    card.style.willChange = 'auto';
                    card.classList.add('active', 'visible');
                });
            });
            return;
        }

        // Orchestrated Framer Motion staggered entrance
        animate(
            cards,
            {
                opacity: [0, 1],
                y: [40, 0],
                scale: [0.96, 1],
                filter: ['blur(6px)', 'blur(0px)'],
            },
            {
                delay: stagger(0.12, { startDelay: 0.08 }),
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
            }
        ).then(() => {
            cards.forEach(card => {
                card.setAttribute('data-framer-animated', 'true');
                // Clean up inline filter for crisp text rendering
                card.style.filter = '';
                card.style.willChange = 'auto';
                card.classList.add('active', 'visible');
            });
        });
    };

    // Viewport detection using Motion's inView hook
    inView(
        section,
        () => {
            triggerReveal();
        },
        {
            margin: '0px 0px -50px 0px',
        }
    );

    // Immediate check if section is already inside active viewport on load
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        setTimeout(triggerReveal, 100);
    }

    // Attach Framer Motion Interactive Micro-Interactions on each card
    cards.forEach((card) => {
        const iconBox = card.querySelector<HTMLElement>('.w-14.h-14, [class*="w-14"]');
        const numberTag = card.querySelector<HTMLElement>('span.font-mono');
        const badge = card.querySelector<HTMLElement>('.font-mono.bg-primary\\/10, [class*="bg-primary/10"]');

        let isHovered = false;

        card.addEventListener('mouseenter', () => {
            if (card.getAttribute('data-framer-animated') !== 'true') return;
            isHovered = true;

            // Lift card with spring-like bezier
            animate(
                card,
                {
                    y: -8,
                    scale: 1.015,
                },
                {
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                }
            );

            // Animate icon container
            if (iconBox) {
                animate(
                    iconBox,
                    {
                        scale: 1.1,
                        rotate: 3,
                    },
                    {
                        duration: 0.35,
                        ease: [0.34, 1.56, 0.64, 1],
                    }
                );
            }

            // Animate number tag
            if (numberTag) {
                animate(
                    numberTag,
                    {
                        scale: 1.15,
                    },
                    {
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                    }
                );
            }

            // Animate bottom badge
            if (badge) {
                animate(
                    badge,
                    {
                        scale: 1.05,
                    },
                    {
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                    }
                );
            }
        });

        // Subtle 3D cursor tracking tilt
        card.addEventListener('mousemove', (e: MouseEvent) => {
            if (!isHovered || card.getAttribute('data-framer-animated') !== 'true') return;
            const cardRect = card.getBoundingClientRect();
            const centerX = cardRect.left + cardRect.width / 2;
            const centerY = cardRect.top + cardRect.height / 2;

            const deltaX = (e.clientX - centerX) / (cardRect.width / 2);
            const deltaY = (e.clientY - centerY) / (cardRect.height / 2);

            const rotateY = deltaX * 3.5;
            const rotateX = -deltaY * 3.5;

            animate(
                card,
                {
                    rotateX: rotateX,
                    rotateY: rotateY,
                },
                {
                    duration: 0.2,
                    ease: [0.25, 1, 0.5, 1],
                }
            );
        });

        card.addEventListener('mouseleave', () => {
            isHovered = false;

            // Return to resting position
            animate(
                card,
                {
                    y: 0,
                    scale: 1.0,
                    rotateX: 0,
                    rotateY: 0,
                },
                {
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                }
            );

            if (iconBox) {
                animate(
                    iconBox,
                    {
                        scale: 1.0,
                        rotate: 0,
                    },
                    {
                        duration: 0.45,
                        ease: [0.16, 1, 0.3, 1],
                    }
                );
            }

            if (numberTag) {
                animate(
                    numberTag,
                    {
                        scale: 1.0,
                    },
                    {
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                    }
                );
            }

            if (badge) {
                animate(
                    badge,
                    {
                        scale: 1.0,
                    },
                    {
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                    }
                );
            }
        });
    });
}
