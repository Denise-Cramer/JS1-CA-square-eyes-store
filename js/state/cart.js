var CART_KEY = "square-eyes-cart";

export function getCart() {
    var cart = localStorage.getItem(CART_KEY);

    if (cart === null) {
        return [];
    }

    return JSON.parse(cart);
}

export function addToCart(product) {
    var cart = getCart();

    cart.push(product);

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Remove from cart by index
export function removeFromCart(index) {
    var cart = getCart();
    cart.splice(index, 1);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

//Clear entire cart
export function clearCart() {
    localStorage.setItem(CART_KEY, JSON.stringify([]));
}
