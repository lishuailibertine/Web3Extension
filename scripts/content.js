// 1️⃣ 注入 `inject.js` 到 DApp 网页环境
const script = document.createElement("script");
script.src = chrome.runtime.getURL("scripts/inject.js");
(document.head || document.documentElement).appendChild(script);

// 2️⃣ 连接 `background.js`
const port = chrome.runtime.connect({ name: "web3-connection" });

port.onMessage.addListener((msg) => {
    console.log("✅ Background 响应:", msg);

    if (msg.type === "WEB3_RESPONSE") {
        // 发送 Web3 响应回 DApp
        window.postMessage({ type: "WEB3_RESPONSE", data: msg.data }, "*");
    } else if (msg.type === "WEB3_ERROR") {
        // 发送错误消息回 DApp
        window.postMessage({ type: "WEB3_ERROR", error: msg.error }, "*");
    }
});

// 3️⃣ 监听 DApp（网页）发来的 Web3 请求
window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data.type) return;

    if (event.data.type === "WEB3_REQUEST") {
        console.log("🔗 收到网页 Web3 请求:", event.data);
        
        // 4️⃣ 转发请求给 `background.js`
        port.postMessage(event.data);
    }
});