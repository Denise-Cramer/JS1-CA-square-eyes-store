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
