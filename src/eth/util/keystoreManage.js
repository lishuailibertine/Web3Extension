import Web3 from "web3";

class keystoreManage {
  constructor() {
    this.web3 = new Web3();
    this.walletKey = "web3-extension-wallet"; // 钱包名称
  }

  // 1. 私钥导入生成 keystore，并存入 Google 本地存储
  async importPrivateKey(privateKey, walletName, password) {
    try {
      const keystore = await this.web3.eth.accounts.encrypt(
        privateKey,
        password
      );

      // 存储 keystore 到 Google 本地存储
      localStorage.setItem(walletName, JSON.stringify(keystore));
      //把钱包名字,，单独放在容器中
      const walletNames = localStorage.getItem(this.walletKey);
      if (!walletNames) {
        localStorage.setItem(this.walletKey, JSON.stringify([walletName]));
      } else {
        const wallets = JSON.parse(walletNames);
        if (!wallets.includes(walletName)) {
          wallets.push(walletName);
          localStorage.setItem(this.walletKey, JSON.stringify(wallets));
        }
      }
      // 返回 keystore
      return { success: true, message: "Keystore saved successfully." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // 2. 根据钱包名称和密码解锁 keystore，获取私钥
  async unlockKeystore(walletName, password) {
    try {
      const keystore = localStorage.getItem(walletName);
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
  async deleteKeystore(walletName) {
    try {
      const keystore = localStorage.getItem(walletName);
      if (!keystore) {
        throw new Error("Keystore not found.");
      }

      localStorage.removeItem(walletName);
      return { success: true, message: "Keystore deleted successfully." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  //  // 4. 获取所有 钱包列表(钱包名字，钱包地址)
  async getAllWallets() {
    try {
      const wallets = localStorage.getItem(this.walletKey);
      if (!wallets) {
        return { success: true, wallets: [] };
      }

      const walletNames = JSON.parse(wallets);
      const walletList = [];

      for (const walletName of walletNames) {
        const keystoreStr = localStorage.getItem(walletName);
        if (keystoreStr) {
          const keystore = JSON.parse(keystoreStr);
          walletList.push({
            name: walletName,
            address: keystore.address,
          });
        }
      }
      return { success: true, wallets: walletList };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  // 5 随机生成一个钱包,并存储在本地
  async createWallet(walletName) {
    try {
      const account = this.web3.eth.accounts.create();
      const keystore = await this.web3.eth.accounts.encrypt(
        account.privateKey,
        walletName
      );

      // 存储 keystore 到 Google 本地存储
      localStorage.setItem(walletName, JSON.stringify(keystore));
      //把钱包名字,，单独放在容器中
      const walletNames = localStorage.getItem(this.walletKey);
      if (!walletNames) {
        localStorage.setItem(this.walletKey, JSON.stringify([walletName]));
      } else {
        const wallets = JSON.parse(walletNames);
        if (!wallets.includes(walletName)) {
          wallets.push(walletName);
          localStorage.setItem(this.walletKey, JSON.stringify(wallets));
        }
      }
      return { success: true, address: account.address };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default new keystoreManage();
