<template>
    <div class="container">
        <div class="header">
            <h1>{{ dappName }}</h1>
        </div>
        <div class="wallet-info">
            <div class="wallet">
                <div class="wallet-details">
                    <span class="wallet-name">{{ walletName }}</span>
                    <span class="wallet-address">{{ walletAddress }}</span>
                </div>
            </div>
        </div>
        <div class="buttons">
            <button @click="goBack" class="cancel-button">取消</button>
            <button @click="connect" class="connect-button">连接</button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import keystoreManage from '@/eth/util/keystoreManage';
export default {
    name: 'RequestLogin',
    setup() {
        const selectedWallet = localStorage.getItem("selectedWallet");
        const dappName = ref('Dapp Name');
        const walletName = ref('walletName');
        const walletAddress = ref('0x11111...11111');
        const router = useRouter();

        const formatWalletAddress = (address) => {
            if (address.length <= 8) {
                return address;
            }
            const start = address.slice(0, 6);
            const end = address.slice(-4);
            return `${start}...${end}`;
        };
        const init = async () => {
            // 获取钱包信息
            const keystore = (await keystoreManage.getKeystore(selectedWallet)).keystore;
            walletName.value = keystore.walletName;
            walletAddress.value = formatWalletAddress(keystore.address);
        };
        const goBack = () => {
            router.back(); // 返回到上一个页面
        };

        const connect = () => {
            // 连接逻辑
            console.log("连接钱包");
        };
        init();
        return {
            dappName,
            walletName,
            walletAddress,
            goBack,
            connect
        };
    }
};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 300px;
    height: 450px;
    background-color: #f9f9f9;
    margin-top: 20px;
}

.header {
    margin-bottom: 20px;
}

.wallet-info {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 300px;
    text-align: center;
    box-sizing: border-box;
}

.wallet {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.wallet-details {
    text-align: left;
}

.wallet-name {
    font-weight: bold;
}

.wallet-address {
    color: #888;
    margin-left: 14px;
}

.buttons {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 40px;
    padding: 0px 20px;
    gap: 60px;
    /* 设置按钮之间的间距 */
}

.cancel-button,
.connect-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.cancel-button {
    background-color: #f44336;
    /* Red */
    color: white;
}

.connect-button {
    background-color: #4CAF50;
    /* Green */
    color: white;
}
</style>