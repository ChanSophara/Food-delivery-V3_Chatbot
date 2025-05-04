$(function () {
    // Handle logout confirmation
    $("#confirm-logout").on("click", function() {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        
        // Redirect to about.html immediately
        window.location.href = "about.html";
    });
});