document.addEventListener("DOMContentLoaded", function () {
    // ========== SIGNUP FUNCTION ==========
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const fullName = document.getElementById("full-name").value.trim();
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const gender = document.getElementById("gender").value;
            const password = document.getElementById("password").value;
            const existingUser = JSON.parse(localStorage.getItem("user"));
if (existingUser && existingUser.username === username) {
    alert("Username already exists!");
    return;
}
           let users = JSON.parse(localStorage.getItem("users")) || [];
if (users.find(u => u.username === username)) {
    alert("Username already exists!");
    return;
}
users.push({ fullName, username, email, gender, password });
localStorage.setItem("users", JSON.stringify(users));
            alert("Sign Up Successful!");
            window.location.href = "login1.html"; // Redirect to login page after signup
        });
    }

    // ========== LOGIN FUNCTION ==========
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("login-username").value.trim();
        const password = document.getElementById("login-password").value;
        const captchaInput = document.getElementById("captcha-input")?.value.trim();
        const captchaText = document.getElementById("captcha-text")?.textContent.trim();
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const matchedUser = users.find(u => u.username === username && u.password === password);

        if (!captchaInput || captchaInput !== captchaText) {
            alert("Captcha does not match!");
            return;
        }

        if (matchedUser) {
            alert("Login Successful! Welcome to TripTrekker!");
            window.location.href = "home.html";
        } else {
            alert("Invalid Username or Password!");
        }
    });
}

    // ========== CAPTCHA GENERATION ==========
    function generateCaptcha() {
        const captchaElement = document.getElementById("captcha-text");
        if (captchaElement) {
            captchaElement.textContent = Math.random().toString(36).substring(2, 8).toUpperCase();
        }
    }

    const captchaRefreshBtn = document.getElementById("captcha-refresh");
    if (captchaRefreshBtn) {
        captchaRefreshBtn.addEventListener("click", generateCaptcha);
        generateCaptcha(); // Generate CAPTCHA initially
    }

    // ========== PASSWORD TOGGLE ==========
    const togglePassword = document.getElementById("toggle-password");
    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            const passwordInput = document.getElementById("password");
            if (passwordInput) {
                passwordInput.type = passwordInput.type === "password" ? "text" : "password";
            }
        });
    }

    // ========== LOGIN PASSWORD TOGGLE ==========
    const toggleLoginPassword = document.getElementById("toggle-login-password");
    if (toggleLoginPassword) {
        toggleLoginPassword.addEventListener("click", function () {
            const loginPasswordInput = document.getElementById("login-password");
            if (loginPasswordInput) {
                loginPasswordInput.type = loginPasswordInput.type === "password" ? "text" : "password";
            }
        });
    }
});