/**
 * ARIKA COLLABS - Splash Screen Module (Disabled)
 * Loading screen removed per user preference for instant site access.
 */

interface SplashScreenOptions {
    forceShow?: boolean;
    duration?: number;
    onComplete?: () => void;
}

export function initSplashScreen(options: SplashScreenOptions = {}): void {
    const { onComplete } = options;
    document.body.classList.remove('overflow-hidden');
    document.body.classList.add('splash-complete');
    if (onComplete) {
        onComplete();
    }
}

export function resetSplashSession(): void {
    // No-op
}

