<template>
  <div class="article-list-page">    <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
      <h2 class="mb-0">{{ pageTitle }}</h2>
    </div>
    
    <div v-if="error" class="alert alert-danger" role="alert">
      加载或操作文章失败: {{ error.message }}
    </div>
    
    <div v-if="route.query.search" class="mb-4">
      <div class="alert alert-info">
        搜索结果： "{{ route.query.search }}"
        <button class="btn btn-sm btn-outline-secondary ms-3" @click="clearSearch">
          <i class="bi bi-x-circle me-1"></i>清除搜索
        </button>
      </div>
    </div>
    
    <!-- 当在首页且不是搜索状态时显示分类文章 -->
    <template v-if="!route.query.search && !route.query.category">      <article-section 
        :articles="studyArticles" 
        title="学习" 
      />
      
      <article-section 
        :articles="gameArticles" 
        title="游戏" 
      />
      
      <article-section 
        :articles="workArticles" 
        title="个人作品" 
      />
    </template>
    
    <!-- 当在搜索状态或特定分类时显示结果 -->
    <template v-else>
      <div v-if="filteredArticles.length" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="article in filteredArticles" :key="article.id" class="col">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <router-link :to="`/article/${article.id}`" class="article-title-link">
                <h5 class="card-title text-primary">{{ article.title }}</h5>
              </router-link>
              <div class="mb-2">
                <span class="badge bg-secondary text-white">{{ formatDate(article.createdAt) }}</span>
              </div>
              <div class="article-content-preview flex-grow-1 mb-3">
                <div class="content-mask">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div v-html="article.content" class="article-content-html"></div>
                </div>
              </div>              <router-link :to="`/article/${article.id}`" class="btn btn-link text-primary p-0 mb-2 align-self-start">
                阅读更多...
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="alert alert-info text-center" role="alert">
        {{ route.query.search ? '没有找到匹配的文章' : '该分类下暂无文章' }}
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ArticleSection from './ArticleSection.vue';
import './ArticleList.styles.css';

const articles = ref([]);
const error = ref(null);
const route = useRoute();
const router = useRouter();

// 根据路由参数计算页面标题
const pageTitle = computed(() => {
  if (route.query.search) return '搜索结果';
  if (route.query.category === 'study') return '学习';
  if (route.query.category === 'game') return '游戏';
  if (route.query.category === 'work') return '个人作品';
  return '文章列表';
});

// 根据类别筛选文章
const studyArticles = computed(() => {
  return articles.value.filter(article => {
    // 使用实际的文章类别属性进行过滤
    return article.category === 'study';
  }).slice(0, 6); // 最多显示6篇
});

const gameArticles = computed(() => {
  return articles.value.filter(article => {
    // 使用实际的文章类别属性进行过滤
    return article.category === 'game';
  }).slice(0, 6); // 最多显示6篇
});

const workArticles = computed(() => {
  return articles.value.filter(article => {
    // 使用实际的文章类别属性进行过滤
    return article.category === 'work';
  }).slice(0, 6); // 最多显示6篇
});

// 根据搜索关键词或分类筛选文章
const filteredArticles = computed(() => {
  if (route.query.search) {
    const searchTerm = route.query.search.toLowerCase();
    return articles.value.filter(article => {
      return article.title.toLowerCase().includes(searchTerm) ||
             (article.contentMarkdown && article.contentMarkdown.toLowerCase().includes(searchTerm)) ||
             article.content.toLowerCase().includes(searchTerm);
    });  } else if (route.query.category) {
    // 直接使用路由参数中的category值过滤文章
    return articles.value.filter(article => article.category === route.query.category);
  }
  return articles.value;
});

// 清除搜索
const clearSearch = () => {
  router.push({ name: 'ArticleList' });
};

// 格式化日期的辅助函数
function formatDate(dateString) {
  if (!dateString) return '未知日期';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
}

// 监听路由变化，重新获取文章
watch(() => route.query, () => {
  fetchArticles();
}, { deep: true });

async function fetchArticles() {
  error.value = null;
  try {
    // 导入文章服务
    const articleService = (await import('../services/articleService.js')).default;
    // 直接使用导入的服务实例，无需再次实例化
    
    // 如果存在类别参数，使用它过滤文章
    if (route.query.category) {
      articles.value = await articleService.getArticlesByCategory(route.query.category);
    } else {
      // 否则获取所有文章
      articles.value = await articleService.getArticles();
    }
  } catch (e) {
    error.value = e;
    console.error("获取文章失败:", e);
  }
}

// 删除文章功能已移除

onMounted(() => {
  fetchArticles();
});
</script>
