// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import WalletHome from '@/components/WalletHome.vue'; // 导入 WalletHome 组件

const routes = [
  {
    path: '/wallethome',
    name: 'WalletHome',
    component: WalletHome
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;