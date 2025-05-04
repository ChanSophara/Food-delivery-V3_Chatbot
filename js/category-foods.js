// category-foods.js - Complete version
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

    // Get category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    
    // Set page title
    const categoryTitles = {
        food: "Main Dishes",
        soup: "Soups",
        drink: "Drinks"
    };
    
    if (category && categoryTitles[category]) {
        $("#category-title").text(categoryTitles[category]);
        $("#category-description").text(`Browse our ${categoryTitles[category].toLowerCase()}`);
    }

    // Filter and display foods
    const filteredFoods = category ? foodData.filter(food => food.category === category) : foodData;
    renderFoods(filteredFoods);

    function renderFoods(foods) {
        const $container = $("#category-foods-container");
        $container.empty();

        if (foods.length === 0) {
            $container.html('<p class="no-results">No foods found in this category.</p>');
            return;
        }

        foods.forEach(food => {
            $container.append(`
                <div class="food-card">
                    <div class="food-img-container">
                        <img src="${food.image}" alt="${food.name}" class="food-img">
                    </div>
                    <div class="food-body">
                        <h3 class="food-title">${food.name}</h3>
                        <p class="food-price">$${food.price.toFixed(2)}</p>
                        <p class="food-desc">${food.desc}</p>
                        <form class="food-form">
                            <input type="number" class="food-qty" value="1" min="1">
                            <button type="submit" class="btn btn-primary btn-sm">Add to Cart</button>
                        </form>
                    </div>
                </div>
            `);
        });
    }
});