/// <reference types="chrome" />
let popupWindowId = null;
let requestQueue = [];
let allRequests = []; // 当前正在处理的请求
let portPool = new Map(); // ✅ 用于存储连接的 port
let isProcessing = false;
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  chrome.action.openPopup(); // 可选，用户安装时弹出
});
async function handleNextRequest() {
  if (requestQueue.length === 0) return;
  let activeRequest = requestQueue.shift(); // 从队列中取出
  allRequests.push(activeRequest); // 将当前请求加入到正在处理的请求列表
  const { msg } = activeRequest;
  const { method, id } = msg;
  if (method === "eth_accounts" || method === "eth_requestAccounts") {
    // 弹窗
    if (popupWindowId !== null) {
      chrome.windows.get(popupWindowId, (win) => {
        if (chrome.runtime.lastError || !win) {
          openPopup(id);
        } else {
          chrome.windows.update(popupWindowId, { focused: true });
        }
      });
    } else {
      openPopup(id);
    }
  }
}

// 通信桥
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "web3-connection") {
    const portId = `${port.sender?.tab?.id}:${port.sender?.frameId}`;
    port.postMessage({ type: "PORT_ID", portId }); // ✅ 回传给 content script
    portPool.set(portId, port);
    port.onMessage.addListener((msg) => {
      if (msg.type === "WEB3_REQUEST") {
        currentPort = port;
        requestQueue.push({ msg, port }); // 加入请求队列
        handleNextRequest(); // 尝试处理
      }
    });
    port.onDisconnect.addListener(() => {
      console.log(`[Disconnected] ${portId}`);
      portPool.delete(portId); // ✅ 移除失效连接

      // 可选：清除队列中属于该 port 的请求
      requestQueue = requestQueue.filter((r) => r.port !== port);
      allRequests = allRequests.filter((r) => r.port !== port);
    });
  }
});

chrome.runtime.onMessage.addListener((requestMsg, sender, sendResponse) => {
  if (requestMsg.type === "WEB3_EVENT") {
    // 广播给所有连接（或者自定义目标）
    for (const port of portPool.values()) {
      port.postMessage({
        type: requestMsg.type,
        event: requestMsg.event,
        data: requestMsg.data,
      });
    }
  } else if (requestMsg.type === "WEB3_RESPONSE") {
    const activeRequest = allRequests.find((req) => req.msg.id === requestMsg.id);
    if (!activeRequest) {
      console.warn("No active request to respond to.");
      sendResponse();
      return true;
    }
    const { msg, port } = activeRequest;
    if (requestMsg.id !== msg.id) {
      console.warn("Request ID mismatch.");
      sendResponse();
      return true;
    }
    port.postMessage({
      type: requestMsg.type,
      id: requestMsg.id,
      data: requestMsg.data,
      error: requestMsg.error,
    });
    handleNextRequest();
  } else if (requestMsg.type === "closePopup") {
    closePopup();
  }
  sendResponse();
  return true;
});

function openPopup(requestId) {
  const url =
    chrome.runtime.getURL("dist/requestLogin.html") + `?id=${requestId}`;
  chrome.windows.create(
    {
      url: url,
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

// 关闭弹出窗口的函数
function closePopup() {
  if (popupWindowId !== null) {
    chrome.windows.remove(popupWindowId, () => {
      popupWindowId = null; // 关闭后清空 ID
    });
  }
}
