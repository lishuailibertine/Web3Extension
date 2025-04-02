/// <reference types="chrome" />

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  chrome.action.openPopup();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "CONNECT_WALLET") {
    console.log("DApp 请求连接钱包");

    // 打开插件 UI
    chrome.windows.create({
      url: "dist/index.html",
      type: "popup",
      width: 400,
      height: 600,
    });

    // 等待 UI 选择账户后返回
    chrome.runtime.onMessage.addListener((response) => {
      if (response.type === "WALLET_CONNECTED") {
        sendResponse({ accounts: response.accounts });
      }
    });

    return true; // 保持消息通道打开
  }
});

chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === "content-script") {
      console.log("Content script connected");
      // port.postMessage({farewell: "goodbye"});
      port.onMessage.addListener(function(message) {
        console.log(message.greeting);
      });
    }
});

chrome.runtime.onUserScriptMessage.addListener((message, sender) => {
    console.log("📩 background.js 收到 `content_script.js` 消息:", message);
  
    if (message.type === "CONNECT_WALLET") {
      // **模拟返回账户信息**
      const accounts = ["0x1234567890abcdef"];
  
      // **✅ 发送消息回 `content_script.js`**
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        func: (accounts) => {
          window.postMessage({ type: "WALLET_CONNECTED", accounts }, "*");
        },
        args: [accounts],
      });
    }
  });