<template>  <!-- 桌面端侧边栏 -->
  <div class="desktop-sidebar d-none d-lg-block animate__animated animate__fadeInLeft">
    <div class="sidebar-content">
      <div class="user-profile text-center">
        <div class="avatar-container animate__animated animate__bounceIn animate__delay-1s">
          <img src="../assets/icon/Master.png" alt="用户头像" class="avatar-img">
        </div>
        <h4 class="user-name mt-3 animate__animated animate__fadeInUp animate__delay-1.5s">WASD09090030</h4>
      </div>
      
      <div class="navigation-buttons">
        <button @click="navigateTo('study')" class="nav-button animate__animated animate__fadeInRight animate__delay-2s">
          <i class="bi bi-book me-2"></i>
          <span>学习</span>
        </button>
        <button @click="navigateTo('game')" class="nav-button animate__animated animate__fadeInRight animate__delay-2.2s">
          <i class="bi bi-controller me-2"></i>
          <span>游戏</span>
        </button>
        <button @click="navigateTo('work')" class="nav-button animate__animated animate__fadeInRight animate__delay-2.4s">
          <i class="bi bi-briefcase me-2"></i>
          <span>个人作品</span>
        </button>
      </div>
        <div class="contact-info mt-4 animate__animated animate__fadeInUp animate__delay-2.6s">
        <h5>联系我：</h5>
        <div class="contact-icons">
          <a href="mailto:qq86280630qq@163.com" class="contact-icon email-icon" title="发送邮件: qq86280630qq@163.com">
            <i class="bi bi-envelope"></i>
          </a>
          <a href="https://github.com/WASD09090030" target="_blank" class="contact-icon github-icon" title="访问GitHub: WASD09090030">
            <i class="bi bi-github"></i>
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- 移动端浮动按钮 -->
  <div class="mobile-personal-info d-lg-none">
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
          <div class="contact-icons">
            <a href="mailto:qq86280630qq@163.com" class="contact-icon email-icon" title="发送邮件: qq86280630qq@163.com">
              <i class="bi bi-envelope"></i>
            </a>
            <a href="https://github.com/WASD09090030" target="_blank" class="contact-icon github-icon" title="访问GitHub: WASD09090030">
              <i class="bi bi-github"></i>
            </a>
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
/* 桌面端侧边栏样式 */
.desktop-sidebar {
  height: 100%;
  position: sticky;
  top: 20px;
}

.desktop-sidebar .sidebar-content {
  background-color: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .desktop-sidebar .sidebar-content {
  background-color: var(--bs-dark);
  border-color: var(--bs-border-color-translucent);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

/* 移动端浮动按钮和侧边栏 */
.mobile-personal-info {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
}

.personal-info-sidebar {
  background-color: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
  border-radius: 15px 0 0 15px;
  box-shadow: -5px 0 20px rgba(0,0,0,0.15);
  padding: 1.5rem;
  transition: all 0.3s ease;
  width: 280px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 999;
  margin-right: 10px;
}

[data-bs-theme="dark"] .personal-info-sidebar {
  background-color: var(--bs-dark);
  border-color: var(--bs-border-color-translucent);
  box-shadow: -5px 0 20px rgba(0,0,0,0.4);
}

.toggle-button {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  z-index: 1001;
  font-size: 1.4rem;
  border: none;
}

.toggle-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.toggle-button:active {
  transform: scale(0.95);
}

/* 通用样式 */
.avatar-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 3px solid var(--bs-primary);
  transition: all 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  margin-top: 1rem;
  font-weight: 600;
  color: var(--bs-body-color);
  font-size: 1.2rem;
}

.navigation-buttons {
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 0.75rem;
}

.nav-button {
  display: flex;
  align-items: center;
  background-color: var(--bs-light);
  border: 1px solid var(--bs-border-color);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  color: var(--bs-body-color);
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

[data-bs-theme="dark"] .nav-button {
  background-color: var(--bs-gray-800);
  border-color: var(--bs-border-color-translucent);
}

.nav-button:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.nav-button:hover:before {
  left: 100%;
}

.nav-button:hover {
  background-color: var(--bs-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(var(--bs-primary-rgb), 0.3);
  border-color: var(--bs-primary);
}

.nav-button i {
  font-size: 1.1rem;
  width: 20px;
}

.contact-info {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--bs-border-color);
}

.contact-info h5 {
  color: var(--bs-body-color);
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.contact-icons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem 0;
}

.contact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.contact-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  transform: scale(0);
  transition: transform 0.3s ease;
}

.contact-icon:hover::before {
  transform: scale(1);
  animation: ripple 0.6s ease-out;
}

.contact-icon i {
  font-size: 1.5rem;
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
}

/* 邮箱图标样式 */
.email-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.email-icon:hover {
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
  color: white;
}

.email-icon:hover i {
  animation: emailBounce 0.6s ease-in-out;
}

/* GitHub图标样式 */
.github-icon {
  background: linear-gradient(135deg, #24292e 0%, #586069 100%);
  color: white;
}

.github-icon:hover {
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 10px 25px rgba(36, 41, 46, 0.4);
  color: white;
  animation: githubPulse 1.5s infinite;
}

.github-icon:hover i {
  animation: githubRotate 0.6s ease-in-out;
}

/* 深色主题适配 */
[data-bs-theme="dark"] .contact-icon {
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

[data-bs-theme="dark"] .email-icon:hover {
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.6);
}

[data-bs-theme="dark"] .github-icon:hover {
  box-shadow: 0 10px 25px rgba(36, 41, 46, 0.6);
}

/* 动画效果 */
@keyframes emailBounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(-15deg); }
  50% { transform: translateY(-4px) rotate(10deg); }
  75% { transform: translateY(-6px) rotate(-5deg); }
}

