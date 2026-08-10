import { initCustomCursor } from './cursor';
import { initScrollReveal } from './reveal';
import { initBackToTop } from './backToTop';
import { initNavPreview } from './navPreview';
import { initThemeToggle } from './themeToggle';
import { initPageTransitions } from './pageTransition';
import { initSplashScreen } from './splashScreen';
import { teamMembers } from '../src/config/team';

function renderTeamMembers(): void {
    const container = document.getElementById('team-members-grid');
    if (!container) return;

    container.innerHTML = teamMembers.map((member, index) => {
        const initial = member.name.charAt(0).toUpperCase();
        const delay = index * 100;

        const instagramHtml = member.socials?.instagram ? `
            <a href="${member.socials.instagram}" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#DDA291]/30 flex items-center justify-center text-[#DDA291] hover:bg-[#DDA291] hover:text-black transition-all duration-300 group/icon cursor-pointer" aria-label="${member.name} Instagram" title="${member.name} on Instagram">
                <svg class="w-3.5 h-3.5 fill-current transition-transform duration-300 group-hover/icon:scale-110" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
        ` : '';

        const linkedinHtml = member.socials?.linkedin ? `
            <a href="${member.socials.linkedin}" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#DDA291]/30 flex items-center justify-center text-[#DDA291] hover:bg-[#DDA291] hover:text-black transition-all duration-300 group/icon cursor-pointer" aria-label="${member.name} LinkedIn" title="${member.name} on LinkedIn">
                <svg class="w-3.5 h-3.5 fill-current transition-transform duration-300 group-hover/icon:scale-110" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
        ` : '';

        const emailHtml = member.socials?.email ? `
            <a href="mailto:${member.socials.email}" class="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#DDA291]/30 flex items-center justify-center text-[#DDA291] hover:bg-[#DDA291] hover:text-black transition-all duration-300 group/icon cursor-pointer" aria-label="${member.name} Email" title="Email ${member.name}">
                <svg class="w-3.5 h-3.5 fill-current transition-transform duration-300 group-hover/icon:scale-110" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </a>
        ` : '';

        return `
            <div 
                class="glass-panel p-6 sm:p-7 rounded-2xl text-center section-reveal group hover:border-primary/60 hover:shadow-[0_0_25px_rgba(221,162,145,0.22)] transition-all duration-300 flex flex-col justify-between h-full relative"
                style="transition-delay: ${delay}ms;"
            >
                <div>
                    <!-- Employee Photo Container -->
                    <div class="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-primary/40 group-hover:border-primary mb-6 shadow-[0_0_20px_rgba(221,162,145,0.2)] transition-all duration-300 bg-[#161413] flex items-center justify-center shrink-0">
                        <img 
                            src="${member.image}" 
                            alt="${member.name}" 
                            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onerror="this.style.display='none'; if(this.nextElementSibling) { this.nextElementSibling.classList.remove('hidden'); this.nextElementSibling.classList.add('flex'); }"
                        />
                        <!-- Fallback Placeholder avatar if image file is missing -->
                        <div class="hidden w-full h-full items-center justify-center bg-gradient-to-br from-[#241C1A] via-[#2F2320] to-[#14100F] text-[#DDA291] font-bold text-3xl font-outfit uppercase tracking-wider select-none shadow-inner">
                            <span>${initial}</span>
                        </div>
                    </div>

                    <!-- Name -->
                    <h3 class="font-outfit text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                        ${member.name}
                    </h3>

                    <!-- Role -->
                    <p class="text-primary font-jakarta text-xs uppercase tracking-widest font-semibold mb-3">
                        ${member.role}
                    </p>

                    <!-- Description -->
                    <p class="font-body-md text-sm text-on-surface-variant leading-relaxed mb-6">
                        ${member.description}
                    </p>
                </div>

                <!-- Social links footer -->
                <div class="flex items-center justify-center gap-3 pt-4 border-t border-white/5 mt-auto">
                    ${instagramHtml}
                    ${linkedinHtml}
                    ${emailHtml}
                </div>
            </div>
        `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initThemeToggle();
    initSplashScreen({ duration: 3000 });

    // Render team members before scroll reveal attaches observers
    renderTeamMembers();

    initCustomCursor();
    initScrollReveal();
    initBackToTop();
    initNavPreview();

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu && mobileMenuCloseBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
        });
        mobileMenuCloseBtn.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
        });
    }

    // Smooth Parallax for glow effect
    document.addEventListener('mousemove', (e) => {
        const glows = document.querySelectorAll<HTMLElement>('.luminous-glow');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        glows.forEach(glow => {
            const moveX = (x - 0.5) * 50;
            const moveY = (y - 0.5) * 50;
            glow.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // Smooth scroll for internal anchor links (e.g. #our-mission)
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href && href !== '#' && href.startsWith('#')) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 90;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Scroll progress bar
    const updateScrollEffects = () => {
        // Scroll Progress Bar
        const scrollProgress = document.getElementById('scroll-progress');
        if (scrollProgress) {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = `${scrollPercent}%`;
        }
    };

    window.addEventListener('scroll', updateScrollEffects);
    updateScrollEffects(); // Initial call
});
