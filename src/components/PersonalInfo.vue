<template>
  <div class="sidebar-container">
    <!-- 侧边栏内容 -->
    <div class="personal-info-sidebar" v-show="!isCollapsed">
      <div class="sidebar-content">
        <div class="user-profile text-center">
          <div class="avatar-container">
            <img src="../assets/icon/Master.png" alt="用户头像" class="avatar-img">
          </div>
          <h4 class="user-name mt-3">WASD09090030</h4>
        </div>
        
        <div class="navigation-buttons">
          <button @click="navigateTo('study')" class="nav-button">
            <i class="bi bi-book me-2"></i>
            <span>学习</span>
          </button>
          <button @click="navigateTo('game')" class="nav-button">
            <i class="bi bi-controller me-2"></i>
            <span>游戏</span>
          </button>
          <button @click="navigateTo('work')" class="nav-button">
            <i class="bi bi-briefcase me-2"></i>
            <span>个人作品</span>
          </button>
        </div>
        
        <div class="contact-info mt-4">
          <h5>联系我：</h5>
          <div class="email-container">
            <i class="bi bi-envelope me-2"></i>
            <span>xxxxx@163.com</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="toggle-button" @click="toggleCollapse">
      <i class="bi" :class="isCollapsed ? 'bi-person-circle' : 'bi-x-circle'"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isCollapsed = ref(true); // 默认收起状态

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  
  // 可以选择保存用户的偏好
  localStorage.setItem('sidebarState', isCollapsed.value ? 'collapsed' : 'expanded');
};

// 点击页面其他区域自动收起侧边栏
const handleClickOutside = (event) => {
  const sidebarContainer = document.querySelector('.sidebar-container');
  if (!isCollapsed.value && sidebarContainer && !sidebarContainer.contains(event.target)) {
    isCollapsed.value = true;
  }
};

// 导航到不同分类的文章
const navigateTo = (category) => {
  router.push({
    name: 'ArticleList',
    query: { category }
  });
  
  // 导航后自动收起侧边栏（移动设备上特别有用）
  isCollapsed.value = true;
};

// 监听页面点击事件，以便在点击页面其他区域时收起侧边栏
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
  // 恢复用户偏好设置
  const savedState = localStorage.getItem('sidebarState');
  if (savedState) {
    isCollapsed.value = savedState === 'collapsed';
  }
});

// 组件卸载时清理事件监听器
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.sidebar-container {
  position: fixed;
  right: 0;
  top: 180px;
  z-index: 1000;
  display: flex;
}

.personal-info-sidebar {
  background-color: #fff;
  border-radius: 10px 0 0 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  padding: 20px;
  transition: all 0.3s ease;
  width: 270px;
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  z-index: 999;
}

.toggle-button {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #96a1b4;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 3px 3px 10px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  z-index: 1001;
  font-size: 1.2rem;
}

.toggle-button:hover {
  background-color: #686b70;
  transform: scale(1.05);
}

.avatar-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  margin-top: 15px;
  font-weight: 600;
  color: #343a40;
}

.navigation-buttons {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  gap: 10px;
}

.nav-button {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.nav-button:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.contact-info {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.email-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
  color: #6c757d;
}
</style>
