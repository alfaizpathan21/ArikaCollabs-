/**
 * ARIKA COLLABS Notification & Modal System
 * Provides luxury toast notifications and modal dialogs for EmailJS form submissions.
 */

export interface ToastOptions {
  title?: string;
  message: string;
  duration?: number; // ms
}

export interface ModalOptions {
  visitorName: string;
  visitorEmail: string;
  recipientEmail?: string;
  service?: string;
  company?: string;
  message?: string;
  onClose?: () => void;
}

/**
 * Displays a luxury floating toast notification
 */
export function showSuccessToast(options: ToastOptions): void {
  const {
    title = 'Inquiry Sent Successfully!',
    message,
    duration = 5000,
  } = options;

  // Remove existing toast container or toast if present
  let toastContainer = document.getElementById('arika-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'arika-toast-container';
    toastContainer.className = 'fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-[calc(100vw-3rem)] pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `
    pointer-events-auto flex items-start gap-3 p-4 rounded-xl
    bg-[#181615]/95 backdrop-blur-md border border-[#DDA291]/50
    text-white shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(221,162,145,0.2)]
    transform transition-all duration-300 translate-y-[-10px] opacity-0 scale-95
  `.trim().replace(/\s+/g, ' ');

  toast.innerHTML = `
    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#DDA291]/20 border border-[#DDA291] flex items-center justify-center text-[#DDA291]">
      <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">check_circle</span>
    </div>
    <div class="flex-1 min-w-0 pr-1">
      <h5 class="text-xs font-bold uppercase tracking-wider text-[#DDA291] mb-0.5">${escapeHtml(title)}</h5>
      <p class="text-xs text-gray-200 leading-snug">${escapeHtml(message)}</p>
    </div>
    <button type="button" class="close-btn text-gray-400 hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-md" aria-label="Close notification">
      <span class="material-symbols-outlined text-sm">close</span>
    </button>
  `;

  toastContainer.appendChild(toast);

  // Trigger entry animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-[-10px]', 'opacity-0', 'scale-95');
    toast.classList.add('translate-y-0', 'opacity-100', 'scale-100');
  });

  const closeToast = () => {
    toast.classList.remove('translate-y-0', 'opacity-100', 'scale-100');
    toast.classList.add('translate-y-[-10px]', 'opacity-0', 'scale-95');
    setTimeout(() => {
      toast.remove();
      if (toastContainer && toastContainer.childElementCount === 0) {
        toastContainer.remove();
      }
    }, 300);
  };

  const closeBtn = toast.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeToast);
  }

  // Auto dismiss
  if (duration > 0) {
    setTimeout(closeToast, duration);
  }
}

/**
 * Displays an executive success modal dialog with complete submission summary
 */
export function showSuccessModal(options: ModalOptions): void {
  const {
    visitorName,
    visitorEmail,
    recipientEmail = 'alfaiz.pathan@arikacollabs.com',
    service = 'Campaign Inquiry',
    company = '',
    message = '',
    onClose,
  } = options;

  // Remove existing modal if open
  const existingModal = document.getElementById('arika-success-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'arika-success-modal';
  modalOverlay.className = 'fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md opacity-0 transition-opacity duration-300';

  modalOverlay.innerHTML = `
    <div class="relative w-full max-w-md bg-[#181615] border border-[#DDA291]/40 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(221,162,145,0.15)] transform scale-90 opacity-0 transition-all duration-300 text-left">
      <!-- Top Glow Accent -->
      <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-12 bg-[#DDA291]/20 blur-xl rounded-full pointer-events-none"></div>

      <!-- Close Button -->
      <button type="button" class="modal-close-btn absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Close modal">
        <span class="material-symbols-outlined text-xl">close</span>
      </button>

      <!-- Icon & Header -->
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#DDA291]/15 border border-[#DDA291]/60 text-[#DDA291] mb-4 shadow-[0_0_20px_rgba(221,162,145,0.3)]">
          <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">verified</span>
        </div>
        <h3 class="text-2xl font-bold text-white tracking-wide mb-1 font-display">Inquiry Transmitted</h3>
        <p class="text-xs text-[#DDA291] uppercase tracking-widest font-mono">ARIKA COLLABS Executive Desk</p>
      </div>

      <!-- Message text -->
      <p class="text-sm text-gray-300 leading-relaxed mb-5 text-center">
        Thank you, <strong class="text-white">${escapeHtml(visitorName)}</strong>! Your campaign inquiry has been received and routed directly to our lead coordinator.
      </p>

      <!-- Details Summary Card -->
      <div class="p-4 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-gray-300 space-y-2 mb-6">
        <div class="flex justify-between items-center border-b border-white/5 pb-2">
          <span class="text-[#DDA291]">Target Recipient:</span>
          <span class="text-white font-bold">${escapeHtml(recipientEmail)}</span>
        </div>
        <div class="flex justify-between items-center border-b border-white/5 pb-2">
          <span class="text-[#DDA291]">Your Email:</span>
          <span class="text-white truncate max-w-[180px]">${escapeHtml(visitorEmail)}</span>
        </div>
        <div class="flex justify-between items-center border-b border-white/5 pb-2">
          <span class="text-[#DDA291]">Inquiry Service:</span>
          <span class="text-white truncate max-w-[180px]">${escapeHtml(service)}</span>
        </div>
        ${company ? `
        <div class="flex justify-between items-center border-b border-white/5 pb-2">
          <span class="text-[#DDA291]">Company:</span>
          <span class="text-white truncate max-w-[180px]">${escapeHtml(company)}</span>
        </div>
        ` : ''}
        ${message ? `
        <div class="pt-1">
          <span class="text-[#DDA291] block mb-1">Message Preview:</span>
          <p class="text-gray-400 italic line-clamp-2 leading-relaxed bg-white/5 p-2 rounded">${escapeHtml(message)}</p>
        </div>
        ` : ''}
      </div>

      <!-- Footer CTA button -->
      <div class="flex flex-col gap-2">
        <button type="button" class="modal-confirm-btn w-full py-3.5 px-6 rounded-xl bg-[#DDA291] hover:bg-[#c98e7e] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#DDA291]/20 active:scale-[0.98]">
          DONE & RETURN TO SITE
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  const modalContent = modalOverlay.querySelector('div');

  // Trigger animations
  requestAnimationFrame(() => {
    modalOverlay.classList.remove('opacity-0');
    modalOverlay.classList.add('opacity-100');
    if (modalContent) {
      modalContent.classList.remove('scale-90', 'opacity-0');
      modalContent.classList.add('scale-100', 'opacity-100');
    }
  });

  const closeModal = () => {
    modalOverlay.classList.remove('opacity-100');
    modalOverlay.classList.add('opacity-0');
    if (modalContent) {
      modalContent.classList.remove('scale-100', 'opacity-100');
      modalContent.classList.add('scale-90', 'opacity-0');
    }
    setTimeout(() => {
      modalOverlay.remove();
      if (onClose) onClose();
    }, 300);
  };

  // Event Listeners
  const closeBtn = modalOverlay.querySelector('.modal-close-btn');
  const confirmBtn = modalOverlay.querySelector('.modal-confirm-btn');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (confirmBtn) confirmBtn.addEventListener('click', closeModal);

  // Close on backdrop click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Close on Escape key
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleKeyDown);
    }
  };
  document.addEventListener('keydown', handleKeyDown);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
