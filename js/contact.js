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

    // Save to local storage
    function saveContactToLocalStorage(contactData) {
        let contacts = JSON.parse(localStorage.getItem("contactHistory")) || [];
        contacts.push({
            date: new Date().toISOString(),
            contact: contactData
        });
        localStorage.setItem("contactHistory", JSON.stringify(contacts));
    }

    // Handle form submission
    $("#contact-form").on("submit", async function (e) {
        e.preventDefault();
        
        // Form validation
        const name = $("#contact-name").val().trim();
        const email = $("#contact-email").val().trim();
        const subject = $("#contact-subject").val().trim();
        const message = $("#contact-message").val().trim();
        
        if (!name || !email || !subject || !message) {
            showToast("Please fill all required fields", "error");
            return;
        }
        
        if (!isValidEmail(email)) {
            showToast("Please enter a valid email address", "error");
            return;
        }

        // Prepare contact data
        const contactData = {
            name,
            email,
            phone: $("#contact-phone").val().trim(),
            subject,
            message
        };

        // 1. Save to local storage
        saveContactToLocalStorage(contactData);
        
        // 2. Send to backend
        try {
            const response = await fetch('http://localhost:5001/saveContact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...contactData,
                    date: new Date().toISOString()
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                // Show success message
                $("#contact-confirmation").html(`
                    <i class="fas fa-check-circle fa-2x mb-20"></i>
                    <h3>Thank you for contacting us!</h3>
                    <p>We've received your message and will get back to you shortly.</p>
                `).fadeIn();

                // Reset form
                this.reset();

                // Hide message after 5 seconds
                setTimeout(() => {
                    $("#contact-confirmation").fadeOut();
                }, 5000);
            } else {
                showToast("Failed to send message to server. Data saved locally.", "warning");
            }
        } catch (error) {
            console.error('Error:', error);
            showToast("Server unavailable. Data saved locally.", "warning");
        }
    });
});