<template>
    <div class="wallet-container" @click="handleClickOutside">
        <header class="wallet-header">
            <h1 class="wallet-name" @click.stop="toggleSidebar">{{walletName}}</h1>
            <button class="settings-button" @click="handleButtonClick(openSettings)">⚙️</button>
        </header>

        <div class="balance-section">
            <h2 class="balance">Balance: {{ balance }} USD</h2>
            <button class="send-button" @click="handleButtonClick(sendTransaction)">Send</button>
        </div>

        <div class="currency-title-container">
            <div class="tab-titles">
                <h3 class="currency-title" :class="{ active: activeTab === 'currency' }"
                    @click="setActiveTab('currency')">
                    Currency List
                </h3>
                <h3 class="transaction-title" :class="{ active: activeTab === 'transaction' }"
                    @click="setActiveTab('transaction')">
                    Transaction Records
                </h3>
            </div>
            <div class="tab-indicator" :style="{ left: activeTab === 'currency' ? '0' : '50%' }"></div>
        </div>

        <div v-if="activeTab === 'currency'">
            <ul class="currency-list">
                <li v-for="currency in currencies" :key="currency.id" class="currency-item">
                    <div class="currency-info">
                        <span class="currency-name">{{ currency.name }}</span>
                        <span class="currency-balance">{{ currency.balance }} {{ currency.symbol }}</span>
                    </div>
                </li>
            </ul>
        </div>

        <div v-if="activeTab === 'transaction'">
            <ul class="transaction-list">
                <li v-for="transaction in transactions" :key="transaction.id" class="transaction-item">
                    <div class="transaction-info">
                        <span class="transaction-description">{{ transaction.description }}</span>
                        <span class="transaction-amount">{{ transaction.amount }} USD</span>
                    </div>
                </li>
            </ul>
        </div>

        <!-- 侧边栏 -->
        <div class="sidebar" v-if="isSidebarOpen">
            <h3>Wallets</h3>
            <ul>
                <li v-for="wallet in wallets" :key="wallet.name">{{ wallet.name }} - {{ wallet.address }}</li>
            </ul>
            <button class="closebutton" @click="toggleSidebar">Close</button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import keystoreManage from '@/eth/util/keystoreManage';
export default {
    name: 'WalletHome',
    setup() {
        const walletName = ref(localStorage.getItem("selectedWallet")); // 钱包名称
        const balance = ref(1000); // 使用 ref 创建响应式变量
        const currencies = ref([
            { id: 1, name: 'Bitcoin', symbol: 'BTC', balance: 0.6 },
            { id: 2, name: 'Ethereum', symbol: 'ETH', balance: 2 },
            { id: 3, name: 'Litecoin', symbol: 'LTC', balance: 5 }
        ]);

        const transactions = ref([
            { id: 1, description: 'Sent 0.1 BTC', amount: 100 },
            { id: 2, description: 'Received 0.6 ETH', amount: 200 },
            { id: 3, description: 'Sent 1 LTC', amount: 50 }
        ]);

        const activeTab = ref('currency'); // 默认选中的 tab
        const wallets = ref([]); // 钱包列表
        const isSidebarOpen = ref(false); // 控制侧边栏的显示与隐藏
        const init = async () => {
            const allWallets = await keystoreManage.getAllWallets(); // 获取钱包列表
            console.log(allWallets);
            wallets.value = allWallets.wallets.map(wallet => ({
                name: wallet.walletName,
                address: wallet.address
             })); // 使用 ref 创建响应式变量
         };
       
        const setActiveTab = (tab) => {
            activeTab.value = tab; // 更新选中的 tab
        };

        const toggleSidebar = () => {
            isSidebarOpen.value = !isSidebarOpen.value; // 切换侧边栏的显示状态
        };

        const sendTransaction = () => {

        };

        const openSettings = () => {
            // 这里可以添加打开设置的逻辑
            alert('Open settings functionality goes here.');
        };
        const handleClickOutside = (event) => {
            const sidebar = document.querySelector('.sidebar');
            if (isSidebarOpen.value && sidebar && !sidebar.contains(event.target)) {
                isSidebarOpen.value = false; // 点击侧边栏以外的地方关闭侧边栏
            }
        };

        const handleButtonClick = (action) => {
            if (isSidebarOpen.value) {
                isSidebarOpen.value = false; // 关闭侧边栏
            }
            // 使用 setTimeout 确保侧边栏关闭后再执行操作
            setTimeout(() => {
                action(); // 执行传入的操作
            }, 100); // 100毫秒的延迟，确保侧边栏关闭
        };
        init(); // 初始化钱包列表
        // 监听点击事件
        return {
            walletName,
            balance,
            currencies,
            transactions,
            sendTransaction,
            openSettings,
            activeTab,
            setActiveTab,
            isSidebarOpen,
            toggleSidebar,
            wallets,
            handleClickOutside,
            handleButtonClick
        };
    }
};
</script>

