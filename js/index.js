// index.js - Complete version
$(function () {
    // Handle search form submission
    $("#search-form").on("submit", function (e) {
        e.preventDefault();
        const query = $("#search-input").val().trim();
        if (query) {
            window.location.href = `food-search.html?q=${encodeURIComponent(query)}`;
        }
    });

    // Handle category clicks
    $(".category-card").on("click", function (e) {
        e.preventDefault();
        const category = $(this).attr("href").split("=")[1];
        window.location.href = `category-foods.html?category=${category}`;
    });
});