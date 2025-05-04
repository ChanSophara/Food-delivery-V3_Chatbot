// addToCart.js
$(function () {
    // Initialize cart UI
    updateCartUI();
    
    // Listen for cart updates
    document.addEventListener('cartUpdated', updateCartUI);
    $(document).on('cartUpdated', updateCartUI);
    
    // Add to Cart Functionality
    $(document).on("submit", ".food-form", function (event) {
        event.preventDefault();
        
        const $form = $(this);
        const foodCard = $form.closest('.food-card');
        const foodName = foodCard.find('.food-title').text().trim();
        const foodPriceText = foodCard.find('.food-price').text().replace("$", "").trim();
        const foodPrice = parseFloat(foodPriceText);
        const foodQty = parseInt($form.find(".food-qty").val());
        const foodImg = foodCard.find('.food-img').attr('src');
        
        if (isNaN(foodPrice)) {
            console.error("Invalid price for food item:", foodName);
            return;
        }
        
        // Validate quantity
        const validatedQty = isNaN(foodQty) || foodQty < 1 ? 1 : foodQty;
        
        Cart.addItem({
            name: foodName,
            price: foodPrice,
            qty: validatedQty,
            img: foodImg
        });
        
        showNotification(`${foodName} added to cart!`);
    });
    
    // Delete Item from Cart
    $(document).on("click", ".btn-delete", function (event) {
        event.preventDefault();
        const foodName = $(this).closest("tr").find("td:nth-child(2)").text().trim();
        Cart.removeItem(foodName);
        showNotification(`${foodName} removed from cart`);
    });
    
    // Update Cart UI
    function updateCartUI() {
        renderCart();
        updateCartBadge();
    }
    
    // Render Cart Items
    function renderCart() {
        const $cartTable = $(".cart-table tbody");
        $cartTable.empty();
        
        const cart = Cart.getCart();
        const total = Cart.getTotalPrice();
        
        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            
            const cartRow = `
                <tr>
                    <td><img src="${item.img}" alt="${item.name}" class="cart-item-img"></td>
                    <td class="item-name">${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>${item.qty}</td>
                    <td>$${itemTotal.toFixed(2)}</td>
                    <td><a href="#" class="btn-delete"><i class="fas fa-trash-alt"></i></a></td>
                </tr>
            `;
            $cartTable.append(cartRow);
        });
        
        // Update grand total
        $(".cart-table tfoot td.bold").text(`$${total.toFixed(2)}`);
    }
    
    // Update Cart Badge
    function updateCartBadge() {
        $(".badge").text(Cart.getTotalItems());
    }
    
    // Show Notification
    function showNotification(message) {
        const $notification = $('<div class="cart-notification">').text(message);
        $('body').append($notification);
        
        $notification.fadeIn().delay(2000).fadeOut(function() {
            $(this).remove();
        });
    }
});