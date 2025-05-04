$(function () {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        // Show unauthorized message
        $('#unauthorized-access').show();
        $('#account-nav-item').hide();
        $('#logout-link').hide();
        return;
    }
    
    // User is logged in
    $('#authorized-content').show();
    $('#account-nav-item').show();
    $('#logout-link').show();
    
    // Set up logout functionality
    $('#logout-link').on('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
    
    // Display user info
    displayUserInfo(user);
    
    // Fetch additional user data from server
    fetchUserData(user.id);
    
    // Fetch user orders
    fetchUserOrders(user.email);
    
    // Modal functionality
    $('#edit-profile-btn').on('click', function() {
        openEditModal(user);
    });
    
    $('#change-password-btn').on('click', function() {
        $('#change-password-modal').show();
    });
    
    $('.close-modal').on('click', function() {
        $(this).closest('.modal').hide();
    });
    
    // Handle edit form submission
    $('#edit-profile-form').on('submit', function(e) {
        e.preventDefault();
        saveProfileChanges(user.id);
    });
    
    // Handle password change form submission
    $('#change-password-form').on('submit', function(e) {
        e.preventDefault();
        changePassword(user.id);
    });
    
    // Toggle password visibility
    $('.toggle-password').on('click', function() {
        const input = $(this).siblings('input');
        const icon = $(this).find('i');
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            input.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });
    
    // Password strength indicator
    $('#new-password').on('input', function() {
        const password = $(this).val();
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthUI(strength);
    });
    
    // Close modal when clicking outside
    $(window).on('click', function(e) {
        if ($(e.target).is('.modal')) {
            $('.modal').hide();
        }
    });
    
    // Card expand functionality
    $('.card-expand').on('click', function() {
        const card = $(this).closest('.dashboard-card');
        card.toggleClass('expanded');
        if (card.hasClass('expanded')) {
            $(this).html('<i class="fas fa-compress"></i>');
        } else {
            $(this).html('<i class="fas fa-expand"></i>');
        }
    });
    
    // Avatar upload preview
    $('#avatar-upload').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                // Update both preview and main avatar
                $('#avatar-preview').css('background-image', `url(${event.target.result})`);
                $('#avatar-preview').addClass('has-image');
                $('#avatar-initials').parent().css('background-image', `url(${event.target.result})`);
                $('#avatar-initials').parent().addClass('has-image');
                $('#avatar-initials').hide();
            };
            reader.readAsDataURL(file);
        }
    });


        // Update in account.js
        $('#view-all-orders').on('click', function(e) {
            e.preventDefault();
            // Fetch all orders instead of just recent ones
            fetchUserOrders(user.email, true); // Pass true to indicate "view all"
        });




    
    // Function to display user info
    function displayUserInfo(userData) {
        // Set avatar initials
        const initials = userData.full_name ? 
            userData.full_name.split(' ').map(n => n[0]).join('') : 'ME';
        $('#avatar-initials').text(initials);
        $('#avatar-preview-initials').text(initials);
        
        // Set user image if available
        if (userData.image) {
            $('.avatar-circle').css('background-image', `url(${userData.image})`);
            $('.avatar-circle').addClass('has-image');
            $('#avatar-initials').hide();
        }
        
        $('#user-greeting').text(userData.full_name || 'Customer');
        $('#account-fullname').text(userData.full_name || 'Not provided');
        $('#account-email').text(userData.email);
        $('#account-phone').text(userData.phone || 'Not provided');
        
        if (userData.date_of_birth) {
            const dob = new Date(userData.date_of_birth);
            $('#account-dob').text(dob.toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            }));
        } else {
            $('#account-dob').text('Not provided');
        }
        
        if (userData.join_date) {
            const joinDate = new Date(userData.join_date);
            $('#join-date').text(joinDate.toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            }));
        }
        
        if (userData.last_login) {
            const lastLogin = new Date(userData.last_login);
            $('#account-lastlogin').text(lastLogin.toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }));
        } else {
            $('#account-lastlogin').text('Never logged in');
        }
        
        // Set loyalty points if available
        if (userData.loyalty_points) {
            $('#loyalty-points').text(userData.loyalty_points);
        }
    }
    
    // Function to fetch additional user data
    function fetchUserData(userId) {
        $.ajax({
            url: `http://localhost:5001/getUser/${userId}`,
            method: 'GET',
            success: function(response) {
                if (response.status === 'success') {
                    // Update user info display
                    displayUserInfo(response.user);
                    
                    // Update localStorage with fresh data
                    const updatedUser = {
                        ...user,
                        ...response.user
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    
                    // Initialize chart if orders data is available
                    if (response.user.orders) {
                        initializeOrdersChart(response.user.orders);
                    }
                    
                    // Display favorite items if available
                    if (response.user.favorites) {
                        displayFavoriteItems(response.user.favorites);
                    }
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching user data:', error);
            }
        });
    }
    
    // Modify fetchUserOrders function
    function fetchUserOrders(email, showAll = false) {
        $.ajax({
            url: 'http://localhost:5001/getOrders',
            method: 'GET',
            success: function(response) {
                if (response.status === 'success') {
                    const userOrders = response.orders.filter(order => 
                        order.email.toLowerCase() === email.toLowerCase()
                    );
                    
                    updateOrderStats(userOrders);
                    if (showAll) {
                        displayAllOrders(userOrders); // New function for all orders
                    } else {
                        displayRecentOrders(userOrders);
                    }
                    initializeOrdersChart(userOrders);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching orders:', error);
            }
        });
    }

    // New function to display all orders
    function displayAllOrders(orders) {
        const $ordersList = $('#recent-orders-list');
        $ordersList.empty();
        
        if (orders.length === 0) {
            $('#no-orders-message').show();
            return;
        }
        
        $('#no-orders-message').hide();
        
        orders.forEach(order => {
            // Same order card creation as displayRecentOrders but without slice
            const orderCard = $(`
                <div class="order-card animate__animated animate__fadeIn">
                    <!-- Your order card HTML here -->
                </div>
            `);
            $ordersList.append(orderCard);
        });
    }


    
    // Function to initialize orders chart
    function initializeOrdersChart(orders) {
        // Group orders by month for the chart
        const monthlyOrders = {};
        orders.forEach(order => {
            const date = new Date(order.date);
            const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
            
            if (!monthlyOrders[monthYear]) {
                monthlyOrders[monthYear] = 0;
            }
            monthlyOrders[monthYear]++;
        });
        
        const labels = Object.keys(monthlyOrders).sort();
        const data = labels.map(label => monthlyOrders[label]);
        
        const ctx = document.getElementById('orders-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Orders per month',
                    data: data,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
    
    // Function to update order statistics
    function updateOrderStats(orders) {
        const totalOrders = orders.length;
        const completedOrders = orders.filter(order => 
            order.orderStatus === 'completed').length;
        const pendingOrders = totalOrders - completedOrders;
        
        $('#total-orders').text(totalOrders);
        $('#completed-orders').text(completedOrders);
        $('#pending-orders').text(pendingOrders);
        
        // Animate the numbers
        animateValue('total-orders', 0, totalOrders, 1000);
        animateValue('completed-orders', 0, completedOrders, 1000);
        animateValue('pending-orders', 0, pendingOrders, 1000);
    }
    
    // Function to animate numeric values
    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Function to display recent orders
    function displayRecentOrders(orders) {
        const $ordersList = $('#recent-orders-list');
        const $noOrdersMessage = $('#no-orders-message');
        
        $ordersList.empty();
        
        if (orders.length === 0) {
            $noOrdersMessage.show();
            return;
        }
        
        $noOrdersMessage.hide();
        
        // Show only the 5 most recent orders
        const recentOrders = orders.slice(0, 5);
        
        recentOrders.forEach(order => {
            const statusClass = order.orderStatus === 'completed' ? 'status-completed' : 
                              order.orderStatus === 'pending' ? 'status-pending' : 'status-cancelled';
            
            const orderDate = new Date(order.date);
            const formattedDate = orderDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            
            // Create order card with animation
            const orderCard = $(`
                <div class="order-card animate__animated animate__fadeIn">
                    <div class="order-info">
                        <div class="order-id">Order #${order.id}</div>
                        <div class="order-date">${formattedDate}</div>
                        <div class="order-items">${order.items.split(',').slice(0, 2).join(', ')}${order.items.split(',').length > 2 ? '...' : ''}</div>
                        <div class="order-total">$${order.grandTotal.toFixed(2)}</div>
                    </div>
                    <div class="order-status-container">
                        <span class="order-status ${statusClass}">${order.orderStatus}</span>
                    </div>
                    <div class="order-action">
                        <a href="#" class="action-link hvr-grow" data-order="${order.id}">
                            <i class="fas fa-eye"></i> View
                        </a>
                    </div>
                </div>
            `);
            
            $ordersList.append(orderCard);
            
            // Add hover effect
            orderCard.hover(
                function() {
                    $(this).addClass('animate__pulse');
                },
                function() {
                    $(this).removeClass('animate__pulse');
                }
            );
        });
        
        // Set up click handler for view order links
        $('.action-link[data-order]').on('click', function(e) {
            e.preventDefault();
            const orderId = $(this).data('order');
            viewOrderDetails(orderId);
        });
    }
    
    // Function to display favorite items
    function displayFavoriteItems(favorites) {
        const $favoritesContainer = $('#favorite-items');
        const $noFavoritesMessage = $('#no-favorites-message');
        
        $favoritesContainer.empty();
        
        if (favorites.length === 0) {
            $noFavoritesMessage.show();
            return;
        }
        
        $noFavoritesMessage.hide();
        
        // Show only the first 6 favorites
        const favoriteItems = favorites.slice(0, 6);
        
        favoriteItems.forEach(item => {
            const favoriteItem = $(`
                <div class="favorite-item animate__animated animate__fadeIn">
                    <img src="${item.image || 'img/default-food.jpg'}" alt="${item.name}">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <button class="btn btn-small hvr-grow add-to-cart" data-id="${item.id}">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                </div>
            `);
            
            $favoritesContainer.append(favoriteItem);
        });
        
        // Set up click handler for add to cart buttons
        $('.add-to-cart').on('click', function() {
            const itemId = $(this).data('id');
            addToCart(itemId);
        });
    }
    
    function viewOrderDetails(orderId) {
        // Show loading indicator
        const loadingModal = $(`
            <div class="modal" id="loading-modal" style="display:flex;justify-content:center;align-items:center;">
                <div class="modal-content" style="background:transparent;box-shadow:none;width:auto;">
                    <div class="loading-spinner" style="font-size:3rem;color:white;">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                </div>
            </div>
        `);
        $('body').append(loadingModal);
        $('#loading-modal').show();
    
        // Fetch order details from server
        $.ajax({
            url: `http://localhost:5001/getOrder/${orderId}`,
            method: 'GET',
            success: function(response) {
                $('#loading-modal').remove();
                
                if (response.status === 'success') {
                    const order = response.order;
                    const orderDate = new Date(order.date);
                    
                    // Create modal with order details
                    const modal = $(`
                        <div class="modal" id="order-details-modal">
                            <div class="modal-content animate__animated animate__zoomIn">
                                <div class="modal-header">
                                    <h3>Order #${order.id} Details</h3>
                                    <button class="close-modal">&times;</button>
                                </div>
                                <div class="modal-body">
                                    <div class="order-details-container">
                                        <div class="order-summary">
                                            <h4>Order Summary</h4>
                                            <div class="summary-grid">
                                                <div class="summary-item">
                                                    <label>Order Date:</label>
                                                    <p>${orderDate.toLocaleString()}</p>
                                                </div>
                                                <div class="summary-item">
                                                    <label>Status:</label>
                                                    <p><span class="order-status ${order.orderStatus}">${order.orderStatus}</span></p>
                                                </div>
                                                <div class="summary-item">
                                                    <label>Customer:</label>
                                                    <p>${order.fullName}</p>
                                                </div>
                                                <div class="summary-item">
                                                    <label>Email:</label>
                                                    <p>${order.email}</p>
                                                </div>
                                                <div class="summary-item">
                                                    <label>Phone:</label>
                                                    <p>${order.phone}</p>
                                                </div>
                                                <div class="summary-item">
                                                    <label>Delivery Address:</label>
                                                    <p>${order.address}</p>
                                                </div>
                                                ${order.notes ? `
                                                <div class="summary-item full-width">
                                                    <label>Notes:</label>
                                                    <p>${order.notes}</p>
                                                </div>
                                                ` : ''}
                                            </div>
                                        </div>
                                        
                                        <div class="order-items-section">
                                            <h4>Order Items (${order.items.length})</h4>
                                            <table class="order-items-table">
                                                <thead>
                                                    <tr>
                                                        <th>Item</th>
                                                        <th>Price</th>
                                                        <th>Qty</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${order.items.map(item => `
                                                        <tr>
                                                            <td>
                                                                <div class="item-info">
                                                                    ${item.img ? `<img src="${item.img}" alt="${item.name}" class="item-img">` : ''}
                                                                    <span>${item.name}</span>
                                                                </div>
                                                            </td>
                                                            <td>$${item.price.toFixed(2)}</td>
                                                            <td>${item.quantity}</td>
                                                            <td>$${item.total.toFixed(2)}</td>
                                                        </tr>
                                                    `).join('')}
                                                </tbody>
                                            </table>
                                            
                                            <div class="order-total">
                                                <div class="total-row">
                                                    <span>Subtotal:</span>
                                                    <span>$${order.grandTotal.toFixed(2)}</span>
                                                </div>
                                                <div class="total-row">
                                                    <span>Delivery Fee:</span>
                                                    <span>$0.00</span>
                                                </div>
                                                <div class="total-row grand-total">
                                                    <span>Total:</span>
                                                    <span>$${order.grandTotal.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button class="btn btn-primary close-modal">Close</button>
                                </div>
                            </div>
                        </div>
                    `);
                    
                    $('body').append(modal);
                    $('#order-details-modal').show();
                    
                    // Close modal handler
                    $('#order-details-modal .close-modal').on('click', function() {
                        $('#order-details-modal').remove();
                    });
                } else {
                    showToast('Failed to load order details', 'error');
                }
            },
            error: function(xhr, status, error) {
                $('#loading-modal').remove();
                console.error('Error fetching order details:', error);
                showToast('Failed to load order details', 'error');
            }
        });
    }


    // Function to open edit modal
    function openEditModal(userData) {
        $('#edit-fullname').val(userData.full_name || '');
        $('#edit-phone').val(userData.phone || '');
        
        if (userData.date_of_birth) {
            const dob = new Date(userData.date_of_birth);
            $('#edit-dob').val(dob.toISOString().substr(0, 10));
        } else {
            $('#edit-dob').val('');
        }
        
        if (userData.address) {
            $('#edit-address').val(userData.address);
        } else {
            $('#edit-address').val('');
        }
        
        $('#edit-profile-modal').show();
    }
    
    // Function to save profile changes
    function saveProfileChanges(userId) {
        const fullName = $('#edit-fullname').val().trim();
        const phone = $('#edit-phone').val().trim();
        const dob = $('#edit-dob').val();
        const address = $('#edit-address').val().trim();
        
        // Basic validation
        if (!fullName || !phone) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        const updateData = {
            full_name: fullName,
            phone: phone,
            date_of_birth: dob || null,
            address: address || null
        };
        
        // Handle avatar upload if present
        const avatarFile = $('#avatar-upload')[0].files[0];
        if (avatarFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                updateData.image = event.target.result;
                sendProfileUpdate(userId, updateData);
            };
            reader.readAsDataURL(avatarFile);
        } else {
            sendProfileUpdate(userId, updateData);
        }
    }
    
    // Helper function to send profile update
    function sendProfileUpdate(userId, updateData) {
        // Send update to server
        $.ajax({
            url: `http://localhost:5001/updateUser/${userId}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(updateData),
            success: function(response) {
                if (response.status === 'success') {
                    // Update displayed info
                    const user = JSON.parse(localStorage.getItem('user'));
                    const updatedUser = {
                        ...user,
                        ...updateData
                    };
                    
                    if (updateData.image) {
                        updatedUser.image = updateData.image;
                    }
                    
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    displayUserInfo(updatedUser);
                    
                    // Close modal
                    $('#edit-profile-modal').hide();
                    
                    // Show success message
                    showToast('Profile updated successfully!', 'success');
                } else {
                    showToast(response.error || 'Failed to update profile', 'error');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error updating profile:', error);
                showToast('An error occurred while updating your profile', 'error');
            }
        });
    }
    
    // Function to change password
    function changePassword(userId) {
        const currentPassword = $('#current-password').val();
        const newPassword = $('#new-password').val();
        const confirmPassword = $('#confirm-new-password').val();
        
        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast('Please fill in all password fields', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showToast('New passwords do not match', 'error');
            return;
        }
        
        if (newPassword.length < 8) {
            showToast('Password must be at least 8 characters', 'error');
            return;
        }
        
        // Check password strength
        const strength = calculatePasswordStrength(newPassword);
        if (strength < 3) {
            showToast('Please choose a stronger password', 'error');
            return;
        }
        
        const passwordData = {
            current_password: currentPassword,
            new_password: newPassword
        };
        
        // Send password change request
        $.ajax({
            url: `http://localhost:5001/changePassword/${userId}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(passwordData),
            success: function(response) {
                if (response.status === 'success') {
                    showToast('Password changed successfully!', 'success');
                    $('#change-password-modal').hide();
                    $('#current-password').val('');
                    $('#new-password').val('');
                    $('#confirm-new-password').val('');
                } else {
                    showToast(response.error || 'Failed to change password', 'error');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error changing password:', error);
                showToast('An error occurred while changing your password', 'error');
            }
        });
    }
    
    // Function to calculate password strength
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        // Length contributes up to 2 points
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        
        // Complexity contributes up to 2 points
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        return Math.min(strength, 4); // Cap at 4 for our meter
    }
    
    // Function to update password strength UI
    function updatePasswordStrengthUI(strength) {
        const meter = $('.strength-meter');
        const text = $('.strength-text');
        let width = 0;
        let strengthText = '';
        let color = '';
        
        switch(strength) {
            case 0:
                width = 25;
                strengthText = 'Very Weak';
                color = '#ff4757';
                break;
            case 1:
                width = 50;
                strengthText = 'Weak';
                color = '#ff6348';
                break;
            case 2:
                width = 75;
                strengthText = 'Good';
                color = '#ffa502';
                break;
            case 3:
                width = 90;
                strengthText = 'Strong';
                color = '#2ed573';
                break;
            case 4:
                width = 100;
                strengthText = 'Very Strong';
                color = '#1dd1a1';
                break;
        }
        
        meter.css('width', `${width}%`);
        meter.css('background', color);
        text.text(strengthText);
        text.css('color', color);
    }
    
    // Function to add item to cart
    function addToCart(itemId) {
        // In a real implementation, this would fetch the item details and add to cart
        showToast('Item added to cart!', 'success');
        
        // Simulate adding to cart
        setTimeout(() => {
            // Update cart count
            const currentCount = parseInt($('.badge').text()) || 0;
            $('.badge').text(currentCount + 1);
        }, 300);
    }
    
    // Toast notification function
    function showToast(message, type) {
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        const toast = $(`
            <div class="toast toast-${type} animate__animated animate__fadeInRight">
                <i class="fas ${icon}"></i> ${message}
            </div>
        `);
        
        $('body').append(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.addClass('animate__fadeOutRight');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});