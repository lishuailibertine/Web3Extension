import { createRouter, createWebHashHistory } from 'vue-router';
import WalletHome from '../components/home/WalletHome.vue'; // 确保路径正确
import WalletImport from '../components/import/WalletImport.vue'; // 确保路径正确
import WalletConfirmPsd from '@/components/import/WalletConfirmPsd.vue';
import keystoreManage from '@/eth/util/keystoreManage';
import handleRuntimeMessage from '@/eth/util/handleRuntimeMessage';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: WalletImport
  },
  {
    path: '/walletimport',
    name: 'WalletImport',
    component: WalletImport
  },
  {
    path: '/psdconfirm',
    name: 'WalletConfirmPsd',
    component: WalletConfirmPsd
  },
  {
    path: '/wallethome',
    name: 'WalletHome',
    component: WalletHome
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});
// 添加导航守卫
router.beforeEach(async (to, from, next) => {
  await keystoreManage.initDB(); // 初始化数据库
  handleRuntimeMessage(); // 处理消息
  
  const wallets = (await keystoreManage.getAllWallets()).wallets; // 检查本地存储中是否有钱包
  if (to.name === 'Home') {
    if (wallets !== undefined && wallets.length > 0) {
      next({ name: 'WalletHome' }); // 如果有钱包，跳转到 WalletHome
      // next();
    } else {
      next(); // 否则继续到 WalletImport
    }
  } else {
    next(); // 其他路由正常跳转
  }
});
export default router;