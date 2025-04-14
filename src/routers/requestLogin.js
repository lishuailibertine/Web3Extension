import { createRouter, createWebHashHistory } from 'vue-router';
import requestLogin from '../components/requestLogin/requestLogin.vue'; // 确保路径正确
import keystoreManage from '@/eth/util/keystoreManage';
import handleRuntimeMessage from '@/eth/util/handleRuntimeMessage';
const routes = [
  {
    path: '/',
    name: 'requestLogin',
    component: requestLogin
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});
// 添加导航守卫
router.beforeEach(async (to, from, next) => {
  await keystoreManage.initDB(); // 初始化数据库
  next();
});
export default router;