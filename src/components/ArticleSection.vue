<template>
  <div class="article-section">
    <h2 class="section-title">{{ title }}</h2>
    <div v-if="articles.length" class="row row-cols-1 row-cols-md-2 g-4">
      <div v-for="article in articles" :key="article.id" class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <router-link :to="`/article/${article.id}`" class="article-title-link">
              <h5 class="card-title text-primary">{{ article.title }}</h5>
            </router-link>            <div class="mb-2">
              <span class="badge" :class="getCategoryBadgeClass(article.category)" v-if="article.category">
                {{ getCategoryName(article.category) }}
              </span>
              <span class="badge bg-secondary text-white ms-1">{{ formatDate(article.createdAt) }}</span>
            </div>
            <div class="article-content-preview flex-grow-1 mb-3">
              <div class="content-mask">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div v-html="article.content" class="article-content-html"></div>
              </div>
            </div>            <router-link :to="`/article/${article.id}`" class="btn btn-link text-primary p-0 mb-2 align-self-start">
              阅读更多...
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-info text-center" role="alert">
      该分类下暂无文章
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  articles: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

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

// 获取分类名称
function getCategoryName(category) {
  const categoryMap = {
    'study': '学习',
    'game': '游戏',
    'work': '个人作品',
    'other': '其他'
  };
  return categoryMap[category] || '未分类';
}

// 获取分类徽章样式
function getCategoryBadgeClass(category) {
  const classMap = {
    'study': 'bg-primary',
    'game': 'bg-warning text-dark',
    'work': 'bg-success',
    'other': 'bg-secondary'
  };
  return classMap[category] || 'bg-secondary';
}
</script>

<style scoped>
.article-section {
  margin-bottom: 3rem;
}

.section-title {
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
  font-weight: bold;
  color: #343a40;
}

.article-title-link {
  text-decoration: none;
}

.article-title-link:hover h5 {
  color: #0b5ed7;
}

.article-content-preview {
  position: relative;
  overflow: hidden;
  max-height: 150px;
}

.content-mask {
  position: relative;
  height: 100%;
}

.content-mask:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
}

.article-content-html {
  font-size: 0.9rem;
  color: #6c757d;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
</style>
