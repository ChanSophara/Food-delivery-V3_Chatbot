$(function () {
    // Initialize order page
    function initializeOrderPage() {
        renderOrderCart();
        updateCartBadge();
        setupEventListeners();
    }

    function setupEventListeners() {
        $(document).on('cartUpdated', function() {
            renderOrderCart();
            updateCartBadge();
        });

        $(document).on("click", ".btn-delete", function (event) {
            event.preventDefault();
            const $row = $(this).closest("tr");
            const foodName = $row.find("td:nth-child(3)").text().trim();
            Cart.removeItem(foodName);
            showNotification(`${foodName} removed from order`, "warning");
        });

        $("#order-form").on("submit", function (event) {
            event.preventDefault();
            handleOrderSubmission(this);
        });
    }

    function renderOrderCart() {
        const $orderTable = $(".order-table tbody");
        $orderTable.empty();
        
        const cart = Cart.getCart();
        const total = Cart.getTotalPrice();

        if (cart.length === 0) {
            $orderTable.append(`
                <tr>
                    <td colspan="7" class="text-center">Your cart is empty</td>
                </tr>
            `);
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.qty;
                $orderTable.append(`
                    <tr>
                        <td>${index + 1}</td>
                        <td><img src="${item.img}" alt="${item.name}" class="order-img"></td>
                        <td>${item.name}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>${item.qty}</td>
                        <td>$${itemTotal.toFixed(2)}</td>
                        <td><a href="#" class="btn-delete"><i class="fas fa-trash-alt"></i></a></td>
                    </tr>
                `);
            });
        }

        $(".order-table tfoot td.bold").text(`$${total.toFixed(2)}`);
    }

    // Save to local storage
    function saveOrderToLocalStorage(order) {
        let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
        orderHistory.push(order);
        localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
    }

    async function handleOrderSubmission(form) {
        const userData = {
            fullName: $("#full-name").val().trim(),
            phone: $("#phone").val().trim(),
            email: $("#email").val().trim(),
            address: $("#address").val().trim(),
            notes: $("#notes").val().trim()
        };

        if (!userData.fullName || !userData.phone || !userData.email || !userData.address) {
            showNotification("Please fill all required fields", "error");
            return;
        }

        const order = {
            date: new Date().toISOString(),
            userInfo: userData,
            orderItems: Cart.getCart(),
            total: Cart.getTotalPrice(),
            status: "pending"
        };

        // 1. Save to local storage
        
        OrderHistory.saveOrder(order); // Your existing cart history function
        
        // 2. Send to backend
        try {
            const response = await fetch('http://localhost:5001/saveOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order)
            });

            const data = await response.json();

            if (data.status === 'success') {
                Cart.clearCart();
                renderOrderCart();
                updateCartBadge();
                $("#order-confirmation").fadeIn();
                form.reset();
                
                setTimeout(() => {
                    $("#order-confirmation").fadeOut();
                }, 5000);
            } else {
                showNotification("Order saved locally but server rejected it", "warning");
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification("Server unavailable. Order saved locally.", "warning");
        }
    }

    function updateCartBadge() {
        $(".badge").text(Cart.getTotalItems());
    }

    function showNotification(message, type = "success") {
        const $notification = $(`<div class="notification notification-${type}">${message}</div>`);
        $("body").append($notification);
        $notification.fadeIn().delay(2000).fadeOut(function() {
            $(this).remove();
        });
    }

    initializeOrderPage();
});