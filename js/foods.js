// foods.js - Complete version
$(function () {
  // Sample data - replace with API call
  const foodData = [
      { id: 1, name: "បាយស្រូប", category: "food", price: 1.25, desc: "បាយសាច់ជ្រូកពងទាចៀន", image: "img/food/f1.jpg" },
      { id: 2, name: "បាយម្រះព្រូវ", category: "food", price: 1.50, desc: "បាយឆារម្រះព្រូវ with ពងទាចៀន", image: "img/food/f2.jpg" },
      { id: 3, name: "ហ្វឺ", category: "soup", price: 2.50, desc: "ហ្វឺប្រហិតសាច់គោ", image: "img/food/s1.jpg" },
      { id: 4, name: "គុយទាវ", category: "soup", price: 2.50, desc: "គុយទាវប្រហិតសាច់គោ", image: "img/food/s2.jpg" },
      { id: 5, name: "កាហ្វេ", category: "drink", price: 1.00, desc: "កាហ្វេទឹកដោះគោទឹកកក(សាកថ្មបាន)", image: "img/food/d1.jpg" },
      { id: 6, name: "Milk Tea", category: "drink", price: 2.00, desc: "តែចិន Olong Tea with sweat steam milk and Boba", image: "img/food/d2.jpg" }
  ];

  // Initialize full menu
  renderFoods(foodData);

  // Handle search form submission
  $("#search-form").on("submit", function (e) {
      e.preventDefault();
      const query = $("#search-input").val().trim().toLowerCase();
      if (query) {
          window.location.href = `food-search.html?q=${encodeURIComponent(query)}`;
      }
  });

  
});