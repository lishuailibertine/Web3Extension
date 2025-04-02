/// <reference types="chrome" />

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  chrome.action.openPopup();
});

chrome.runtime.onConnect.addListener((port) => {
  console.log("🔌 连接成功:", port.name);

  if (port.name === "web3-connection") {
    port.onMessage.addListener(async (msg) => {
      console.log("📨 收到消息:", msg);

      if (msg.type === "WEB3_REQUEST") {
        // try {
        //   // 发送成功的响应回 `content_script.js`
        //   port.postMessage({ type: "WEB3_RESPONSE", data: ["0x8d3633998A91041aD986E751A753c100C792B260"] });
        // } catch (error) {
          port.postMessage({ type: "WEB3_ERROR", error: "不支持此消息" });
        // }
      }
    });

    port.onDisconnect.addListener(() => {
      console.log("🔌 连接断开");
    });
  }
});