<style scoped>
.wallet-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 400px;
    height: 750px;
    margin: 0 auto;
    margin-top: 80px;
    /* align-items: center; */
    /* 确保内容不被固定的 header 遮挡 */
}

.wallet-header {
    position: fixed;
    /* 固定在顶部 */
    margin-top: -80px;
    /* 距离顶部 0 像素 */
    /* 距离左侧 0 像素 */
    /* right: 0; */
    /* 距离右侧 0 像素 */
    background: white;
    /* 背景颜色 */
    padding: 0px 12px;
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
    width: 100%;
    width: 400px;
    height: 80px;
    box-sizing: border-box;
}

.wallet-name {
    font-size: 18px;
    font-weight: bold;
    width: 100px;
    overflow: hidden;
    cursor: pointer;
}

.settings-button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
}

.balance-section {
    /* 确保宽度为100% */
    text-align: center;
    padding-top: 12px;
    background-color: white;
    width: 100%;
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
    margin-top: 12px;
    padding: 0px 0px;
    /* 底部边框 */
    height: 44px;
    display: flex;
    /* 使用 Flexbox 布局 */
    flex-direction: column;
    /* 垂直排列 */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    width: 100%;
}


.tab-titles {
    display: flex;
    /* 横向排列标题 */
    justify-content: space-between;
    /* 在主轴上分配空间 */
    align-items: center;
    /* 垂直居中对齐 */
}

.currency-title,
.transaction-title {
    font-size: 12px;
    margin: 0;
    /* 去掉默认的外边距 */
    padding: 10px;
    /* 添加内边距 */
    cursor: pointer;
    /* 鼠标悬停时显示为可点击 */
}

.active {
    font-weight: bold;
    /* 激活状态加粗 */
    color: #007bff;
    /* 激活状态颜色 */
}

.tab-indicator {
    position: absolute;
    /* 绝对定位 */
    bottom: -2px;
    /* 距离底部2像素 */
    width: 50%;
    /* 滑动条的宽度 */
    height: 1px;
    /* 滑动条的高度 */
    background-color: #007bff;
    /* 滑动条的颜色 */
    transition: left 0.3s;
    /* 添加过渡效果 */
}

.currency-list,
.transaction-list {
    list-style-type: none;
    padding: 0;
    width: 100%;
}

.currency-item,
.transaction-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.currency-item:hover,
.transaction-item:hover {
    background-color: #f0f0f0;
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

.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 40%;
    /* 侧边栏宽度 */
    height: 100%;
    background-color: white;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
    padding: 10px;
    z-index: 1000;
    /* 确保在其他内容之上 */
}

.sidebar ul {
    list-style-type: none;
    /* 去掉默认的列表样式 */
    padding: 0;
    /* 去掉内边距 */
    margin: 0;
    /* 去掉外边距 */
}

.sidebar li {
    width: 100%;
    /* 确保 li 元素宽度为100% */
    padding: 10px;
    /* 添加内边距 */
    box-sizing: border-box;
    /* 确保内边距不会影响总宽度 */
    border-bottom: 1px solid #ddd;
    /* 添加底部边框 */
    overflow: hidden;
    cursor: pointer;
}

/* 鼠标悬停时的样式 */
.sidebar li:hover {
    background-color: #f0f0f0;
    /* 鼠标悬停时的背景颜色 */
}

.closebutton {
    background: white;
    border: orange;
    font-size: 18px;
    cursor: pointer;
    margin-top: 10px;
    /* 添加顶部外边距 */
}
</style>