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
    $("#register-form").on("submit", async function (e) {
        e.preventDefault();
        
        // Get form values
        const name = $("#register-name").val().trim();
        const email = $("#register-email").val().trim();
        const phone = $("#register-phone").val().trim();
        const password = $("#register-password").val();
        const confirmPassword = $("#register-confirm").val();
        const dob = $("#register-dob").val();
        const joinDate = $("#register-join").val();
        
        // Validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            showToast("Please fill all required fields", "error");
            return;
        }
        
        if (!isValidEmail(email)) {
            showToast("Please enter a valid email", "error");
            return;
        }
        
        if (password.length < 5) {
            showToast("Password must be at least 5 characters", "error");
            return;
        }
        
        if (password !== confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }

        // Prepare registration data
        const registerData = {
            full_name: name,
            email: email,
            phone: phone,
            password: password,
            date_of_birth: dob,
            join_date: joinDate
        };

        // Send to backend
        try {
            const response = await fetch('http://localhost:5001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                // Show success message
                $("#register-confirmation").fadeIn();
                $("#register-form")[0].reset();

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 3000);
            } else {
                showToast(data.error || "Registration failed", "error");
            }
        } catch (error) {
            console.error('Error:', error);
            showToast("Server unavailable. Please try again later.", "error");
        }
    });
});