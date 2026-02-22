import { qs, setText, showElement, hideElement } from "../utils/dom.js";
import { formatPrice } from "../utils/format.js";
import {getCart, removeFromCart, clearCart } from "../state/cart.js";

var cartItemsContainer = qs("#cartItems");
var totalPriceElement = qs("#totalPrice");
var emptyMessage = qs("#emptyMessage");
var checkoutButton = qs("#checkoutButton");

function calculateTotal(cart) {
    var total = 0;

    for (var i = 0; i < cart.length; i++) {
        var product = cart[i];

        var priceToUse = product.discountedPrice;
        if (priceToUse === null || priceToUse === undefined) {
            priceToUse = product.price;
        }
        total = total + priceToUse;
    }

    return total;
}

    function renderCart() {
        var cart = getCart();
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            showElement(emptyMessage);
            setText(totalPriceElement, formatPrice(0));
            checkoutButton.disabled = true;
            return;
        }

        hideElement(emptyMessage);
        checkoutButton.disabled = false;

        for (var i = 0; i < cart.length; i++) {
            var product = cart[i];

            var imageUrl = "";
            var imageAlt = product.title;

            if (product.image && product.image.url) {
                imageUrl = product.image.url;
            }
            if (product.image && product.image.alt) {
                imageAlt = product.image.alt;
            }

            var priceToUse = product.discountedPrice;
            if (priceToUse === null || priceToUse === undefined) {
                priceToUse = product.price;
            }

            var item = document.createElement("div");
            item.className = "cart-item";

            item.innerHTML = `
            <img src="${imageUrl}" alt="${imageAlt}" style="max-width:120px;">
            <h2>${product.title}</h2>
            <p>${formatPrice(priceToUse)}</p>
            <button type="button" data-index="${i}">Remove</button>
            <hr>
            `;

            cartItemsContainer.appendChild(item);
        }

        var total = calculateTotal(cart);
        setText(totalPriceElement, formatPrice(total));
        
    }

        //Remove button handling
        cartItemsContainer.addEventListener("click", function(event) {
            var button = event.target;

            if (button.matches("button[data-index]")) {
                var index = Number(button.dataset.index);
                removeFromCart(index);
                renderCart();
            }
        });

checkoutButton.addEventListener("click", function() {
    clearCart();
    window.location.href = "./confirmation/index.html";
});

//init
renderCart();
