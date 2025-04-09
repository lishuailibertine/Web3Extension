<template>
    <div class="wallet-confirm-psd-container">
    <button class="back-button" @click="goBack">← 返回</button>
      <h1 class="title">设置钱包密码</h1>
      <p class="description">此密码用于解锁钱包，我们无法为你恢复此密码</p>
      
        <div class="input-container">
            <label for="wallet-name">钱包名称</label>
            <input type="text" id="wallet-name" v-model="walletName" placeholder="请输入钱包名称" />    
        </div>
      <div class="input-container">
        <label for="password">密码</label>
        <input type="password" id="password" v-model="password" placeholder="最少输入 8 个字符" />
      </div>
      
      <div class="input-container">
        <label for="confirm-password">确认密码</label>
        <input type="password" id="confirm-password" v-model="confirmPassword" placeholder="请再次输入确认" />
      </div>
      
      <button class="confirm-button" @click="confirmPasswordSetting">确认</button>
    </div>
  </template>
  
  <script>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import keystoreManage from '@/eth/util/keystoreManage';
export default {
  name: 'WalletConfirmPsd',
  setup() {
    const router = useRouter();
    // 钱包名字
    const walletName = ref('MyWallet');
    const password = ref('');
    const confirmPassword = ref('');

    const goBack = () => {
      router.back(); // 返回到上一个页面
    };

    const confirmPasswordSetting = async () => {
      if (password.value.length < 8) {
        alert('密码至少需要 8 个字符');
        return;
      }
      if (password.value !== confirmPassword.value) {
        alert('两次输入的密码不一致');
        return;
      }
      // 随机生成钱包
      await keystoreManage.createWallet(walletName.value, password.value);

      //钱包创建完毕 跳转到首页
      router.push({ name: 'WalletHome' });
    };

    return {
      walletName,
      password,
      confirmPassword,
      goBack,
      confirmPasswordSetting
    };
  }
};
</script>
  
  <style scoped>
  .wallet-confirm-psd-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 400px;
    height: 750px; 
    background-color: #000; /* 背景颜色 */
    color: #fff; /* 字体颜色 */
    text-align: center; /* 文本居中 */
    overflow: hidden; /* 控制溢出内容 */
  }
  
  .back-button {
  align-self: flex-start; /* 左对齐 */
  background: none; /* 无背景 */
  color: #fff; /* 字体颜色 */
  border: none; /* 无边框 */
  cursor: pointer; /* 鼠标指针 */
  font-size: 16px; /* 字体大小 */
  margin-top: 12px;
  margin-bottom: 20px; /* 与标题之间的间距 */
}


  .title {
    font-size: 24px; /* 标题字体大小 */
    margin-bottom: 20px; /* 标题与描述之间的间距 */
  }
  
  .description {
    margin-bottom: 40px; /* 描述与输入框之间的间距 */
  }
  
  .input-container {
    width: 80%; /* 输入框宽度 */
    margin-bottom: 20px; /* 输入框之间的间距 */
  }
  
  label {
    display: block; /* 标签块级显示 */
    margin-bottom: 5px; /* 标签与输入框之间的间距 */
  }
  
  input {
    width: 100%; /* 输入框宽度 */
    padding: 10px; /* 输入框内边距 */
    border: none; /* 去掉边框 */
    border-radius: 5px; /* 圆角 */
    background-color: #333; /* 输入框背景颜色 */
    color: #fff; /* 输入框字体颜色 */
  }
  
  .confirm-button {
    padding: 15px 20px; /* 按钮内边距 */
    font-size: 18px; /* 按钮字体大小 */
    color: white;
    background-color: #007bff; /* 按钮背景颜色 */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s; /* 添加过渡效果 */
  }
  
  .confirm-button:hover {
    background-color: #0056b3; /* 悬停时的背景颜色 */
  }
  </style>