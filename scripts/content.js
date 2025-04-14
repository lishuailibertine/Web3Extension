if (!globalThis.__web3_content_loaded__) {
  globalThis.__web3_content_loaded__ = true;
  // 只执行一次的逻辑...
  // 检查 inject.js 是否已经被注入
if (!document.getElementById("web3-inject-script")) {
  const script = document.createElement("script");
  script.id = "web3-inject-script";
  script.src = chrome.runtime.getURL("scripts/inject.js");
  (document.head || document.documentElement).appendChild(script);
}
function isAnonymous(func) {
  return !func.name; // 如果函数没有名称，则返回 true
}
try {
  const port = chrome.runtime.connect({ name: "web3-connection" });
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
    } else if (msg.type === "PORT_ID") {
      console.log("[Connected] Port ID:", msg.portId);
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

}
