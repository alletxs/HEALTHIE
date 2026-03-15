// ==============================================
//  HEALTHIE · app.js  (Phase 3 — with Auth)
// ==============================================

const API = 'http://127.0.0.1:5000/api';

// ── NAVBAR SCROLL EFFECT ──────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ── MOBILE HAMBURGER MENU ─────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () =>
        mobileMenu.classList.toggle('open')
    );
    mobileMenu.querySelectorAll('a').forEach(link =>
        link.addEventListener('click', () =>
            mobileMenu.classList.remove('open')
        )
    );
}

// ── SCROLL REVEAL ─────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
    '.stats-strip, .feature-card, .step-card, .section-header, .cta-container'
).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ── AUTH MODAL ────────────────────────────────
const authModal    = document.getElementById('auth-modal');
const authCard     = document.getElementById('auth-card');
const modalClose   = document.getElementById('modal-close-btn');
const authSubmit   = document.getElementById('auth-submit-btn');
const authMessage  = document.getElementById('auth-message');
const togglePwBtn  = document.getElementById('toggle-password');
const eyeIcon      = document.getElementById('eye-icon');

let currentAuthMode = 'login';   // tracks whether we're in login or signup mode

// Open modal when any "Sign In" or "Get Started" button is clicked
document.querySelectorAll('[href="dashboard.html"]').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();     // stop the link from navigating away
        openModal();
    });
});

function openModal() {
    authModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';   // prevent page scrolling behind modal
    setTimeout(() => document.getElementById('auth-username').focus(), 100);
}

function closeModal() {
    authModal.classList.add('hidden');
    document.body.style.overflow = '';
    clearAuthMessage();
}

// Close when clicking the X button
if (modalClose) modalClose.addEventListener('click', closeModal);

// Close when clicking the dark overlay (outside the card)
if (authModal) {
    authModal.addEventListener('click', function (e) {
        if (e.target === authModal) closeModal();
    });
}

// Close with Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});

// ── TAB SWITCHING (Login ↔ Sign Up) ──────────
function switchAuthTab(mode) {
    currentAuthMode = mode;

    // Update tab button styles
    document.getElementById('tab-login').classList.toggle('active',  mode === 'login');
    document.getElementById('tab-signup').classList.toggle('active', mode === 'signup');

    // Update modal text
    if (mode === 'login') {
        document.getElementById('modal-title').textContent    = 'Welcome back';
        document.getElementById('modal-subtitle').textContent = 'Sign in to your Healthie account';
        document.getElementById('auth-submit-btn').textContent = 'Sign In →';
        document.getElementById('auth-switch-text').textContent = "Don't have an account?";
        document.getElementById('auth-switch-btn').textContent  = 'Create one free';
        document.getElementById('auth-switch-btn').onclick = () => switchAuthTab('signup');
    } else {
        document.getElementById('modal-title').textContent    = 'Create account';
        document.getElementById('modal-subtitle').textContent = 'Start tracking your health for free';
        document.getElementById('auth-submit-btn').textContent = 'Create Account →';
        document.getElementById('auth-switch-text').textContent = 'Already have an account?';
        document.getElementById('auth-switch-btn').textContent  = 'Sign in';
        document.getElementById('auth-switch-btn').onclick = () => switchAuthTab('login');
    }

    clearAuthMessage();
    document.getElementById('auth-password').value = '';
}

// ── PASSWORD VISIBILITY TOGGLE ────────────────
if (togglePwBtn) {
    togglePwBtn.addEventListener('click', function () {
        const pwInput = document.getElementById('auth-password');
        const isText  = pwInput.type === 'text';
        pwInput.type  = isText ? 'password' : 'text';
        eyeIcon.className = isText ? 'ri-eye-line' : 'ri-eye-off-line';
    });
}

// ── SUBMIT AUTH FORM ──────────────────────────
if (authSubmit) {
    authSubmit.addEventListener('click', handleAuth);
}

// Also allow pressing Enter in the password field
document.getElementById('auth-password')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') handleAuth();
});

async function handleAuth() {
    const username = document.getElementById('auth-username').value.trim();
    const password = document.getElementById('auth-password').value.trim();

    // Basic validation
    if (!username || !password) {
        showAuthMessage('Please fill in both fields.', 'error');
        return;
    }

    // Disable button and show loading state
    authSubmit.disabled     = true;
    authSubmit.textContent  = 'Please wait...';

    try {
        const endpoint = currentAuthMode === 'login' ? '/login' : '/signup';

        const response = await fetch(API + endpoint, {
            method:      'POST',
            headers:     { 'Content-Type': 'application/json' },
            credentials: 'include',   // sends cookies for session
            body:        JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            if (currentAuthMode === 'signup') {
                // After signup, switch to login tab and show success
                showAuthMessage('Account created! Now sign in.', 'success');
                switchAuthTab('login');
            } else {
                // After login, save username and redirect to dashboard
                showAuthMessage('Login successful! Redirecting...', 'success');
                localStorage.setItem('healthie_user', data.username);
                localStorage.setItem('healthie_user_id', data.user_id);
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 800);
            }
        } else {
            // Show the error message from the server
            showAuthMessage(data.error || 'Something went wrong.', 'error');
        }

    } catch (err) {
        // Network error — usually means Flask isn't running
        showAuthMessage(
            'Cannot connect to server. Make sure Flask is running on port 5000.',
            'error'
        );
        console.error('Auth error:', err);
    } finally {
        // Re-enable the button
        authSubmit.disabled    = false;
        authSubmit.textContent = currentAuthMode === 'login' ? 'Sign In →' : 'Create Account →';
    }
}

// ── AUTH MESSAGE HELPERS ──────────────────────
function showAuthMessage(msg, type) {
    authMessage.textContent = msg;
    authMessage.className   = `auth-message ${type}`;   // adds 'error' or 'success' class
    authMessage.classList.remove('hidden');
}

function clearAuthMessage() {
    authMessage.classList.add('hidden');
    authMessage.textContent = '';
    authMessage.className   = 'auth-message hidden';
}