(() => {
  if (window.ethereum && !window.ethereum.isMyWallet) {
    delete window.ethereum;
  }

  class MyWeb3Provider {
    constructor() {
      this.isMyWallet = true;
      this.isMetaMask = true;
      this.selectedAddress = null;
      this.chainId = "0x38"; // BSC 主网 ChainId
      this._events = {};
      this._nextId = 1;
    }

    async request({ method, params }) {
      return new Promise((resolve, reject) => {
        const id = this._nextId++;
        const handler = (event) => {
          if (event.source !== window || !event.data) return;

          const { type, responseId, data, error } = event.data;
          if (type === "WEB3_RESPONSE" && responseId === id) {
            resolve(data);
            window.removeEventListener("message", handler);
          } else if (type === "WEB3_ERROR" && responseId === id) {
            reject(error);
            window.removeEventListener("message", handler);
          }
        };

        window.addEventListener("message", handler);

        window.postMessage(
          {
            type: "WEB3_REQUEST",
            id: id,
            method,
            params,
          },
          "*"
        );
      });
    }

    on(eventName, listener) {
      if (!this._events[eventName]) this._events[eventName] = [];
      this._events[eventName].push(listener);
    }

    removeListener(eventName, listener) {
      if (this._events[eventName]) {
        this._events[eventName] = this._events[eventName].filter(
          (l) => l !== listener
        );
      }
    }

    _emit(eventName, data) {
      if (this._events[eventName]) {
        for (const listener of this._events[eventName]) {
          try {
            listener(data);
          } catch (err) {
            console.error("Listener error:", err);
          }
        }
      }
    }
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data.type) return;

    if (event.data.type === "WEB3_EVENT") {
      const { event: eventName, data } = event.data;
      if (window.ethereum && typeof window.ethereum._emit === "function") {
        window.ethereum._emit(eventName, data);
      }
    }
  });
  const provider = new MyWeb3Provider();
  Object.defineProperty(window, "ethereum", {
    configurable: false,
    writable: false,
    value: provider,
  });
  window.dispatchEvent(new Event("ethereum#initialized"));
})();
