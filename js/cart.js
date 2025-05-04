// cart.js
const CART_KEY = "cart";
const ORDER_HISTORY_KEY = "orderHistory";

const Cart = {
    getCart: function() {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    },
    
    saveCart: function(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        this.dispatchCartUpdate();
    },
    
    clearCart: function() {
        localStorage.removeItem(CART_KEY);
        this.dispatchCartUpdate();
    },
    
    addItem: function(item) {
        const cart = this.getCart();
        const existingItem = cart.find(i => i.name === item.name);
        
        if (existingItem) {
            existingItem.qty += item.qty;
        } else {
            cart.push(item);
        }
        
        this.saveCart(cart);
    },
    
    removeItem: function(itemName) {
        const cart = this.getCart().filter(item => item.name !== itemName);
        this.saveCart(cart);
    },
    
    getTotalItems: function() {
        return this.getCart().reduce((sum, item) => sum + item.qty, 0);
    },
    
    getTotalPrice: function() {
        return this.getCart().reduce((sum, item) => sum + (item.price * item.qty), 0);
    },
    
    dispatchCartUpdate: function() {
        // Dispatch both a standard event and a jQuery event for compatibility
        document.dispatchEvent(new CustomEvent('cartUpdated'));
        $(document).trigger('cartUpdated');
    }
};

// Order history functions
const OrderHistory = {
    saveOrder: function(order) {
        let history = JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY)) || [];
        history.push(order);
        localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(history));
    },
    
    getHistory: function() {
        return JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY)) || [];
    }
};

// Make available globally
window.Cart = Cart;
window.OrderHistory = OrderHistory;