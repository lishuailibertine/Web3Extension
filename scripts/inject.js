(() => {
    if (window.ethereum && !window.ethereum.isMyWallet) {
        delete window.ethereum; // 先移除 MetaMask
    }
    class MyWeb3Provider {
      constructor() {
        this.isMyWallet = true;
        this.isMetaMask = true; // 让 DApp 以为这是 MetaMask
      }
  
      async request({ method, params }) {
        console.log("🔗 DApp 发送了 Web3 请求:", method, params);
        return new Promise((resolve, reject) => {
          // 发送消息给 `content_script.js`
          window.postMessage({ type: "WEB3_REQUEST", method, params }, "*");
  
          // 监听 `content_script.js` 返回的结果
          window.addEventListener("message", function handler(event) {
            if (event.source !== window || !event.data.type) return;
            if (event.data.type === "WEB3_RESPONSE") {
              resolve(event.data.data);
              window.removeEventListener("message", handler);
            }
          });
        });
      }
    }
    // **覆盖 `window.ethereum`**
    Object.defineProperty(window, "ethereum", {
      configurable: false,
      writable: false,
      value: new MyWeb3Provider(),
    });
  })();