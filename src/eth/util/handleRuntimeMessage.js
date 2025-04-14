import keystoreManage from "./keystoreManage";

const handleRuntimeMessage = () => {
  if (chrome?.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      const { method, data } = msg;
      // 等待reqestLogin的返回
      // Helper 函数：统一发送结果
      const reply = (result, error) => {
        if (error) {
          sendResponse({ error: error });
        } else {
          sendResponse(result);
        }
      };

      if (method === "eth_requestAccounts" || method === "eth_accounts") {
        keystoreManage.getAllWallets().then((res) => {
          const wallets = res.wallets;
          const addresses = wallets?.map((w) => w.address) || [];
          reply({type: "WEB3_RESPONSE", data: addresses});
        }).catch((err) => {
          reply(null, "Failed to get wallets.");
        });

      } else if (method === "eth_chainId") {
        const chainId = "0x38"; // BSC
        // chrome.runtime.sendMessage({
        //   type: "WEB3_EVENT",
        //   event: "chainChanged",
        //   data: chainId,
        // });
        reply({type: "WEB3_RESPONSE", data: chainId});

      } else if (method === "eth_sign") {
        // 示例处理（实际按你逻辑补上）
        reply(null, "eth_sign not implemented");

      } else if (method === "eth_sendTransaction") {
        reply(null, "eth_sendTransaction not implemented");

      } else if (method === "eth_signTypedData") {
        reply(null, "eth_signTypedData not implemented");

      } else if (method === "eth_call") {
        reply(null, "eth_call not implemented");

      } else if (method === "personal_sign") {
        reply(null, "personal_sign not implemented");

      } else {
        console.warn("Unknown method:", method);
        reply(null, "Unknown method: " + method);
      }

      return true; // 异步响应
    });
  }
};

export default handleRuntimeMessage;