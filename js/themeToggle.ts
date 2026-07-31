/**
 * Theme Toggle Module
 * Smoothly switches between 'Dark Luxury' and 'Minimalist Light' themes while maintaining rose-gold accents.
 */

export function initThemeToggle(): void {
    const savedTheme = localStorage.getItem('arika_theme') || 'dark';
    applyTheme(savedTheme);

    // Desktop and Mobile Toggle Buttons
    const desktopBtn = document.getElementById('theme-toggle-btn');
    const mobileBtn = document.getElementById('mobile-theme-toggle-btn');

    if (desktopBtn) {
        desktopBtn.addEventListener('click', toggleTheme);
    }

    if (mobileBtn) {
        mobileBtn.addEventListener('click', toggleTheme);
    }
}

export function toggleTheme(): void {
    const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
}

export function applyTheme(theme: string): void {
    const htmlEl = document.documentElement;
    const desktopLabel = document.getElementById('theme-toggle-label');
    const mobileStatus = document.getElementById('mobile-theme-toggle-status');
    const iconSun = document.getElementById('theme-icon-sun');
    const iconMoon = document.getElementById('theme-icon-moon');

    if (theme === 'light') {
        htmlEl.classList.remove('dark');
        htmlEl.classList.add('light');
        localStorage.setItem('arika_theme', 'light');

        if (desktopLabel) desktopLabel.innerText = 'Minimalist Light';
        if (mobileStatus) mobileStatus.innerText = 'Minimalist Light';

        if (iconSun && iconMoon) {
            iconSun.classList.remove('hidden', 'scale-0', 'rotate-90');
            iconSun.classList.add('block', 'scale-100', 'rotate-0');
            iconMoon.classList.remove('block', 'scale-100', 'rotate-0');
            iconMoon.classList.add('hidden', 'scale-0', '-rotate-90');
        }
    } else {
        htmlEl.classList.remove('light');
        htmlEl.classList.add('dark');
        localStorage.setItem('arika_theme', 'dark');

        if (desktopLabel) desktopLabel.innerText = 'Dark Luxury';
        if (mobileStatus) mobileStatus.innerText = 'Dark Luxury';

        if (iconSun && iconMoon) {
            iconMoon.classList.remove('hidden', 'scale-0', '-rotate-90');
            iconMoon.classList.add('block', 'scale-100', 'rotate-0');
            iconSun.classList.remove('block', 'scale-100', 'rotate-0');
            iconSun.classList.add('hidden', 'scale-0', 'rotate-90');
        }
    }

    // Trigger subtle ripple effect on toggle button if clicked
    const desktopBtn = document.getElementById('theme-toggle-btn');
    if (desktopBtn) {
        desktopBtn.classList.add('scale-95');
        setTimeout(() => desktopBtn.classList.remove('scale-95'), 200);
    }
}

// Immediate Theme Pre-loader to prevent flash of wrong theme
(function () {
    const theme = localStorage.getItem('arika_theme');
    if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }
})();