@keyframes githubRotate {
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.15); }
  50% { transform: rotate(180deg) scale(1); }
  75% { transform: rotate(270deg) scale(1.15); }
  100% { transform: rotate(360deg) scale(1); }
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* 脉冲效果 */
@keyframes pulse {
  0% {
    box-shadow: 0 4px 15px rgba(0,0,0,0.1), 0 0 0 0 rgba(102, 126, 234, 0.7);
  }
  70% {
    box-shadow: 0 4px 15px rgba(0,0,0,0.1), 0 0 0 10px rgba(102, 126, 234, 0);
  }
  100% {
    box-shadow: 0 4px 15px rgba(0,0,0,0.1), 0 0 0 0 rgba(102, 126, 234, 0);
  }
}

@keyframes githubPulse {
  0% {
    box-shadow: 0 10px 25px rgba(36, 41, 46, 0.4), 0 0 0 0 rgba(36, 41, 46, 0.7);
  }
  70% {
    box-shadow: 0 10px 25px rgba(36, 41, 46, 0.4), 0 0 0 10px rgba(36, 41, 46, 0);
  }
  100% {
    box-shadow: 0 10px 25px rgba(36, 41, 46, 0.4), 0 0 0 0 rgba(36, 41, 46, 0);
  }
}

/* 点击效果 */
.contact-icon:active {
  transform: translateY(-2px) scale(0.95);
}

/* 移动端适配 */
@media (max-width: 576px) {
  .contact-icons {
    gap: 1rem;
  }
  
  .contact-icon {
    width: 45px;
    height: 45px;
  }
  
  .contact-icon i {
    font-size: 1.3rem;
  }
}

/* 移动端特殊样式 */
@media (max-width: 991px) {
  .desktop-sidebar {
    display: none !important;
  }
  
  .mobile-personal-info {
    right: 15px;
  }
  
  .personal-info-sidebar {
    width: 260px;
    padding: 1.25rem;
  }
  
  .avatar-container {
    width: 80px;
    height: 80px;
  }
  
  .user-name {
    font-size: 1.1rem;
  }
  
  .nav-button {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
  
  .toggle-button {
    width: 45px;
    height: 45px;
    font-size: 1.2rem;
  }
}

@media (max-width: 576px) {
  .mobile-personal-info {
    right: 10px;
  }
  
  .personal-info-sidebar {
    width: 240px;
    padding: 1rem;
  }
  
  .toggle-button {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
}

/* 滚动条样式 */
.personal-info-sidebar::-webkit-scrollbar {
  width: 6px;
}

.personal-info-sidebar::-webkit-scrollbar-track {
  background: var(--bs-light);
  border-radius: 3px;
}

.personal-info-sidebar::-webkit-scrollbar-thumb {
  background: var(--bs-secondary);
  border-radius: 3px;
}

.personal-info-sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--bs-primary);
}

[data-bs-theme="dark"] .personal-info-sidebar::-webkit-scrollbar-track {
  background: var(--bs-gray-800);
}

[data-bs-theme="dark"] .personal-info-sidebar::-webkit-scrollbar-thumb {
  background: var(--bs-gray-600);
}
</style>
