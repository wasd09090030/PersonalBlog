<template>
  <div class="admin-dashboard">
    <h2 class="mb-4">仪表板</h2>
    
    <div class="row">
      <div class="col-md-6 col-lg-3 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">文章统计</h5>
            <div v-if="loading" class="text-center">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <div v-else class="d-flex align-items-center">
              <span class="display-4 me-2">{{ articleCount }}</span>
              <span class="text-muted">篇</span>
            </div>
            <router-link to="/admin/articles" class="btn btn-sm btn-outline-primary mt-3">
              管理文章
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-3 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">快速操作</h5>
            <div class="list-group list-group-flush">
              <button 
                class="list-group-item list-group-item-action"
                @click="$router.push('/admin/articles')"
              >
                <i class="bi bi-list me-2"></i>查看所有文章
              </button>
              <button 
                class="list-group-item list-group-item-action"
                @click="createArticle"
              >
                <i class="bi bi-plus-circle me-2"></i>创建新文章
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-12 col-lg-6 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">最近文章</h5>
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <div v-else-if="latestArticles.length === 0" class="text-center py-4 text-muted">
              暂无文章
            </div>
            <div v-else class="list-group list-group-flush">
              <a 
                v-for="article in latestArticles" 
                :key="article.id"
                :href="`/article/${article.id}`"
                target="_blank"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              >
                <span class="text-truncate me-3">{{ article.title }}</span>
                <small class="text-muted">{{ formatDate(article.createdAt) }}</small>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import articleService from '../../services/articleService';

const router = useRouter();
const loading = ref(true);
const articleCount = ref(0);
const latestArticles = ref([]);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('zh-CN');
};

const createArticle = () => {
  router.push({ name: 'ArticleEditor' });
};

const fetchDashboardData = async () => {
  loading.value = true;
  try {
    // 获取所有文章
    const articles = await articleService.getArticles();
    
    // 设置文章计数
    articleCount.value = articles.length;
    
    // 获取最新的5篇文章
    latestArticles.value = articles
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  } catch (error) {
    console.error('获取仪表板数据失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.list-group-item-action {
  cursor: pointer;
}
</style>
