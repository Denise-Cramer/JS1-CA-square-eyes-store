export async function fetchJson(url) {
    var response = await fetch(url);

    if (response.ok === false) {
        throw new Error("API request failed");
    }

    var json = await response.json();
    return json;        
}
