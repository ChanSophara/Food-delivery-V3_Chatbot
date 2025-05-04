$(function () {
    // Email validation
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Toast notification
    function showToast(message, type) {
        const toast = $(`<div class="toast toast-${type}">${message}</div>`);
        $("body").append(toast);
        toast.fadeIn().delay(3000).fadeOut(() => toast.remove());
    }

    // Handle form submission
    $("#login-form").on("submit", async function (e) {
        e.preventDefault();
        
        // Get form values
        const email = $("#login-email").val().trim();
        const password = $("#login-password").val();
        
        // Validation
        if (!email || !password) {
            showToast("Please fill all fields", "error");
            return;
        }
        
        if (!isValidEmail(email)) {
            showToast("Please enter a valid email", "error");
            return;
        }

        // Prepare login data
        const loginData = {
            email,
            password
        };

        // Send to backend for authentication
        try {
            const response = await fetch('http://localhost:5001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                // Save user data to localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirect to index.html immediately
                window.location.href = "index.html";
            } else {
                showToast(data.error || "Invalid email or password", "error");
            }
        } catch (error) {
            console.error('Error:', error);
            showToast("Server unavailable. Please try again later.", "error");
        }
    });
});