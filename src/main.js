import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'; // 导入 Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // 导入 Bootstrap JS (包含 Popper)
import 'bootstrap-icons/font/bootstrap-icons.css'; // 导入 Bootstrap 图标

import router from './router'; // 导入路由

const app = createApp(App)
app.use(router); // 使用路由
app.mount('#app')
