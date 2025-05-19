<template>
  <div class="article-detail-page">
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      加载文章失败: {{ error.message }}
    </div>

    <div v-else-if="article" class="article-container">
      <div class="article-header mb-4">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span class="badge bg-secondary">{{ formatDate(article.createdAt) }}</span>
          <span v-if="article.updatedAt && article.updatedAt !== article.createdAt" class="ms-2 text-muted">
            最后更新: {{ formatDate(article.updatedAt) }}
          </span>
        </div>
      </div>

      <div class="article-actions mb-4">
        <router-link :to="`/edit/${article.id}`" class="btn btn-outline-primary me-2">
          <i class="bi bi-pencil-square me-1"></i> 编辑
        </router-link>
        <button @click="confirmDelete" class="btn btn-outline-danger">
          <i class="bi bi-trash-fill me-1"></i> 删除
        </button>
        <router-link to="/" class="btn btn-outline-secondary ms-2">
          返回列表
        </router-link>
      </div>

      <div class="article-content">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="article.content" class="article-content-html"></div>
      </div>
    </div>

    <div v-else class="alert alert-warning" role="alert">
      找不到文章
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const article = ref(null);
const loading = ref(true);
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

async function fetchArticle() {
  const id = route.params.id;
  if (!id) {
    error.value = new Error('未提供文章ID');
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(`http://localhost:3000/articles/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    article.value = await response.json();
  } catch (e) {
    error.value = e;
    console.error(`获取文章 ${id} 失败:`, e);
  } finally {
    loading.value = false;
  }
}

async function confirmDelete() {
  if (!window.confirm('您确定要删除这篇文章吗？')) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/articles/${article.value.id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      let errorData = { message: `HTTP error! status: ${response.status}` };
      try {
        errorData = await response.json();
      } catch (e) { /* Ignore */ }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    router.push('/'); // 删除成功后返回首页
  } catch (e) {
    error.value = e;
    console.error(`删除文章 ${article.value.id} 失败:`, e);
  }
}

onMounted(() => {
  fetchArticle();
});
</script>

<style scoped>
/* 响应式容器样式 */
.article-container {
  width: 100%;
  max-width: 95%;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* 响应式布局: 小屏幕 */
@media (min-width: 576px) {
  .article-container {
    max-width: 90%;
  }
}

/* 响应式布局: 平板屏幕 */
@media (min-width: 768px) {
  .article-container {
    max-width: 80%;
  }
}

/* 响应式布局: 桌面屏幕 */
@media (min-width: 992px) {
  .article-container {
    max-width: 70%;
  }
}

/* 响应式布局: 大屏幕 */
@media (min-width: 1200px) {
  .article-container {
    max-width: 60%;
  }
}

/* 响应式布局: 超大屏幕 */
@media (min-width: 1400px) {
  .article-container {
    max-width: 50%;
  }
}

.article-title {
  color: #343a40;
  margin-bottom: 0.5rem;
  font-size: 2.25rem;
  font-weight: 700;
}

.article-meta {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

/* 文章内容样式 */
.article-content-html {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #333;
}

/* 富文本内容样式 */
.article-content-html ::v-deep(h1),
.article-content-html ::v-deep(h2),
.article-content-html ::v-deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.article-content-html ::v-deep(h1) {
  font-size: 1.75rem;
}

.article-content-html ::v-deep(h2) {
  font-size: 1.5rem;
}

.article-content-html ::v-deep(h3) {
  font-size: 1.25rem;
}

.article-content-html ::v-deep(p) {
  margin-bottom: 1rem;
}

.article-content-html ::v-deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
}

.article-content-html ::v-deep(pre) {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 0.25rem;
  margin: 1rem 0;
  overflow: auto;
}

.article-content-html ::v-deep(blockquote) {
  border-left: 0.25rem solid #adb5bd;
  padding-left: 1rem;
  color: #6c757d;
  margin: 1rem 0;
}

.article-content-html ::v-deep(ul),
.article-content-html ::v-deep(ol) {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.article-content-html ::v-deep(a) {
  color: #0d6efd;
  text-decoration: none;
}

.article-content-html ::v-deep(a:hover) {
  text-decoration: underline;
}
</style>
