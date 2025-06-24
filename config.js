let rootPath = "https://mysite.itvarsity.org/api/ContactBook/";

function checkApiKey() {
    if (!localStorage.getItem("apiKey")) {
        window.location.href = "enter-api-key.html";
    }
    return localStorage.getItem("apiKey");
}

let apiKey = checkApiKey();
