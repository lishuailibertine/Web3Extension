(() => {
    if (window.ethereum && !window.ethereum.isMyWallet) {
        delete window.ethereum;
    }
    class MyWeb3Provider {
      constructor() {
        this.isMyWallet = true;
        this.isMetaMask = true;
      }
  
      async request({ method, params }) {
        return new Promise((resolve, reject) => {
          window.postMessage({ type: "WEB3_REQUEST", method, params }, "*");

          window.addEventListener("message", function handler(event) {
            if (event.source !== window || !event.data.type) return;
            if (event.data.type === "WEB3_RESPONSE") {
              resolve(event.data.data);
              window.removeEventListener("message", handler);
            } else if (event.data.type === "WEB3_ERROR"){
              reject(event.data.error);
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
  