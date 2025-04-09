import Web3 from "web3";

class keystoreManage {
  constructor() {
    this.web3 = new Web3();
  }
 // 创建钱包
 async createWallet(walletName, password) {
  try {
    const account = this.web3.eth.accounts.create();
    const keystore = await this.web3.eth.accounts.encrypt(
      account.privateKey,
      password
    );
    keystore.walletName = walletName;
    // 存储 keystore 到 Google 本地存储
    const key = `keystore_${account.address}`; // 拼接键名
    localStorage.setItem(key, JSON.stringify(keystore));

    return { success: true, address: account.address };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

  // 1. 私钥导入生成 keystore，并存入 Google 本地存储
  async importPrivateKey(privateKey, walletName, password) {
    try {
      const keystore = await this.web3.eth.accounts.encrypt(
        privateKey,
        password
      );

      keystore.walletName = walletName;
      // 存储 keystore 到 Google 本地存储
      const key = `keystore_${keystore.address}`; // 拼接键名
      localStorage.setItem(key, JSON.stringify(keystore));
      // 返回 keystore
      return { success: true, message: "Keystore saved successfully." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // 2. 根据钱包名称和密码解锁 keystore，获取私钥
  async unlockKeystore(address, password) {
    try {
      const key = `keystore_${address}`; // 拼接键名
      const keystore = localStorage.getItem(key);
      if (!keystore) {
        throw new Error("Keystore not found.");
      }

      const decryptedAccount = await this.web3.eth.accounts.decrypt(
        JSON.parse(keystore),
        password
      );
      return { success: true, privateKey: decryptedAccount.privateKey };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  // 3. 根据钱包名称删除 keystore
  async deleteKeystore(address) {
    try {
      const key = `keystore_${address}`; // 拼接键名
      const keystore = localStorage.getItem(key);
      if (!keystore) {
        throw new Error("Keystore not found.");
      }

      localStorage.removeItem(key);
      return { success: true, message: "Keystore deleted successfully." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  //  // 4. 获取所有 钱包列表(钱包名字，钱包地址)
  async getAllWallets() {
    try {
      const wallets = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("keystore_")) {
          const keystore = JSON.parse(localStorage.getItem(key));
          wallets.push({
            walletName: keystore.walletName,
            address: keystore.address,
          });
        }
      }
      return { success: true, wallets };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default new keystoreManage();
