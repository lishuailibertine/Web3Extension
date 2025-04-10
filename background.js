/// <reference types="chrome" />
let popupWindowId = null;
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  chrome.action.openPopup(); // 可选，用户安装时弹出
});

// 通信桥
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "web3-connection") {
    port.onMessage.addListener(async (msg) => {
      if (msg.type === "WEB3_REQUEST") {
        const { method, params, id } = msg;

        // 弹出窗口
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

        // 向 popup 页面发送消息
        chrome.runtime
          .sendMessage({ method, data: params })
          .then((response) => {
            if (response && response.error) {
              port.postMessage({
                type: "WEB3_ERROR",
                id: id, // 添加 id
                error: response.error,
              });
            } else {
              port.postMessage({
                type: "WEB3_RESPONSE",
                id: id, // 添加 id
                data: response,
              });
            }
          })
          .catch((error) => {
            port.postMessage({
              type: "WEB3_ERROR",
              id: id,
              error: error.message || "Unknown error",
            });
          });
      }
    });

    port.onDisconnect.addListener(() => {
      console.error("🔌 Port disconnected");
    });
  }
});

// 可被 popup 主动调用，向 tab 页面派发事件（比如账号切换）
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "TRIGGER_EVENT") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, {
          type: "WEB3_EVENT",
          event: msg.event,
          data: msg.data,
        });
      }
    });
  }
  sendResponse(); // 避免报错
  return true;
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
      chrome.windows.onRemoved.addListener((closedId) => {
        if (closedId === popupWindowId) {
          popupWindowId = null;
        }
      });
    }
  );
}