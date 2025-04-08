<template>
  <div class="wallet-import-container">
    <h1 class="title">Web3 入口，一个就够</h1>
    <div class="button-container">
      <button class="create-wallet-button" @click="createWallet">创建新钱包</button>
      <button class="import-wallet-button" @click="importWallet">导入已有钱包</button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
export default {
  name: 'WalletImport',
  setup() {
    const router = useRouter();
    const createWallet = () => {
      router.push({ name: 'WalletConfirmPsd' });
    };

    const importWallet = () => {
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
  width: 400px;
  height: 750px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000; /* 背景颜色 */
  color: #fff; /* 字体颜色 */
  text-align: center; /* 文本居中 */
  overflow: auto; /* 控制溢出内容 */
}

.title {
  font-size: 24px; /* 标题字体大小 */
  margin-bottom: 40px; /* 标题与按钮之间的间距 */
}

.button-container {
  display: flex;
  flex-direction: column; /* 垂直排列按钮 */
  gap: 20px; /* 按钮之间的间距 */
}

.create-wallet-button,
.import-wallet-button {
  padding: 15px 20px; /* 按钮内边距 */
  font-size: 18px; /* 按钮字体大小 */
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