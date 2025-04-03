const script = document.createElement("script");
script.src = chrome.runtime.getURL("scripts/inject.js");
(document.head || document.documentElement).appendChild(script);
script.onload = function () {
    script.remove(); 
};

const port = chrome.runtime.connect({ name: "web3-connection" });
port.onMessage.addListener((msg) => {
    if (msg.type === "WEB3_RESPONSE") {
        window.postMessage({ type: "WEB3_RESPONSE", data: msg.data }, "*");
    } else if (msg.type === "WEB3_ERROR") {
        window.postMessage({ type: "WEB3_ERROR", error: msg.error }, "*");
    }
});
window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data.type) return;

    if (event.data.type === "WEB3_REQUEST") {
        port.postMessage(event.data);
    }
});