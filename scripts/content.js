if (!globalThis.__web3_content_loaded__) {
  globalThis.__web3_content_loaded__ = true;

  if (!document.getElementById("web3-inject-script")) {
    const script = document.createElement("script");
    script.id = "web3-inject-script";
    script.src = chrome.runtime.getURL("scripts/inject.js");
    (document.head || document.documentElement).appendChild(script);
  }
  keepAlive();
}

function keepAlive() {
  try {
    const port = chrome.runtime.connect({ name: "web3-connection" });

    port.onMessage.addListener((msg) => {
      if (msg.type === "PORT_ID") {
        console.log("[Connected] Port ID:", msg.portId);
      } else if (msg.type === "WEB3_RESPONSE") {
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
      console.warn("💥 Port disconnected");
      console.warn("lastError:", chrome.runtime.lastError); // 打这个！
      setTimeout(keepAlive, 1000);
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