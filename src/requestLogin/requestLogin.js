import { createApp } from 'vue'
import App from './App.vue'
import requestLogin from '../routers/requestLogin'
const app = createApp(App)
app.use(requestLogin)
app.mount('#app')
