/**
 * Dynamic Hook-Based IntersectionObserver System for Section Scroll Reveals & Statistics Count-Up
 * Handles dynamic viewport detection, scroll-direction tracking, staggered entrances, and count-up counters.
 */

export interface IntersectionOptions {
    threshold?: number | number[];
    rootMargin?: string;
    root?: HTMLElement | null;
    once?: boolean;
    onIntersect?: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;
    onLeave?: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;
}

/**
 * Universal Hook-based Intersection Observer registration.
 * Allows programmatic registration of DOM elements or React refs with custom callbacks and thresholds.
 */
export function useIntersectionObserver(
    target: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement> | null,
    options: IntersectionOptions = {}
): { cleanup: () => void; reobserve: () => void } {
    if (!target) {
        return { cleanup: () => {}, reobserve: () => {} };
    }

    const {
        threshold = 0.1,
        rootMargin = '0px 0px -40px 0px',
        root = null,
        once = true,
        onIntersect,
        onLeave
    } = options;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            const el = entry.target as HTMLElement;

            if (entry.isIntersecting) {
                if (onIntersect) {
                    onIntersect(entry, obs);
                }
                if (once) {
                    obs.unobserve(el);
                }
            } else {
                if (onLeave) {
                    onLeave(entry, obs);
                }
            }
        });
    }, { threshold, rootMargin, root });

    const elements: HTMLElement[] = Array.isArray(target)
        ? target
        : target instanceof NodeList
            ? Array.from(target as NodeListOf<HTMLElement>)
            : [target];

    elements.forEach(el => observer.observe(el));

    return {
        cleanup: () => {
            elements.forEach(el => observer.unobserve(el));
            observer.disconnect();
        },
        reobserve: () => {
            elements.forEach(el => observer.observe(el));
        }
    };
}

/**
 * React Hook helper for functional React components
 */
export function useScrollRevealHook<T extends HTMLElement>(
    options: IntersectionOptions = {}
): (node: T | null) => void {
    let cleanupFn: (() => void) | null = null;

    return (node: T | null) => {
        if (cleanupFn) {
            cleanupFn();
            cleanupFn = null;
        }

        if (node) {
            const { cleanup } = useIntersectionObserver(node, {
                threshold: options.threshold ?? 0.15,
                rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
                once: options.once ?? true,
                onIntersect: (entry) => {
                    const el = entry.target as HTMLElement;
                    el.classList.add('active', 'visible', 'is-visible');
                    if (options.onIntersect) options.onIntersect(entry, null as unknown as IntersectionObserver);
                },
                ...options
            });
            cleanupFn = cleanup;
        }
    };
}

// Track global scroll direction for dynamic scroll feedback
let lastScrollY = window.scrollY;
let scrollDirection: 'down' | 'up' = 'down';

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
    lastScrollY = currentScrollY;
    document.documentElement.setAttribute('data-scroll-dir', scrollDirection);
}, { passive: true });

/**
 * Main Scroll Reveal Controller
 * Attaches dynamic intersection observers across all section elements on the page.
 */
export function initScrollReveal(): void {
    // Selector targeting sections, reveal blocks, service cards, and custom reveal utility classes
    const selector = 'section, .reveal, .section-reveal, .scroll-reveal, .reveal-on-scroll, .animate-on-scroll, .fade-in-up, .service-card, [data-reveal], [data-stagger-container]';
    const revealElements = document.querySelectorAll<HTMLElement>(selector);

    revealElements.forEach(el => {
        // Read dynamic inline settings if provided
        const customThreshold = el.dataset.revealThreshold ? parseFloat(el.dataset.revealThreshold) : undefined;
        const customDelay = el.dataset.revealDelay ? parseInt(el.dataset.revealDelay, 10) : 0;
        const revealOnce = el.dataset.revealOnce !== 'false';
        const staggerDelay = el.dataset.staggerDelay ? parseInt(el.dataset.staggerDelay, 10) : 150;

        // Immediate check if element is already inside active viewport
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
            setTimeout(() => {
                triggerElementReveal(el, staggerDelay);
            }, customDelay || 40);
        }

        useIntersectionObserver(el, {
            threshold: customThreshold ?? 0.1,
            rootMargin: '0px 0px -20px 0px',
            once: revealOnce,
            onIntersect: (entry) => {
                const target = entry.target as HTMLElement;
                target.setAttribute('data-scroll-direction', scrollDirection);

                if (customDelay > 0) {
                    setTimeout(() => triggerElementReveal(target, staggerDelay), customDelay);
                } else {
                    triggerElementReveal(target, staggerDelay);
                }
            },
            onLeave: (entry) => {
                if (!revealOnce) {
                    const target = entry.target as HTMLElement;
                    target.classList.remove('active', 'visible', 'is-visible');
                }
            }
        });
    });

    // Dedicated statistics counter observer
    const counterElements = document.querySelectorAll<HTMLElement>('[data-count]');
    counterElements.forEach(counter => {
        const rect = counter.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            setTimeout(() => animateCounter(counter), 100);
        }

        useIntersectionObserver(counter, {
            threshold: 0.15,
            rootMargin: '0px 0px -20px 0px',
            once: true,
            onIntersect: (entry) => {
                animateCounter(entry.target as HTMLElement);
            }
        });
    });

    // Initialize dynamic scroll-triggered navbar blur & hero threshold detection
    initNavbarScrollEffect();
}

/**
 * Dynamic Scroll-Triggered Navbar Blur Effect
 * Intensifies backdrop blur, saturation, border-glow, and shadow depth as user scrolls past the hero section.
 */
