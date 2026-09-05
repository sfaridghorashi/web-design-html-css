
// --- State & DOM Elements ---
const cartDrawer = document.getElementById('cart-drawer');
const cartBackdrop = document.getElementById('cart-backdrop');
const headerCartBtn = Array.from(document.querySelectorAll('header button')).find(btn => btn.querySelector('.material-symbols-outlined')?.textContent.trim() === 'shopping_bag');
const closeCartBtn = document.getElementById('close-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');

const views = {
  home: document.getElementById('home-view'),
  checkout: document.getElementById('checkout-view'),
  success: document.getElementById('success-view')
};

// --- Navigation Functions ---
function hideAllViews() {
  Object.values(views).forEach(view => {
    view.classList.add('hidden');
  });
  window.scrollTo(0,0);
}

function showHomeView() {
  hideAllViews();
  views.home.classList.remove('hidden');
}

function showCheckoutView() {
  closeCart();
  hideAllViews();
  views.checkout.classList.remove('hidden');
}

function showSuccessView() {
  hideAllViews();
  views.success.classList.remove('hidden');
  // Reset cart counter
  const badge = headerCartBtn.querySelector('span:last-child');
  if(badge) badge.textContent = '۰';
}

// --- Cart Drawer Interactions ---
function openCart() {
  cartDrawer.classList.remove('-translate-x-full');
  cartBackdrop.classList.remove('opacity-0', 'pointer-events-none');
  cartBackdrop.classList.add('opacity-100', 'pointer-events-auto');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeCart() {
  cartDrawer.classList.add('-translate-x-full');
  cartBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
  cartBackdrop.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = '';
}

// Bind cart events
if (headerCartBtn) {
  headerCartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  });
}
closeCartBtn.addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);
checkoutBtn.addEventListener('click', showCheckoutView);

// --- Add to Cart Toast ---
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-sm shadow-xl font-label-sm flex items-center gap-3 transform transition-all duration-300 translate-y-4 opacity-0';
  toast.innerHTML = `
    <span class="material-symbols-outlined text-secondary text-sm">check</span>
    ${message}
  `;
  container.appendChild(toast);
  
  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  // Update cart counter (simulated)
  const badge = headerCartBtn.querySelector('span:last-child');
  if(badge) {
    let count = parseInt(badge.textContent.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)) || 0) + 1;
    // Convert back to Persian digits
    badge.textContent = count.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
    // Pop animation
    badge.classList.add('scale-150');
    setTimeout(() => badge.classList.remove('scale-150'), 200);
  }

  // Remove after 3s
  setTimeout(() => {
    toast.classList.add('opacity-0', '-translate-y-4');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Bind Add to Cart buttons
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation(); // prevent bubbling to card link if exists
    showToast('محصول با موفقیت به سبد خرید اضافه شد');
  });
});

// --- Checkout Form ---
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate processing payment
    const btn = document.getElementById('pay-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="material-symbols-outlined animate-spin">refresh</span> در حال پردازش...`;
    btn.disabled = true;

    setTimeout(() => {
      showSuccessView();
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 1500);
  });
}

// Simple card number formatter
const cardInput = document.getElementById('card');
if(cardInput) {
  cardInput.addEventListener('input', function (e) {
    this.value = this.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  });
}
