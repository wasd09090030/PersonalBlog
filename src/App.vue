<template>
  <div id="app" class="bg-light min-vh-100">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">我的个人博客</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link" active-class="active">首页</router-link>
            </li>
            <li class="nav-item" v-if="isAdmin">
              <router-link to="/add" class="nav-link" active-class="active">添加文章</router-link>
            </li>
            <li class="nav-item ms-2">
              <RoleSelectionModal />
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container-fluid mt-4">
      <main>
        <router-view></router-view> <!-- 路由匹配的组件将在这里渲染 -->
      </main>
    </div>

    <!-- Toast通知组件 -->
    <Toast />
  </div>
</template>

<script setup>
import RoleSelectionModal from './components/RoleSelectionModal.vue';
import Toast from './components/Toast.vue';
import auth from './store/auth';
import { computed } from 'vue';

// 计算属性：是否为管理员
const isAdmin = computed(() => auth.isAdmin());
</script>

<style scoped>
/* .container 样式现在由 Bootstrap 控制，如果需要特定覆盖，可以在这里添加 */
/* 例如，如果想保持之前的最大宽度，可以取消注释下面的代码 */
/*
.container {
  max-width: 1400px; 
}
*/

/* 移除了旧的 header 样式，因为现在使用 Bootstrap navbar */

/* 可以添加一些全局的自定义样式来补充 Bootstrap */
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.navbar-brand {
  font-weight: bold;
}

.nav-link.active {
  font-weight: bold;
}

main {
  padding-bottom: 40px; /* 为底部添加一些空间 */
}
</style>
