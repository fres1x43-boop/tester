// Initialize Mini App
WebApp.ready();

// Global state
let user = null;
let stars = 0;

// Main initialization function
function initApp() {
    // Get user data from Telegram
    user = WebApp.initDataUnsafe.user || {
        first_name: "Anonymous",
        id: 0,
        photo_url: "https://via.placeholder.com/80"
    };
    
    // Load user's star balance (in a real app, you'd fetch this from your backend)
    stars = localStorage.getItem(`stars_${user.id}`) || 0;
    
    // Render UI
    renderUserInfo();
    setupPaymentButton();
    
    // Handle theme changes
    WebApp.onEvent('themeChanged', renderTheme);
    renderTheme();
    
    // Expand the Mini App to fill available space
    WebApp.expand();
}

// Render user information
function renderUserInfo() {
    document.getElementById('user-avatar').src = user.photo_url || 'https://via.placeholder.com/80';
    document.getElementById('username').textContent = 
        `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`;
    document.getElementById('user-id').textContent = `ID: ${user.id}`;
    document.getElementById('stars-count').textContent = stars;
}

// Setup payment button
function setupPaymentButton() {
    document.getElementById('buy-button').addEventListener('click', initiatePayment);
}

// Initiate payment
function initiatePayment() {
    const paymentData = {
        title: "20 Stars Purchase",
        description: "Get 20 stars to support our channel!",
        currency: "XTR",
        prices: [{ label: "20 Stars", amount: "20" }],
        payload: `user_${user.id}_stars_20_${Date.now()}`
    };
    
    WebApp.openInvoice(paymentData, (status) => {
        if (status === 'paid') {
            stars = parseInt(stars) + 20;
            localStorage.setItem(`stars_${user.id}`, stars);
            renderUserInfo();
            WebApp.showAlert("Thank you! You've received 20 stars! ⭐");
            
            // Haptic feedback
            if (WebApp.HapticFeedback) {
                WebApp.HapticFeedback.impactOccurred('heavy');
            }
        } else if (status === 'failed') {
            WebApp.showAlert("Payment failed. Please try again.");
        } else if (status === 'cancelled') {
            WebApp.showAlert("Payment was cancelled.");
        }
    });
}

// Handle theme changes
function renderTheme() {
    document.body.className = WebApp.colorScheme;
}

// Initialize the app when ready
document.addEventListener('DOMContentLoaded', initApp);
