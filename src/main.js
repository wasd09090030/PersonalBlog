import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'; // 导入 Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // 导入 Bootstrap JS (包含 Popper)
import 'bootstrap-icons/font/bootstrap-icons.css'; // 导入 Bootstrap 图标

import router from './router'; // 导入路由

// md-editor-v3 不需要全局注册，它是一个组件形式导入

const app = createApp(App)
app.use(router); // 使用路由
app.mount('#app')
