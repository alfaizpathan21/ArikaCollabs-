/**
 * Standard System Cursor Manager
 * Ensures standard browser mouse cursor behavior across all pages and light/dark modes.
 */

export function initCustomCursor(): void {
    // Remove custom cursor class to restore native browser cursor
    document.documentElement.classList.remove('has-custom-cursor');

    // Remove any leftover custom cursor DOM nodes
    const dot = document.getElementById('custom-cursor-dot');
    const ring = document.getElementById('custom-cursor-ring');

    if (dot) dot.remove();
    if (ring) ring.remove();
}
