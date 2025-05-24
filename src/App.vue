<template>
  <div id="app" class="bg-light min-vh-100">
    <!-- 导航栏 -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">我的个人博客</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item">
              <router-link to="/" class="nav-link" active-class="active">首页</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    <!-- 搜索栏 -->
    <div class="search-container py-3 bg-white shadow-sm">
      <div class="container-fluid">
        <SearchBar />
      </div>
    </div>

    <!-- 欢迎区域 -->
    <div class="container-fluid mt-4">
      <WelcomeSection />
    </div>
    
    <!-- 主内容区 -->
    <div class="container-fluid mt-4">
      <main>
        <router-view></router-view> <!-- 路由匹配的组件将在这里渲染 -->
      </main>
    </div>
    
    <!-- 悬浮侧边栏个人信息 -->
    <PersonalInfo />

    <!-- 音乐播放器 -->
    <MusicPlayer />

    <!-- Toast通知组件 -->
    <Toast />
  </div>
</template>

<script setup>
import SearchBar from './components/SearchBar.vue';
import WelcomeSection from './components/WelcomeSection.vue';
import PersonalInfo from './components/PersonalInfo.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import Toast from './components/Toast.vue';
</script>

<style scoped>
/* 全局样式 */
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 导航栏样式 */
.navbar-brand {
  font-weight: bold;
  letter-spacing: 0.5px;
}

.nav-link.active {
  font-weight: bold;
}

/* 搜索容器 */
.search-container {
  background-color: white;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  padding: 15px 0;
}

/* 主要内容区域 */
main {
  padding-bottom: 60px; /* 为底部添加一些空间，避免被音乐播放器遮挡 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .search-container {
    padding: 10px 0;
  }
}
</style>
