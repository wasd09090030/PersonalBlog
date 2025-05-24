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
        class="btn btn-secondary" 
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
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  border-radius: 25px 0 0 25px;
  border: 1px solid #ced4da;
  padding-left: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-color: #80bdff;
}

.btn {
  border-radius: 0 25px 25px 0;
}
</style>
