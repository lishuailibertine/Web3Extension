import keystoreManage from "./keystoreManage";
const handleRuntimeMessage = () => {
    if (chrome?.runtime?.onMessage) {
      chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg.method === "eth_requestAccounts" || msg.method === "eth_accounts") {
            // 获取所有钱包地址
            keystoreManage.getAllWallets().then((res) => {
                const wallets = res.wallets;
                if (wallets && wallets.length > 0) {
                const addresses = wallets.map(wallet => wallet.address);
                sendResponse(addresses);
                } else {
                sendResponse([]);
                }
            }).catch((error) => {
                console.error("Error getting wallets:", error);
                sendResponse({ error: "Failed to get wallets." });
            });
        } else {
            sendResponse({ error: "unkonw error" });
        }
      });
    }
  };
  
  export default handleRuntimeMessage;