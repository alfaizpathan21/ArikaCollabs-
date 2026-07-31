/**
 * ARIKA COLLABS - Luxury Opening Animation (Splash Screen) Module
 * Renders a high-end, 60 FPS opening intro sequence with floating particles,
 * 3D emblem rotation, metallic shine sweep, letter-by-letter text reveal,
 * tagline fade-in, and gold progress bar before revealing the page.
 */

interface SplashScreenOptions {
    forceShow?: boolean;
    duration?: number; // ms, default 2500ms
    onComplete?: () => void;
}

export function initSplashScreen(options: SplashScreenOptions = {}): void {
    const { forceShow = false, duration = 2500, onComplete } = options;

    // Session storage check and reduced motion check
    const hasSeenSplash = sessionStorage.getItem('arika_splash_shown');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if ((hasSeenSplash || prefersReducedMotion) && !forceShow) {
        if (onComplete) onComplete();
        return;
    }

    // Prevent scrolling while splash screen is active
    document.body.classList.add('overflow-hidden');

    // Create container
    let splashContainer = document.getElementById('arika-splash-screen');
    if (!splashContainer) {
        splashContainer = document.createElement('div');
        splashContainer.id = 'arika-splash-screen';
        splashContainer.className = 'fixed inset-0 z-[99999] bg-[#070606] flex flex-col items-center justify-center overflow-hidden pointer-events-auto select-none transition-all duration-700 ease-out';
        
        splashContainer.innerHTML = `
            <!-- Particle Canvas -->
            <canvas id="splash-particle-canvas" class="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0"></canvas>

            <!-- Radial Background Glow -->
            <div class="absolute w-[600px] h-[600px] rounded-full bg-radial from-[#DDA291]/30 via-[#2B1E1A]/10 to-transparent blur-[120px] pointer-events-none z-0 animate-pulse-slow"></div>

            <!-- Central Content -->
            <div class="relative z-10 flex flex-col items-center text-center px-6">
                
                <!-- 3D Drop-In Logo Emblem Container -->
                <div class="relative w-28 h-28 md:w-36 md:h-36 mb-8 flex items-center justify-center splash-logo-drop">
                    <!-- Drop Impact Shockwave Ripple -->
                    <div class="absolute inset-0 rounded-full border-2 border-[#DDA291] bg-[#DDA291]/10 pointer-events-none splash-drop-ripple"></div>

                    <!-- Outer Rotating Ring 1 -->
                    <div class="absolute inset-0 rounded-full border border-[#DDA291]/40 shadow-[0_0_35px_rgba(221,162,145,0.3)] animate-spin-slow"></div>

                    <!-- Inner Counter-Rotating Ring 2 -->
                    <div class="absolute inset-2 rounded-full border border-dashed border-white/20 animate-spin-reverse"></div>

                    <!-- Glass Diamond Emblem with Metallic Shine -->
                    <div class="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-[#1A1817] via-[#2A2321] to-[#3B2F2C] rounded-2xl border border-[#DDA291]/60 flex items-center justify-center shadow-[0_12px_32px_rgba(0,0,0,0.85)] overflow-hidden transform rotate-45">
                        <div class="splash-shine-sweep absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 pointer-events-none"></div>
                        <span class="transform -rotate-45 font-display-lg text-2xl md:text-3xl font-extrabold text-[#DDA291] tracking-tighter drop-shadow-[0_2px_10px_rgba(221,162,145,0.5)]">
                            A
                        </span>
                    </div>
                </div>

                <!-- ARIKA COLLABS Letter-by-Letter Staggered Text -->
                <div id="splash-title-container" class="flex items-center justify-center gap-[0.15em] mb-3 overflow-hidden">
                    <!-- Letters inserted dynamically -->
                </div>

                <!-- Tagline -->
                <p id="splash-tagline" class="text-xs md:text-sm uppercase font-mono tracking-[0.25em] text-[#DDA291]/80 max-w-md font-medium opacity-0 translate-y-3 transition-all duration-700 ease-out">
                    Building Intelligent Digital Experiences
                </p>
            </div>

            <!-- Gold Bottom Loading Bar -->
            <div class="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/10 z-20">
                <div id="splash-loading-bar" class="h-full w-0 bg-gradient-to-r from-[#DDA291] via-[#FFF] to-[#C68878] shadow-[0_0_12px_#DDA291] transition-all ease-linear"></div>
            </div>
        `;

        document.body.appendChild(splashContainer);
    }

    // Populate Letter-by-Letter Reveal
    const titleContainer = document.getElementById('splash-title-container');
    const titleText = "ARIKA COLLABS";
    if (titleContainer) {
        titleContainer.innerHTML = '';
        titleText.split('').forEach((char, idx) => {
            const span = document.createElement('span');
            span.className = `font-display-lg font-bold text-2xl md:text-4xl tracking-wider transition-all duration-500 ease-out ${
                char === ' ' ? 'w-3 inline-block' : 'text-white'
            }`;
            span.style.opacity = '0';
            span.style.transform = 'translateY(35px) scale(0.9)';
            span.style.filter = 'blur(8px)';
            span.innerText = char;
            titleContainer.appendChild(span);

            // Staggered reveal
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0) scale(1)';
                span.style.filter = 'blur(0px)';
            }, 300 + idx * 45);
        });
    }

    // Tagline Fade-In
    const tagline = document.getElementById('splash-tagline');
    if (tagline) {
        setTimeout(() => {
            tagline.classList.remove('opacity-0', 'translate-y-3');
            tagline.classList.add('opacity-100', 'translate-y-0');
        }, 900);
    }

    // Particle Canvas Animation
    const canvas = document.getElementById('splash-particle-canvas') as HTMLCanvasElement | null;
    let animFrameId: number;

    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const width = (canvas.width = window.innerWidth);
            const height = (canvas.height = window.innerHeight);

            const particles = Array.from({ length: 45 }).map(() => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.8 + 0.5,
                color: Math.random() > 0.4 ? '#DDA291' : '#E2B3A5',
                opacity: Math.random() * 0.7 + 0.2,
                speedY: -(Math.random() * 0.4 + 0.1),
                speedX: (Math.random() - 0.5) * 0.3,
            }));

            const renderParticles = () => {
                ctx.clearRect(0, 0, width, height);
                particles.forEach((p) => {
                    p.y += p.speedY;
                    p.x += p.speedX;

                    if (p.y < 0) p.y = height;
                    if (p.x < 0) p.x = width;
                    if (p.x > width) p.x = 0;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.opacity;
                    ctx.shadowColor = '#DDA291';
                    ctx.shadowBlur = 6;
                    ctx.fill();
                });
                animFrameId = requestAnimationFrame(renderParticles);
            };
            renderParticles();
        }
    }

    // Animate Progress Bar
    const loadingBar = document.getElementById('splash-loading-bar');
    const startTime = Date.now();

    const updateBar = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / duration) * 100);

        if (loadingBar) {
            loadingBar.style.width = `${progress}%`;
        }

        if (progress < 100) {
            requestAnimationFrame(updateBar);
        } else {
            // Completion Sequence
            setTimeout(() => {
                if (animFrameId) cancelAnimationFrame(animFrameId);

                // Exit animation on splash screen
                if (splashContainer) {
                    splashContainer.style.opacity = '0';
                    splashContainer.style.transform = 'scale(0.98)';
                    splashContainer.style.filter = 'blur(10px)';
                    splashContainer.style.pointerEvents = 'none';
                }

                document.body.classList.remove('overflow-hidden');
                sessionStorage.setItem('arika_splash_shown', 'true');

                setTimeout(() => {
                    if (splashContainer && splashContainer.parentNode) {
                        splashContainer.parentNode.removeChild(splashContainer);
                    }
                    if (onComplete) onComplete();
                }, 700);
            }, 300);
        }
    };

    requestAnimationFrame(updateBar);
}

// Utility function to reset session storage for testing/replay
export function resetSplashSession(): void {
    sessionStorage.removeItem('arika_splash_shown');
}
