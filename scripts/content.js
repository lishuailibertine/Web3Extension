// 检查 inject.js 是否已经被注入
const script = document.createElement("script");
script.src = chrome.runtime.getURL("scripts/inject.js");
script.id = "web3-inject-script"; // 为脚本添加一个唯一的 ID
(document.head || document.documentElement).appendChild(script);
script.onload = function () {
  script.remove();
};

function isAnonymous(func) {
  return !func.name; // 如果函数没有名称，则返回 true
}
try {
  const port = chrome.runtime.connect({ name: "web3-connection" });
  console.log("Connected to background script");
  port.onMessage.addListener((msg) => {
    if (msg.type === "WEB3_RESPONSE") {
      window.postMessage(
        { type: msg.type, responseId: msg.id, data: msg.data },
        "*"
      );
    } else if (msg.type === "WEB3_ERROR") {
      window.postMessage(
        { type: msg.type, responseId: msg.id, error: msg.error },
        "*"
      );
    } else if (msg.type === "WEB3_EVENT") {
      window.postMessage(
        { type: msg.type, event: msg.event, data: msg.data },
        "*"
      );
    }
  });

  port.onDisconnect.addListener(() => {
    // 尝试重新连接
    console.warn("Disconnected from background script");
  });

  window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data.type) return;

    if (event.data.type === "WEB3_REQUEST") {
      port.postMessage(event.data);
    }
  });
} catch (error) {
  console.error("Failed to connect to background script:", error);
}
