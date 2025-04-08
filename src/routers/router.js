import { createRouter, createWebHashHistory } from 'vue-router';
import WalletHome from '../components/home/WalletHome.vue'; // 确保路径正确
import WalletImport from '../components/import/WalletImport.vue'; // 确保路径正确
import WalletConfirmPsd from '@/components/import/WalletConfirmPsd.vue';
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

export default router;