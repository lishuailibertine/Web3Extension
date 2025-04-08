import { createRouter, createWebHashHistory } from 'vue-router';
import WalletHome from '../components/home/WalletHome.vue'; // 确保路径正确
import WalletImport from '../components/import/WalletImport.vue'; // 确保路径正确

const routes = [
  {
    path: '/',
    name: 'Home',
    component: WalletHome
  },
  {
    path: '/walletimport',
    name: 'WalletImport',
    component: WalletImport
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