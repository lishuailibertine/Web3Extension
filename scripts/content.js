// 检查 inject.js 是否已经被注入
if (!document.getElementById('web3-inject-script')) {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("scripts/inject.js");
    script.id = 'web3-inject-script'; // 为脚本添加一个唯一的 ID
    (document.head || document.documentElement).appendChild(script);
    script.onload = function () {
      script.remove();
    };
  }

function connectPort() {
  // 与 background 建立长连接
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
    }
  });

  port.onDisconnect.addListener(() => {
    console.error("🔌 Port disconnected");
    // 尝试重新连接
    setTimeout(() => {
      console.log("Attempting to reconnect...");
      connectPort(); // 重新建立连接
    }, 1000); // 1秒后重连
  });

  window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data.type) return;
  
    if (event.data.type === "WEB3_REQUEST") {
      port.postMessage(event.data);
    }
  });
}
connectPort();