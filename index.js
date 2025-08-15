// Initialize Mini App
WebApp.ready();

// Global state
let user = null;
let stars = 0;

// Main initialization function
function initApp() {
    // Get user data from Telegram
    user = WebApp.initDataUnsafe.user;
    
    // Load user's star balance (in a real app, you'd fetch this from your backend)
    stars = localStorage.getItem(`stars_${user.id}`) || 0;
    
    // Render UI
    renderUserInfo();
    renderPaymentButton();
    
    // Handle theme changes
    WebApp.onEvent('themeChanged', renderTheme);
    renderTheme();
}

// Render user information
function renderUserInfo() {
    const userInfoDiv = document.getElementById('user-info');
    userInfoDiv.innerHTML = `
        <img src="${user.photo_url}" alt="Profile" width="50" height="50" style="border-radius: 50%;">
        <h2>${user.first_name} ${user.last_name || ''}</h2>
        <p>Your stars: ⭐️ ${stars}</p>
    `;
}

// Render payment button
function renderPaymentButton() {
    const paymentDiv = document.getElementById('payment-section');
    paymentDiv.innerHTML = `
        <button id="buy-button" class="tg-button">Buy 20 Stars ⭐️</button>
    `;
    
    document.getElementById('buy-button').addEventListener('click', initiatePayment);
}

// Initiate payment
function initiatePayment() {
    const paymentData = {
        title: "Channel Support",
        description: "Get 20 stars for supporting the channel!",
        currency: "XTR",
        prices: [{ label: "20 Stars", amount: "20" }],
        payload: `user_${user.id}_stars_20`
    };
    
    WebApp.openInvoice(paymentData, (status) => {
        if (status === 'paid') {
            stars += 20;
            localStorage.setItem(`stars_${user.id}`, stars);
            renderUserInfo();
            WebApp.showAlert("Thank you! You've received 20 stars!");
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
WebApp.onEvent('mainButtonClicked', initApp);
document.addEventListener('DOMContentLoaded', initApp);
