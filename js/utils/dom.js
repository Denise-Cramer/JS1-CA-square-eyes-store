export function qs(selector) {
    return document.querySelector(selector);
}

export function showElement(element) {
    element.hidden = false;
}

export function hideElement(element) {
    element.hidden = true;
}

export function setText(element, text) {
    element.textContent = text;
}
