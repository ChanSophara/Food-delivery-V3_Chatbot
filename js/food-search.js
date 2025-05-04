// food-search.js - Complete version
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

    // Get search term from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("q")?.toLowerCase();

    // Update page title
    if (searchTerm) {
        $("#search-results-title").text(`Search Results for "${searchTerm}"`);
        $("#search-results-description").text(`Found ${foodData.length} matching items`);
    }

    // Filter and display results
    const results = searchTerm ? 
        foodData.filter(food => 
            food.name.toLowerCase().includes(searchTerm) || 
            food.desc.toLowerCase().includes(searchTerm)
        ) : foodData;
    
    renderResults(results);

    function renderResults(foods) {
        const $container = $("#search-results-container");
        $container.empty();

        if (foods.length === 0) {
            $container.html('<p class="no-results">No foods match your search.</p>');
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