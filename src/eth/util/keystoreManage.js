import Web3 from "web3";
import { openDB } from 'idb';

class keystoreManage {
  constructor() {
    this.web3 = new Web3();
  }

  async initDB() {
    this.db = await openDB('keystoreDB', 1, {
      upgrade(db) {
        db.createObjectStore('keystores', { keyPath: 'address' });
      },
    });
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

      // 存储 keystore 到 IndexedDB
      await this.db.put('keystores', { ...keystore, address: account.address });

      return { success: true, address: account.address };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // 私钥导入生成 keystore，并存入 IndexedDB
  async importPrivateKey(privateKey, walletName, password) {
    try {
      const keystore = await this.web3.eth.accounts.encrypt(
        privateKey,
        password
      );

      keystore.walletName = walletName;

      // 存储 keystore 到 IndexedDB
      await this.db.put('keystores', { ...keystore, address: keystore.address });

      return { success: true, message: "Keystore saved successfully." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // 根据钱包名称和密码解锁 keystore，获取私钥
  async unlockKeystore(address, password) {
    try {
      const keystore = await this.db.get('keystores', address);
      if (!keystore) {
        throw new Error("Keystore not found.");
      }

      const decryptedAccount = await this.web3.eth.accounts.decrypt(
        keystore,
        password
      );
      return { success: true, privateKey: decryptedAccount.privateKey };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // 根据钱包名称删除 keystore
  async deleteKeystore(address) {
    try {
      const keystore = await this.db.get('keystores', address);
      if (!keystore) {
        throw new Error("Keystore not found.");
      }

      await this.db.delete('keystores', address);
      return { success: true, message: "Keystore deleted successfully." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  // 根据地址获取keystore
  async getKeystore(address) {
    try {
      const keystore = await this.db.get('keystores', address);
      if (!keystore) {
        throw new Error("Keystore not found.");
      }
      return { success: true, keystore:  keystore};
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  // 获取所有钱包列表(钱包名字，钱包地址)
  async getAllWallets() {
    try {
      const wallets = [];
      const allKeystores = await this.db.getAll('keystores');
      allKeystores.forEach(keystore => {
        wallets.push({
          walletName: keystore.walletName,
          address: keystore.address,
        });
      });
      return { success: true, wallets };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default new keystoreManage();