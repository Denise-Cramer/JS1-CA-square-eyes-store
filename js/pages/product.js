import { fetchJson } from "../api/client.js";
import {qs, showElement, hideElement, setText} from "../utils/dom.js";
import { formatPrice } from "../utils/format.js";
import {addToCart} from "../state/cart.js";

var BASE_URL = "https://v2.api.noroff.dev";

var loader = qs("#loader");
var errorMessage = qs("#error");
var container = qs("#productContainer");

//Read ID from URL
function getProductId() {
    var params = new URLSearchParams(window.location.search);
    return params.get("id");
}

//Render product details on the page
function renderProduct(product) {
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

    container.innerHTML = `
    <img src="${imageUrl}" alt="${imageAlt}">

    <div class="product-info">
    <h2>${product.title}</h2>
    <p>${product.description}</p>
    <p><strong>Genre:</strong> ${product.genre}</p>
    <p><strong>Rating:</strong> ${product.rating}</p>
    <p><strong>Released:</strong> ${product.released}</p>
    <p><strong>Price:</strong> ${formatPrice(priceToUse)}</p>

    <button id="addToCartButton" type="button">Add to cart</button>
    </div>
    `;

    var button = qs("#addToCartButton");
    button.addEventListener("click", function() {
        addToCart(product);
        alert("Product added to cart!");
    });
}

//init
async function init() {
    var productId = getProductId();

    if (productId === null) {
        setText(errorMessage, "No product selected.");
        showElement(errorMessage);
        return;
    }

    hideElement(errorMessage);
    showElement(loader);

    try {
        var url = BASE_URL + "/square-eyes/" + encodeURIComponent(productId);
        var json = await fetchJson(url);
        var product = json.data;

        renderProduct(product);

    } catch (error) {
        setText(errorMessage, "Failed to load product.");
        showElement(errorMessage);
    } finally {
        hideElement(loader);
    }
}

init();
