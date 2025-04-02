(() => {
  // 先检查 MetaMask 是否已存在
  if (window.ethereum && !window.ethereum.isMyWallet) {
    delete window.ethereum; // 先移除 MetaMask
  }
  // 定义你的钱包 Provider
  class MyWeb3Provider {
    constructor() {
      this.isMyWallet = true; // 让 DApp 识别你的插件
      this.isMetaMask = true;
      this.request = this.request.bind(this);
    }
    async request({ method, params }) {
      if (method === "eth_requestAccounts") {
        return new Promise((resolve, reject) => {
            window.postMessage({ type: "CONNECT_WALLET" },"*");
        });
      }
      return Promise.reject(new Error(`方法 ${method} 未实现`));
    }
  }

  // **确保你的插件在全局作用域中最早注入**
  Object.defineProperty(window, "ethereum", {
    configurable: false, // 防止被覆盖
    writable: false,
    value: new MyWeb3Provider(),
  });
})();
