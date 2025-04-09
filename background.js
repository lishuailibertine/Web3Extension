/// <reference types="chrome" />
let popupWindowId = null;
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  chrome.action.openPopup();
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "web3-connection") {
    port.onMessage.addListener(async (msg) => {
      if (msg.type === "WEB3_REQUEST") {
        // 应该先弹出来插件
        if (popupWindowId !== null) {
          chrome.windows.get(popupWindowId, (win) => {
            if (chrome.runtime.lastError || !win) {
              openPopup();
            } else {
              chrome.windows.update(popupWindowId, { focused: true });
            }
          });
        } else {
          openPopup();
        }
        chrome.runtime.sendMessage({
          method: msg.method,
          data: msg.params,
        }).then((response) => {
          console.log("Response from popup:", response);
          if (response.error) {
            port.postMessage({ type: "WEB3_ERROR", error: response.error });
            return;
          } else {
            port.postMessage({type: "WEB3_RESPONSE", data: response });
          }
        }).catch((error) => {
          console.error("Error:", error);
          port.postMessage({ type: "WEB3_ERROR", error: "不支持此消息" });
        });
      }
    });

    port.onDisconnect.addListener(() => {
      console.error("🔌 连接断开");
    });
  }
});


function openPopup() {
  chrome.windows.create(
    {
      url: chrome.runtime.getURL("dist/index.html"),
      type: "popup",
      width: 420,
      height: 620,
    },
    (win) => {
      popupWindowId = win.id;
      // 监听窗口关闭
      chrome.windows.onRemoved.addListener((closedId) => {
        if (closedId === popupWindowId) {
          popupWindowId = null;
        }
      });
    }
  );
}