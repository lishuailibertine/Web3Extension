<template>
    <div class="wallet-import-container">
      <h1>Wallet Management</h1>
      <div class="button-container">
        <button class="create-wallet-button" @click="createWallet">Create New Wallet</button>
        <button class="import-wallet-button" @click="importWallet">Import Existing Wallet</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'WalletImport',
    setup() {
      const createWallet = () => {
        // 这里可以添加创建钱包的逻辑
        alert('Create New Wallet functionality goes here.');
      };
  
      const importWallet = () => {
        // 这里可以添加导入钱包的逻辑
        alert('Import Existing Wallet functionality goes here.');
      };
  
      return {
        createWallet,
        importWallet
      };
    }
  };
  </script>
  
  <style scoped>
  .wallet-import-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh; /* 使容器充满视口高度 */
    background-color: #f9f9f9; /* 背景颜色 */
  }
  
  .button-container {
    margin-top: 20px; /* 按钮之间的间距 */
  }
  
  .create-wallet-button,
  .import-wallet-button {
    padding: 10px 20px;
    margin: 10px; /* 按钮之间的间距 */
    font-size: 16px;
    color: white;
    background-color: #007bff; /* 按钮背景颜色 */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s; /* 添加过渡效果 */
  }
  
  .create-wallet-button:hover,
  .import-wallet-button:hover {
    background-color: #0056b3; /* 悬停时的背景颜色 */
  }
  </style>