<template>
  <div class="article-list-page">
    <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
      <h2 class="mb-0">文章列表</h2>
      <router-link to="/add" class="btn btn-success">
        <i class="bi bi-plus-circle-fill me-2"></i>撰写新文章
      </router-link>
    </div>
    
    <div v-if="error" class="alert alert-danger" role="alert">
      加载或操作文章失败: {{ error.message }}
    </div>
    
    <div v-if="articles.length" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="article in articles" :key="article.id" class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-primary">{{ article.title }}</h5>
            <div class="mb-2">
              <span class="badge bg-secondary text-white">{{ formatDate(article.createdAt) }}</span>
            </div>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="article.content" class="article-content-html flex-grow-1 mb-3"></div>
            <div class="mt-auto d-flex justify-content-end">
              <router-link :to="`/edit/${article.id}`" class="btn btn-sm btn-outline-primary me-2">
                <i class="bi bi-pencil-square me-1"></i> 编辑
              </router-link>
              <button @click="deleteArticle(article.id)" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash-fill me-1"></i> 删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="alert alert-info text-center" role="alert">
      暂无文章
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const articles = ref([]);
const error = ref(null);

// 格式化日期的辅助函数
function formatDate(dateString) {
  if (!dateString) return '未知日期';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

async function fetchArticles() {
  error.value = null;
  try {
    const response = await fetch('http://localhost:3000/articles');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    articles.value = await response.json();
  } catch (e) {
    error.value = e;
    console.error("获取文章失败:", e);
  }
}

async function deleteArticle(id) {
  if (!window.confirm('您确定要删除这篇文章吗？')) {
    return;
  }
  error.value = null;
  try {
    const response = await fetch(`http://localhost:3000/articles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      let errorData = { message: `HTTP error! status: ${response.status}` };
      try {
        errorData = await response.json();
      } catch (e) { /* Ignore */ }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    await fetchArticles(); // Refresh the list
  } catch (e) {
    error.value = e;
    console.error(`删除文章 ${id} 失败:`, e);
  }
}

onMounted(() => {
  fetchArticles();
});
</script>

<style scoped>
.article-list-page {
  /* 移除了之前的自定义背景和边框，让 Bootstrap 的 .container 或页面背景生效 */
  padding-top: 20px; /* 添加一些顶部内边距 */
}

/* .page-header, .actions, .action-button 等样式被 Bootstrap 类替代或不再需要 */

.article-content-html {
  line-height: 1.6;
  max-height: 200px; /* 调整预览高度 */
  overflow: hidden;
  position: relative;
  /* 移除自定义的渐变遮罩，如果需要可以重新设计或使用其他方法 */
}

/* 如果需要，可以保留或调整之前针对 v-html 内容的样式 */
.article-content-html ::v-deep(h1),
.article-content-html ::v-deep(h2),
.article-content-html ::v-deep(h3),
.article-content-html ::v-deep(h4),
.article-content-html ::v-deep(h5),
.article-content-html ::v-deep(h6) {
  margin-top: 0.7em;
  margin-bottom: 0.3em;
  font-size: 1.25rem; /* 调整标题大小以适应卡片 */
}

.article-content-html ::v-deep(p) {
  margin-bottom: 0.4em;
  font-size: 0.9rem;
}

.article-content-html ::v-deep(ul),
.article-content-html ::v-deep(ol) {
  padding-left: 1.5em;
  font-size: 0.9rem;
}

.article-content-html ::v-deep(pre) {
  background-color: #f8f9fa; /* 使用 Bootstrap 的浅色背景 */
  padding: 0.5em;
  border-radius: 0.25rem;
  font-size: 0.85rem;
}

.article-content-html ::v-deep(code) {
  font-size: 0.85em;
  color: #d63384; /* Bootstrap 的代码颜色 */
}

.article-content-html ::v-deep(blockquote) {
  border-left: 0.25rem solid #adb5bd; /* Bootstrap 的边框颜色 */
  padding-left: 1rem;
  color: #6c757d; /* Bootstrap 的次要文本颜色 */
  font-size: 0.9rem;
}

.card-title {
  font-weight: 500;
}

/* 确保卡片内的按钮在底部对齐 */
.card-body {
  display: flex;
  flex-direction: column;
}

.article-content-html {
  flex-grow: 1;
}

/* 如果需要 Bootstrap 图标，请确保已安装 bootstrap-icons */
/* 例如: npm install bootstrap-icons */
/* 并在 main.js 中导入: import 'bootstrap-icons/font/bootstrap-icons.css'; */
</style>
