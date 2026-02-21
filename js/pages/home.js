import { fetchJson } from "..api/client.js";
import { qs, showElement, hideElement, setText } from "..utils/dom.js";
import { formatPrice } from "..utils/format.js";

var BASE_URL = 'https://v2.api.noroff.dev';

var productGrid = qs('#productGrid');
var loader = qs('#loader');
var errorMessage = qs('#error');
var genreFilter = qs('#genreFilter');

// Store all products in memory to avoid refetching when filtering
var allProducts = [];

//Show products on the page
function renderProducts(products) {
  productGrid.innerHTML = '';

  if (products.length === 0) {
    productGrid.innerHTML = '<p>No products found.</p>';
    return;
  }

  for (var i = 0; i < products.length; i++) {
    var product = products[i];

    //Choose the discounted price if available, otherwise use the regular price
    var priceToUse = product.discountedPrice;
    if (priceToUse === null || priceToUse === undefined) {
      priceToUse = product.price;
    }

    var card = document.createElement('a');
    card.className = 'product-card';
    card.href = "product/index.html?id=" + encodeURIComponent(product.id);
  
    var imageUrl = "";
    var imageAlt = product.title;

    if (product.image && product.image.url) {
        imageUrl = product.image.url;
    }

    if (product.image && product.image.alt) {
        imageAlt = product.image.alt;
    }

    card.innerHTML = `
    <img src="${imageUrl}" alt="${imageAlt}">
    <h2>${product.title}</h2>
    <p>${product.genre}</p>
    <p>${formatPrice(priceToUse)}</p>
    `;

    productGrid.appendChild(card);
  }
}

//Dropdown filter with genres for products
function populateGenreFilter(products) {
    // Avoid duplicates
    var genreMap = {};

    for (var i = 0; i < products.length; i++) {
        var genre = products[i].genre;
        genreMap[genre] = true;
    }

    for (var genreName in genreMap) {
        var option = document.createElement('option');
        option.value = genreName;
        option.textContent = genreName;
        
        genreFilter.appendChild(option);
    }
}

//Filter products based on selected genre
function filterProducts() {
    var selectedGenre = genreFilter.value;

    if (selectedGenre === 'all') {
        renderProducts(allProducts);
        return;
    }

    var filtered = [];

    for (var i = 0; i < allProducts.length; i++) {
        if (allProducts[i].genre === selectedGenre) {
            filtered.push(allProducts[i]);
        }
    }

    renderProducts(filtered);
}

async function init() {
    hideElement(errorMessage);
    showElement(loader);

    try {
        var json = await fetchJson(BASE_URL + "/square-eyes");
        allProducts = json.data;

        populateGenreFilter(allProducts);
        renderProducts(allProducts);

        genreFilter.addEventListener('change', filterProducts);
    } catch (error) {
        setText(errorMessage, "Failed to load products. Please try again later.");
        showElement(errorMessage);
    } finally {
        hideElement(loader);
    }       
}

init();
