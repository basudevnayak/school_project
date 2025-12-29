// Cart Management
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// Toggle Side Menu
function toggleMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    sideMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
}

// Screen Navigation
function goToScreen(screenNumber) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    
    // Show selected screen
    document.getElementById('screen' + screenNumber).style.display = 'block';
    
    // Update cart display if going to checkout
    if (screenNumber === 4) {
        updateCheckoutDisplay();
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Auth Tab Switching
function switchAuthTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    
    if (tab === 'signin') {
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
        signinForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        tabs[1].classList.add('active');
        tabs[0].classList.remove('active');
        signupForm.style.display = 'block';
        signinForm.style.display = 'none';
    }
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    alert('Login successful! Welcome back!');
    goToScreen(2);
    return false;
}

// Handle Signup
function handleSignup(event) {
    event.preventDefault();
    alert('Account created successfully!');
    goToScreen(2);
    return false;
}

// Add to Cart
function addToCart(itemName, itemPrice) {
    // Check if item already in cart
    const existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: itemName,
            price: itemPrice,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    
    // Show confirmation
    showToast(`${itemName} added to cart`);
}

// Remove from Cart
function removeFromCart(itemName) {
    const itemIndex = cart.findIndex(item => item.name === itemName);
    
    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
        } else {
            cart.splice(itemIndex, 1);
        }
    }
    
    updateCartDisplay();
    updateCheckoutDisplay();
}

// Update Cart Display
function updateCartDisplay() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    const cartCountEl = document.getElementById('cartCount');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartFloating = document.getElementById('cartFloating');
    
    if (cartCountEl) cartCountEl.textContent = cartCount;
    if (cartTotalEl) cartTotalEl.textContent = `$${cartTotal.toFixed(2)}`;
    
    if (cartFloating) {
        if (cartCount > 0) {
            cartFloating.style.display = 'flex';
        } else {
            cartFloating.style.display = 'none';
        }
    }
}

// Update Checkout Display
function updateCheckoutDisplay() {
    const checkoutItems = document.getElementById('checkoutItems');
    
    if (!checkoutItems) return;
    
    checkoutItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'checkout-item';
        itemEl.innerHTML = `
            <div class="checkout-item-info">
                <h4 class="checkout-item-name">${item.name}</h4>
                <p class="checkout-item-price">$${item.price.toFixed(2)} × ${item.quantity}</p>
            </div>
            <div class="checkout-item-actions">
                <span class="checkout-item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-item-btn" onclick="removeFromCart('${item.name}')">✕</button>
            </div>
        `;
        checkoutItems.appendChild(itemEl);
    });
    
    // Update summary
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = 2.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('trackingTotal').textContent = `$${total.toFixed(2)}`;
}

// Place Order
function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Show success screen
    goToScreen(6);
    
    // Clear cart
    setTimeout(() => {
        cart = [];
        updateCartDisplay();
    }, 1000);
}

// Show Toast Notification
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    // Add to body
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    // Category tabs functionality
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Menu category tabs
    const menuCategories = document.querySelectorAll('.menu-category');
    menuCategories.forEach(category => {
        category.addEventListener('click', function() {
            menuCategories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Payment options
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('input[type="radio"]').checked = true;
        });
    });
    
    // Initialize cart display
    updateCartDisplay();
});
