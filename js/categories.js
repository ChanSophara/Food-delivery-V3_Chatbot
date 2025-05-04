// categories.js - Complete version
$(function () {
  // Handle category clicks
  $(".category-card").on("click", function (e) {
      e.preventDefault();
      const category = $(this).attr("href").split("=")[1];
      window.location.href = `category-foods.html?category=${category}`;
  });
});