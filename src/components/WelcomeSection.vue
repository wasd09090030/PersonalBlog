<template>  <div class="welcome-section">
    <div class="welcome-content">
      <h1 class="welcome-title">欢迎访问</h1>
      <p class="welcome-text">这里是我的个人博客，记录学习、游戏和个人作品</p>
      
      <div class="category-links mt-4">
        <router-link to="/?category=study" class="category-link study">
          <i class="bi bi-book me-2"></i>学习
        </router-link>
        <router-link to="/?category=game" class="category-link game">
          <i class="bi bi-controller me-2"></i>游戏
        </router-link>
        <router-link to="/?category=work" class="category-link work">
          <i class="bi bi-briefcase me-2"></i>个人作品
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// 无需额外逻辑
</script>

<style scoped>
.welcome-section {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 2rem 1rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.welcome-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: #343a40;
}

.welcome-text {
  font-size: 1.1rem;
  color: #6c757d;
}

.category-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.category-link {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.25rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.category-link.study {
  background-color: #e3f2fd;
  color: #0d6efd;
}

.category-link.game {
  background-color: #fff8e1;
  color: #ff9800;
}

.category-link.work {
  background-color: #e8f5e9;
  color: #4caf50;
}

.category-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

@media (max-width: 576px) {
  .welcome-title {
    font-size: 1.5rem;
  }
  .welcome-text {
    font-size: 1rem;
  }
  
  .category-link {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
