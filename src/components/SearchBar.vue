<template>
  <div class="search-bar-container">
    <div class="input-group">
      <input 
        type="text" 
        class="form-control search-input" 
        placeholder="搜索文章..." 
        v-model="searchQuery"
        @keyup.enter="search"
      >
      <button 
        class="btn btn-outline-light search-btn" 
        type="button" 
        @click="search"
      >
        <i class="bi bi-search"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');

// 搜索方法
const search = () => {
  if (searchQuery.value.trim()) {
    // 跳转到搜索结果页面，携带搜索关键词
    router.push({
      name: 'ArticleList',
      query: { search: searchQuery.value.trim() }
    });
  }
};
</script>

<style scoped>
.search-bar-container {
  width: 100%;
  max-width: 100%;
}

/* 暗色主题和默认样式（导航栏为深色时） */
.search-input {
  border-radius: 20px 0 0 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  padding-left: 16px;
  box-shadow: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-input:focus {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
}

.search-btn {
  border-radius: 0 20px 20px 0;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-left: none;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.2s ease;
}

.search-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
}

.search-btn:focus {
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
}

/* 亮色主题适配（导航栏为天蓝色时） */
:global(.light-theme) .search-input {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  color: #ffffff;
}

:global(.light-theme) .search-input::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

:global(.light-theme) .search-input:focus {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.6);
  color: #ffffff;
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
}

:global(.light-theme) .search-btn {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  color: #ffffff;
}

:global(.light-theme) .search-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.6);
  color: #ffffff;
}

:global(.light-theme) .search-btn:focus {
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
}

/* 暗色主题适配 */
:global([data-bs-theme="dark"]) .search-input {
  background-color: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

:global([data-bs-theme="dark"]) .search-input:focus {
  background-color: rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.4);
}

:global([data-bs-theme="dark"]) .search-btn {
  background-color: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

:global([data-bs-theme="dark"]) .search-btn:hover {
  background-color: rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.4);
}
</style>
