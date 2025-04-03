<template>
    <div class="wallet-container">
        <header class="wallet-header">
            <h1 class="wallet-name">My Wallet</h1>
            <button class="settings-button" @click="openSettings">⚙️</button>
        </header>

        <div class="balance-section">
            <h2 class="balance">Balance: {{ balance }} USD</h2>
            <button class="send-button" @click="sendTransaction">Send</button>
        </div>

        <div class="currency-title-container">
            <h3 class="currency-title">Currency List</h3>
            <div class="tab-indicator"></div>
        </div>

        <ul class="currency-list">
            <li v-for="currency in currencies" :key="currency.id" class="currency-item">
                <div class="currency-info">
                    <span class="currency-name">{{ currency.name }}</span>
                    <span class="currency-balance">{{ currency.balance }} {{ currency.symbol }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const balance = ref(1000); // 使用 ref 创建响应式变量
        const currencies = ref([
            { id: 1, name: 'Bitcoin', symbol: 'BTC', balance: 0.5 },
            { id: 2, name: 'Ethereum', symbol: 'ETH', balance: 2 },
            { id: 3, name: 'Litecoin', symbol: 'LTC', balance: 5 }
        ]);

        const sendTransaction = () => {
            alert('Send transaction functionality goes here.');
            // 这里可以添加发送转账的逻辑
        };

        const openSettings = () => {
            alert('Settings functionality goes here.');
            // 这里可以添加打开设置的逻辑
        };

        return {
            balance,
            currencies,
            sendTransaction,
            openSettings
        };
    }
};
</script>

<style scoped>
.wallet-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 0 auto;
    margin-top: 80px;
    /* 确保内容不被固定的 header 遮挡 */
}

.wallet-header {
    position: fixed;
    /* 固定在顶部 */
    top: 0;
    /* 距离顶部 0 像素 */
    left: 0;
    /* 距离左侧 0 像素 */
    right: 0;
    /* 距离右侧 0 像素 */
    background: white;
    /* 背景颜色 */
    padding: 0px 20px;
    /* 内边距 */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    /* 阴影效果 */
    z-index: 1000;
    /* 确保在其他内容之上 */
    display: flex;
    /* 使用 flex 布局 */
    justify-content: space-between;
    /* 在主轴上分配空间 */
    align-items: center;
    /* 垂直居中对齐 */
    height: 80px;
}

.wallet-name {
    font-size: 18px;
    font-weight: bold;
}

.settings-button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
}

.balance-section {
    text-align: center;
    padding-top: 12px;
    background-color: white;
}

.balance {
    font-size: 20px;
    margin-bottom: 10px;
}

.send-button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.currency-title-container {
    position: sticky;
    /* 使标题在滚动时悬浮 */
    top: 80px;
    /* 距离顶部 60 像素，确保在导航下方 */
    background: white;
    /* 背景颜色 */
    z-index: 999;
    /* 确保在其他内容之上 */
    padding: 0px 10px;
    /* 底部边框 */
    height: 44px;
    display: flex; /* 使用 Flexbox 布局 */
    flex-direction: column; /* 垂直排列 */
}

.currency-title {
    font-size: 12px;
}

.tab-indicator {
    width: 100%;
    /* 滑动条的宽度 */
    height: 2px;
    /* 滑动条的高度 */
    /* 居中对齐 */
    background-color: gray;
    margin-bottom: 1px; /* 确保与标题有一定间距 */
}

.currency-list {
    list-style-type: none;
    padding: 0;
}

.currency-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.currency-info {
    display: flex;
    flex-direction: column;
}

.currency-name {
    font-weight: bold;
}

.currency-balance {
    color: #666;
}

.currency-button {
    padding: 5px 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>