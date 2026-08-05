/**
 * ARIKA COLLABS - Luxury Opening Animation (Splash Screen) Module
 * Renders a high-end, 60 FPS cinematic intro sequence with:
 * - Constellation star-dust particle canvas with connected golden threads
 * - Dual ambient luxury light spotlights & geometric dark grid canvas
 * - 3D 3-ring emblem rotation with metallic shine sweep & drop impact ripple
 * - Letter-by-letter staggered title reveal with rose gold champagne gradient
 * - Centered hero sequence of fading & blurring phrases
 * - Live SVG progress ring & step indicator hub
 * - Web Audio API subtle luxury ambient chime sound effect
 */

interface SplashScreenOptions {
    forceShow?: boolean;
    duration?: number; // ms, default 3200ms
    onComplete?: () => void;
}

// Web Audio API ambient chime generator
let audioCtx: AudioContext | null = null;
let isAudioMuted = false;

function playLuxuryChime(pitchMultiplier = 1.0) {
    if (isAudioMuted) return;
    try {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Pleasant pentatonic frequency (E5 / B5 / E6)
        const baseFreq = 659.25 * pitchMultiplier;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);

        // Soft bell envelope
        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.82);
    } catch {
        // Silent catch if audio is blocked or unsupported
    }
}

export function initSplashScreen(options: SplashScreenOptions = {}): void {
    const { forceShow = false, duration = 3200, onComplete } = options;

    // Session storage check and reduced motion check
    const hasSeenSplash = sessionStorage.getItem('arika_splash_shown');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if ((hasSeenSplash && !forceShow) || prefersReducedMotion) {
        if (onComplete) onComplete();
        return;
    }

    // Lock page scroll
    document.body.classList.add('overflow-hidden');

    // Create container
    let splashContainer = document.getElementById('arika-splash-screen');
    if (!splashContainer) {
        splashContainer = document.createElement('div');
        splashContainer.id = 'arika-splash-screen';
        splashContainer.className = 'fixed inset-0 z-[99999] bg-[#070606] flex flex-col items-center justify-between py-6 px-4 sm:px-8 overflow-hidden pointer-events-auto select-none transition-all duration-700 ease-out';
        
        splashContainer.innerHTML = `
            <!-- Particle Canvas -->
            <canvas id="splash-particle-canvas" class="absolute inset-0 w-full h-full pointer-events-none opacity-80 z-0"></canvas>

            <!-- Subtle Luxury Geometric Dark Grid Background -->
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

            <!-- Dual Radial Ambient Light Beams -->
            <div class="absolute top-1/4 -left-20 w-[550px] h-[550px] rounded-full bg-radial from-[#DDA291]/30 via-[#2B1E1A]/10 to-transparent blur-[130px] pointer-events-none z-0 animate-pulse-slow"></div>
            <div class="absolute bottom-1/4 -right-20 w-[550px] h-[550px] rounded-full bg-radial from-[#F8DED1]/25 via-[#2B1E1A]/10 to-transparent blur-[130px] pointer-events-none z-0 animate-pulse-slow" style="animation-delay: 2s;"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial from-[#DDA291]/20 via-transparent to-transparent blur-[120px] pointer-events-none z-0"></div>

            <!-- Top Header Controls (Brand mark + Sound Toggle + Fast-Forward Skip Button) -->
            <div class="relative z-20 w-full max-w-6xl flex justify-between items-center opacity-0 transition-opacity duration-700 pt-2" id="splash-top-bar">
                <div class="flex items-center gap-2.5 font-mono text-[11px] text-[#DDA291] uppercase tracking-[0.25em] glass-panel px-3.5 py-1.5 rounded-full border border-[#DDA291]/25 shadow-[0_0_15px_rgba(221,162,145,0.15)]">
                    <span class="w-2 h-2 rounded-full bg-[#DDA291] animate-ping"></span>
                    <span>ARIKA COLLABS • CINEMATIC INTRO</span>
                </div>
                <div class="flex items-center gap-2 sm:gap-3">
                    <button id="splash-sound-btn" class="glass-panel text-[11px] font-mono text-[#DDA291] hover:text-white px-3 py-1.5 rounded-full border border-[#DDA291]/30 hover:bg-[#DDA291]/20 hover:border-[#DDA291] transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(221,162,145,0.15)]" title="Toggle Sound Chime">
                        <span id="splash-sound-icon" class="material-symbols-outlined text-xs">volume_up</span>
                        <span id="splash-sound-label" class="hidden sm:inline">SOUND ON</span>
                    </button>
                    <button id="splash-skip-btn" class="glass-panel text-[11px] font-mono text-[#DDA291] hover:text-white px-3.5 py-1.5 rounded-full border border-[#DDA291]/30 hover:bg-[#DDA291]/20 hover:border-[#DDA291] transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(221,162,145,0.15)]" title="Skip Intro Animation">
                        <span>SKIP INTRO</span>
                        <span class="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                </div>
            </div>

            <!-- Central Content -->
            <div class="relative z-10 flex flex-col items-center justify-center text-center max-w-3xl mx-auto my-auto py-4 px-2">
                
                <!-- Dynamic Welcome Eyebrow Pill -->
                <div id="splash-eyebrow" class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#DDA291]/10 border border-[#DDA291]/40 text-[#DDA291] font-mono text-xs uppercase tracking-[0.3em] mb-4 shadow-[0_0_25px_rgba(221,162,145,0.25)] opacity-0 translate-y-3 transition-all duration-700 ease-out">
                    <span class="w-2 h-2 rounded-full bg-[#DDA291] animate-pulse"></span>
                    <span id="splash-eyebrow-text">WELCOME TO ARIKA COLLABS</span>
                </div>

                <!-- 3D Drop-In Logo Emblem Container -->
                <div class="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 mb-5 flex items-center justify-center splash-logo-drop">
                    <!-- Drop Impact Shockwave Ripple -->
                    <div class="absolute inset-0 rounded-full border-2 border-[#DDA291] bg-[#DDA291]/10 pointer-events-none splash-drop-ripple"></div>

                    <!-- Outer Rotating Ring 1 with Glowing Diamonds -->
                    <div class="absolute inset-0 rounded-full border border-[#DDA291]/40 shadow-[0_0_40px_rgba(221,162,145,0.35)] animate-spin-slow">
                        <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#DDA291] shadow-[0_0_10px_#DDA291]"></div>
                        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#DDA291] shadow-[0_0_10px_#DDA291]"></div>
                    </div>

                    <!-- Inner Counter-Rotating Ring 2 -->
                    <div class="absolute inset-2 sm:inset-3 rounded-full border border-dashed border-white/25 animate-spin-reverse"></div>

                    <!-- Glass Diamond Emblem with Metallic Shine Sweep -->
                    <div class="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-tr from-[#1A1817] via-[#2A2321] to-[#3B2F2C] rounded-2xl border border-[#DDA291]/70 flex items-center justify-center shadow-[0_16px_40px_rgba(0,0,0,0.9)] overflow-hidden transform rotate-45">
                        <div class="splash-shine-sweep absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 pointer-events-none"></div>
                        <span class="transform -rotate-45 font-display-lg text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-[#F8DED1] to-[#DDA291] tracking-tighter drop-shadow-[0_2px_12px_rgba(221,162,145,0.6)]">
                            A
                        </span>
                    </div>
                </div>

                <!-- ARIKA COLLABS Letter-by-Letter Staggered Text -->
                <div id="splash-title-container" class="flex items-center justify-center gap-[0.15em] mb-4 overflow-hidden min-h-[48px]">
                    <!-- Letters inserted dynamically -->
                </div>

                <!-- DYNAMIC CENTERED HERO LOADING PHRASE & STATUS -->
                <div class="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
                    
                    <!-- Large Prominent Sequential Fading Loading Phrase with Blur-In Transition -->
                    <div id="splash-phrase-wrapper" class="relative min-h-[64px] sm:min-h-[76px] md:min-h-[84px] flex items-center justify-center w-full px-2 mb-1">
                        <div id="splash-phrase-badge" class="flex items-center justify-center gap-2.5 sm:gap-4 w-full transition-all duration-700 ease-out opacity-0 translate-y-3 blur-md">
                            <span class="hidden sm:inline-block w-8 sm:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#DDA291]/60 to-[#DDA291]"></span>
                            <span class="text-[#DDA291] text-xs sm:text-sm animate-pulse">✦</span>
                            <span id="splash-phrase-text" class="font-serif-luxury text-2xl sm:text-4xl md:text-5xl font-normal italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#F8DED1] to-[#DDA291] drop-shadow-[0_4px_30px_rgba(221,162,145,0.6)] text-center leading-tight">
                                Curating luxury
                            </span>
                            <span class="text-[#DDA291] text-xs sm:text-sm animate-pulse">✦</span>
                            <span class="hidden sm:inline-block w-8 sm:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-[#DDA291]/60 to-[#DDA291]"></span>
                        </div>
                    </div>

                    <!-- Dynamic Sub-Status Step Message -->
                    <p id="splash-status-text" class="font-syne text-xs sm:text-sm md:text-base uppercase tracking-[0.25em] text-[#DDA291]/95 font-bold transition-all duration-300 text-center mb-5 min-h-[24px] drop-shadow-[0_2px_10px_rgba(221,162,145,0.3)]">
                        Initializing High-Definition Media...
                    </p>

                    <!-- Centered Circular Gauge Percentage & Strategic Metric Card -->
                    <div id="splash-status-container" class="flex flex-col sm:flex-row items-center justify-center gap-3.5 opacity-0 transition-opacity duration-500">
                        
                        <!-- Percentage Card with Live SVG Circular Progress Ring -->
                        <div class="glass-panel px-5 py-2.5 rounded-full border border-[#DDA291]/40 flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.7)] bg-gradient-to-r from-[#1A1817]/95 via-[#2A2321]/95 to-[#1A1817]/95">
                            <!-- Mini SVG Radial Arc -->
                            <div class="relative w-8 h-8 flex items-center justify-center">
                                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path class="text-white/10" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path id="splash-svg-ring" class="text-[#DDA291] transition-all duration-150 ease-linear" stroke-dasharray="100, 100" stroke-dashoffset="100" stroke-width="3.5" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <span class="absolute text-[9px] font-mono font-bold text-[#DDA291]">✦</span>
                            </div>
                            
                            <div class="flex items-center gap-2 border-l border-[#DDA291]/30 pl-3">
                                <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-[#DDA291]/80 font-semibold">LOAD</span>
                                <span id="splash-percentage" class="font-mono text-xl sm:text-2xl font-extrabold text-white tracking-widest text-glow-rose">
                                    0%
                                </span>
                            </div>
                        </div>

                        <!-- Agency Highlight Metric Pill -->
                        <div id="splash-highlight-pill" class="glass-panel px-5 py-2.5 rounded-full border border-white/15 text-xs font-mono text-white/90 uppercase tracking-widest flex items-center gap-2.5 transition-all duration-500 bg-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                            <span id="splash-highlight-icon" class="text-[#DDA291] text-sm">💎</span>
                            <span id="splash-highlight-text" class="font-medium">500M+ Organic Creator Reach</span>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Bottom Spacer for layout balance -->
            <div class="h-2 z-10"></div>

            <!-- Gold Bottom Loading Bar -->
            <div class="absolute bottom-0 left-0 right-0 h-[4px] bg-white/10 z-20">
                <div id="splash-loading-bar" class="h-full w-0 bg-gradient-to-r from-[#DDA291] via-[#FFF] to-[#C68878] shadow-[0_0_20px_#DDA291] transition-all ease-linear"></div>
            </div>
        `;

        document.body.appendChild(splashContainer);
    }

    // Play initial chime
    playLuxuryChime(1.0);

    // Top Bar Fade-In
    const topBar = document.getElementById('splash-top-bar');
    if (topBar) {
        setTimeout(() => topBar.classList.remove('opacity-0'), 200);
    }

    // Sound Toggle button
    const soundBtn = document.getElementById('splash-sound-btn');
    const soundIcon = document.getElementById('splash-sound-icon');
    const soundLabel = document.getElementById('splash-sound-label');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            isAudioMuted = !isAudioMuted;
            if (soundIcon) soundIcon.textContent = isAudioMuted ? 'volume_off' : 'volume_up';
            if (soundLabel) soundLabel.textContent = isAudioMuted ? 'MUTED' : 'SOUND ON';
            if (!isAudioMuted) playLuxuryChime(1.2);
        });
    }

    // Eyebrow Fade-In
    const eyebrow = document.getElementById('splash-eyebrow');
    if (eyebrow) {
        setTimeout(() => {
            eyebrow.classList.remove('opacity-0', 'translate-y-3');
            eyebrow.classList.add('opacity-100', 'translate-y-0');
        }, 150);
    }

    // Populate Letter-by-Letter Reveal
    const titleContainer = document.getElementById('splash-title-container');
    const titleText = "ARIKA COLLABS";
    if (titleContainer) {
        titleContainer.innerHTML = '';
        titleText.split('').forEach((char, idx) => {
            const span = document.createElement('span');
            span.className = `font-display-lg font-bold text-2xl sm:text-4xl md:text-5xl tracking-wider transition-all duration-500 ease-out ${
                char === ' ' ? 'w-3 sm:w-4 inline-block' : 'text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F8DED1] to-[#DDA291] drop-shadow-[0_4px_25px_rgba(221,162,145,0.5)]'
            }`;
            span.style.opacity = '0';
            span.style.transform = 'translateY(35px) scale(0.85)';
            span.style.filter = 'blur(10px)';
            span.innerText = char;
            titleContainer.appendChild(span);

            // Staggered reveal
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0) scale(1)';
                span.style.filter = 'blur(0px)';
            }, 250 + idx * 45);
        });
    }

    // Status Container Fade-In
    const statusContainer = document.getElementById('splash-status-container');
    if (statusContainer) {
        setTimeout(() => {
            statusContainer.classList.remove('opacity-0');
            statusContainer.classList.add('opacity-100');
        }, 350);
    }

    // Upgraded Constellation & Sparkle Canvas Animation
    const canvas = document.getElementById('splash-particle-canvas') as HTMLCanvasElement | null;
    let animFrameId: number;

    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const width = (canvas.width = window.innerWidth);
            const height = (canvas.height = window.innerHeight);

            // Generate particles with sparkle types
            const particles = Array.from({ length: 65 }).map(() => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2.2 + 0.6,
                isStar: Math.random() > 0.7,
                color: Math.random() > 0.35 ? '#DDA291' : '#F8DED1',
                opacity: Math.random() * 0.75 + 0.2,
                speedY: -(Math.random() * 0.4 + 0.12),
                speedX: (Math.random() - 0.5) * 0.3,
            }));

            // Helper to draw 4-point star sparkle
            const drawSparkle = (cx: number, cy: number, size: number, color: string, alpha: number) => {
                ctx.save();
                ctx.translate(cx, cy);
                ctx.fillStyle = color;
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    ctx.lineTo(0, size);
                    ctx.quadraticCurveTo(0, 0, size / 4, 0);
                    ctx.rotate(Math.PI / 2);
                }
                ctx.fill();
                ctx.restore();
            };

            const renderParticles = () => {
                ctx.clearRect(0, 0, width, height);

                // Draw constellation connection lines
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 100) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = '#DDA291';
                            ctx.globalAlpha = (1 - dist / 100) * 0.15;
                            ctx.lineWidth = 0.6;
                            ctx.stroke();
                        }
                    }
                }

                // Draw individual particles & sparkles
                particles.forEach((p) => {
                    p.y += p.speedY;
                    p.x += p.speedX;

                    if (p.y < 0) p.y = height;
                    if (p.x < 0) p.x = width;
                    if (p.x > width) p.x = 0;

                    if (p.isStar) {
                        drawSparkle(p.x, p.y, p.radius * 3, p.color, p.opacity);
                    } else {
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                        ctx.fillStyle = p.color;
                        ctx.globalAlpha = p.opacity;
                        ctx.shadowColor = '#DDA291';
                        ctx.shadowBlur = 8;
                        ctx.fill();
                    }
                });

                animFrameId = requestAnimationFrame(renderParticles);
            };
            renderParticles();
        }
    }

    // Dynamic Loading Sequence State
    const loadingBar = document.getElementById('splash-loading-bar');
    const svgRing = document.getElementById('splash-svg-ring');
    const percentageEl = document.getElementById('splash-percentage');
    const statusTextEl = document.getElementById('splash-status-text');
    const eyebrowTextEl = document.getElementById('splash-eyebrow-text');
    const highlightIconEl = document.getElementById('splash-highlight-icon');
    const highlightTextEl = document.getElementById('splash-highlight-text');
    const phraseBadgeEl = document.getElementById('splash-phrase-badge');
    const phraseTextEl = document.getElementById('splash-phrase-text');
    const skipBtn = document.getElementById('splash-skip-btn');

    let currentStage = -1;
    let currentPhraseIdx = -1;
    let isSkipped = false;

    // Fading Text Phrases Sequence
    const phrases = [
        "Curating luxury",
        "Analyzing trends",
        "Engineering growth",
        "Elevating influence",
        "Unlocking potential"
    ];

    // Slogans & Milestones Arrays
    const stages = [
        {
            threshold: 0,
            eyebrow: "WELCOME TO ARIKA COLLABS",
            status: "[STEP 01/04] Initializing High-Definition Media...",
            icon: "💎",
            highlight: "500M+ Organic Creator Reach",
            chimePitch: 1.0
        },
        {
            threshold: 28,
            eyebrow: "LUXURY INFLUENCER MARKETING",
            status: "[STEP 02/04] Synchronizing Global Creator Database...",
            icon: "✨",
            highlight: "120+ High-End Brand Partnerships",
            chimePitch: 1.15
        },
        {
            threshold: 60,
            eyebrow: "CREATOR ENGINE & BRAND GROWTH",
            status: "[STEP 03/04] Calibrating Campaign Intelligence...",
            icon: "📈",
            highlight: "98% Campaign Retention Rate",
            chimePitch: 1.25
        },
        {
            threshold: 88,
            eyebrow: "PREMIER EXPERIENCE READY",
            status: "[STEP 04/04] Experience Ready • Welcome!",
            icon: "🌐",
            highlight: "Active Across 40+ Countries",
            chimePitch: 1.4
        }
    ];

    const startTime = Date.now();
    let effectiveDuration = duration;

    // Initial Phrase Blur-In & Fade-In Reveal
    if (phraseBadgeEl && phraseTextEl) {
        setTimeout(() => {
            phraseBadgeEl.classList.remove('opacity-0', 'translate-y-3', 'blur-md');
            phraseBadgeEl.classList.add('opacity-100', 'translate-y-0', 'blur-none');
            phraseBadgeEl.style.filter = 'blur(0px)';
        }, 550);
    }

    // Fast-forward Skip feature
    const triggerSkip = () => {
        if (isSkipped) return;
        isSkipped = true;
        effectiveDuration = 300; // Accelerated finish
    };

    if (skipBtn) {
        skipBtn.addEventListener('click', triggerSkip);
    }

    // Keyboard shortcut (Escape or Space to skip intro)
    const handleKeySkip = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key === ' ') {
            triggerSkip();
        }
    };
    window.addEventListener('keydown', handleKeySkip);

    const updateBar = () => {
        const elapsed = Date.now() - startTime;
        let progress = Math.min(100, Math.floor((elapsed / effectiveDuration) * 100));

        if (isSkipped) {
            progress = 100;
        }

        if (loadingBar) {
            loadingBar.style.width = `${progress}%`;
        }
        if (svgRing) {
            const dashoffset = 100 - progress;
            svgRing.setAttribute('stroke-dashoffset', `${dashoffset}`);
        }
        if (percentageEl) {
            percentageEl.textContent = `${progress}%`;
        }

        // Determine current sequential fading text phrase index based on progress percentage
        const phraseStep = Math.min(phrases.length - 1, Math.floor((progress / 100) * phrases.length));
        if (phraseStep !== currentPhraseIdx && phraseBadgeEl && phraseTextEl) {
            currentPhraseIdx = phraseStep;
            const newPhrase = phrases[phraseStep];

            // Blur-out & fade-out current phrase
            phraseBadgeEl.style.opacity = '0';
            phraseBadgeEl.style.filter = 'blur(12px)';
            phraseBadgeEl.style.transform = 'translateY(-8px) scale(0.96)';

            setTimeout(() => {
                phraseTextEl.textContent = newPhrase;
                // Elegant blur-in, fade-in & smooth scale-in for new phrase
                phraseBadgeEl.style.opacity = '1';
                phraseBadgeEl.style.filter = 'blur(0px)';
                phraseBadgeEl.style.transform = 'translateY(0) scale(1)';
            }, 250);
        }

        // Determine current stage
        let stageIdx = 0;
        for (let i = stages.length - 1; i >= 0; i--) {
            if (progress >= stages[i].threshold) {
                stageIdx = i;
                break;
            }
        }

        if (stageIdx !== currentStage) {
            currentStage = stageIdx;
            const stageData = stages[stageIdx];

            // Play ambient chime on stage milestone
            if (stageIdx > 0) {
                playLuxuryChime(stageData.chimePitch);
            }

            // Smooth transition for Eyebrow
            if (eyebrowTextEl && stageData.eyebrow) {
                eyebrowTextEl.textContent = stageData.eyebrow;
            }

            // Smooth transition for Status Step Text
            if (statusTextEl && stageData.status) {
                statusTextEl.style.opacity = '0';
                setTimeout(() => {
                    statusTextEl.textContent = stageData.status;
                    statusTextEl.style.opacity = '1';
                }, 120);
            }

            // Smooth transition for Highlight Carousel
            if (highlightIconEl && highlightTextEl && stageData.highlight) {
                const highlightPill = document.getElementById('splash-highlight-pill');
                if (highlightPill) {
                    highlightPill.style.opacity = '0';
                    highlightPill.style.transform = 'translateY(5px)';
                    setTimeout(() => {
                        highlightIconEl.textContent = stageData.icon;
                        highlightTextEl.textContent = stageData.highlight;
                        highlightPill.style.opacity = '1';
                        highlightPill.style.transform = 'translateY(0)';
                    }, 180);
                }
            }
        }

        if (progress < 100) {
            requestAnimationFrame(updateBar);
        } else {
            // Final completion chime
            playLuxuryChime(1.5);

            // Completion Sequence
            setTimeout(() => {
                window.removeEventListener('keydown', handleKeySkip);
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
            }, 350);
        }
    };

    requestAnimationFrame(updateBar);
}

// Utility function to reset session storage for testing/replay
export function resetSplashSession(): void {
    sessionStorage.removeItem('arika_splash_shown');
}

// Automatically bind replay listeners across any DOM elements
export function bindReplaySplashButtons(): void {
    const replayBtns = document.querySelectorAll('#replay-splash-btn, #mobile-replay-splash-btn, [data-replay-splash]');
    replayBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            resetSplashSession();
            initSplashScreen({ forceShow: true, duration: 3200 });
        });
    });
}