export function initNavbarScrollEffect(): void {
    const fixedNavbar = (document.querySelector('nav.fixed') || document.querySelector('header.fixed')) as HTMLElement | null;
    if (!fixedNavbar) return;

    const innerNav = (
        fixedNavbar.tagName.toLowerCase() === 'nav' 
            ? fixedNavbar.querySelector('div') 
            : fixedNavbar.querySelector('nav')
    ) as HTMLElement | null;

    const getHeroElement = (): HTMLElement | null => {
        return (
            document.querySelector('header.relative') ||
            document.querySelector('section.relative') ||
            document.querySelector('section[id*="hero"]') ||
            document.querySelector('main > section:first-of-type') ||
            document.querySelector('section:first-of-type')
        ) as HTMLElement | null;
    };

    const updateNavbarBlur = () => {
        const scrollY = window.scrollY;
        const heroEl = getHeroElement();
        let isPastHero = false;

        if (heroEl) {
            const rect = heroEl.getBoundingClientRect();
            // Hero section bottom edge has passed the header viewport height threshold
            isPastHero = rect.bottom <= 80;
        } else {
            isPastHero = scrollY > 300;
        }

        if (isPastHero) {
            fixedNavbar.classList.add('navbar-past-hero', 'navbar-scrolled');
        } else if (scrollY > 20) {
            fixedNavbar.classList.add('navbar-scrolled');
            fixedNavbar.classList.remove('navbar-past-hero');
        } else {
            fixedNavbar.classList.remove('navbar-scrolled', 'navbar-past-hero');
        }

        if (innerNav) {
            if (scrollY > 30) {
                innerNav.classList.add('py-2.5');
                innerNav.classList.remove('py-4');
            } else {
                innerNav.classList.add('py-4');
                innerNav.classList.remove('py-2.5');
            }
        }
    };

    window.addEventListener('scroll', updateNavbarBlur, { passive: true });
    window.addEventListener('resize', updateNavbarBlur, { passive: true });
    updateNavbarBlur();
}


/**
 * Activates reveal state on element and triggers child stagger & counters
 */
function triggerElementReveal(el: HTMLElement, staggerDelay: number = 150) {
    // Read dynamic stagger delay from element or container
    const container = (el.closest('[data-stagger-delay]') || el.closest('.services-stagger-grid')) as HTMLElement | null;
    const effectiveStaggerDelay = el.dataset.staggerDelay
        ? parseInt(el.dataset.staggerDelay, 10)
        : container?.dataset?.staggerDelay
            ? parseInt(container.dataset.staggerDelay, 10)
            : staggerDelay;

    // If element itself is a service-card or stagger-item, calculate its index among siblings
    if (el.classList.contains('service-card') || el.classList.contains('stagger-item') || el.hasAttribute('data-stagger-item')) {
        const parent = el.parentElement;
        if (parent) {
            const siblings = Array.from(parent.querySelectorAll('.service-card, .stagger-item, [data-stagger-item]'));
            const cardIndex = siblings.indexOf(el);
            const calculatedDelay = cardIndex >= 0 ? cardIndex * effectiveStaggerDelay : 0;
            setTimeout(() => {
                el.classList.add('active', 'visible', 'is-visible');
            }, calculatedDelay);
        } else {
            el.classList.add('active', 'visible', 'is-visible');
        }
    } else {
        el.classList.add('active', 'visible', 'is-visible');
    }

    // Trigger nested count-up counters
    const counters = el.querySelectorAll<HTMLElement>('[data-count]');
    counters.forEach(counter => animateCounter(counter));

    // Stagger nested service cards and child items
    const staggerItems = el.querySelectorAll<HTMLElement>('.service-card, .stagger-item, [data-stagger-item], .glass-card');
    staggerItems.forEach((item, index) => {
        const itemDelay = item.dataset.staggerIndex
            ? parseInt(item.dataset.staggerIndex, 10) * effectiveStaggerDelay
            : index * effectiveStaggerDelay;
        setTimeout(() => {
            item.classList.add('active', 'visible', 'is-visible');
        }, itemDelay);
    });
}

/**
 * Smooth physics-based count-up animation for statistic numbers
 */
function animateCounter(el: HTMLElement) {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    const countAttr = el.getAttribute('data-count');
    if (!countAttr) return;

    const target = parseFloat(countAttr);
    if (isNaN(target)) return;

    const originalText = el.innerText.trim();

    let prefix = '';
    let suffix = '';

    if (originalText.includes('M+')) {
        suffix = 'M+';
    } else if (originalText.includes('K+')) {
        suffix = 'K+';
    } else if (originalText.includes('k+')) {
        suffix = 'k+';
    } else if (originalText.includes('M')) {
        suffix = 'M';
    } else if (originalText.includes('K')) {
        suffix = 'K';
    } else if (originalText.includes('k')) {
        suffix = 'k';
    } else if (originalText.includes('%')) {
        suffix = '%';
    } else if (originalText.includes('+')) {
        suffix = '+';
    }

    if (originalText.startsWith('$')) {
        prefix = '$';
    } else if (originalText.startsWith('+')) {
        prefix = '+';
    }

    const isFloat = countAttr.includes('.');
    const decimals = isFloat ? (countAttr.split('.')[1]?.length || 1) : 0;

    const duration = 2000;
    const startTime = performance.now();

    function easeOutCubic(t: number): number {
        return 1 - Math.pow(1 - t, 3);
    }

    function update(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentValue = target * easedProgress;

        let formattedNum = isFloat
            ? currentValue.toFixed(decimals)
            : Math.floor(currentValue).toLocaleString();

        el.innerText = `${prefix}${formattedNum}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            let finalNum = isFloat
                ? target.toFixed(decimals)
                : target.toLocaleString();
            el.innerText = `${prefix}${finalNum}${suffix}`;
        }
    }

    requestAnimationFrame(update);
}


