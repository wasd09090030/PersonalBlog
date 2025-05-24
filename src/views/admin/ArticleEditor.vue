<template>
  <div class="article-editor">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>{{ isEdit ? '编辑文章' : '创建文章' }}</h2>
      <button class="btn btn-outline-secondary" @click="goBack">
        <i class="bi bi-arrow-left me-2"></i>返回
      </button>
    </div>

    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>
        
        <form v-else @submit.prevent="saveArticle">
          <div class="mb-3">
            <label for="title" class="form-label">标题</label>
            <input 
              type="text" 
              class="form-control" 
              id="title" 
              v-model="articleForm.title" 
              required
            >
          </div>
          
          <!-- 添加文章类别选择 -->
          <div class="mb-3">
            <label for="category" class="form-label">文章类别</label>
            <select 
              class="form-select" 
              id="category" 
              v-model="articleForm.category"
              required
            >
              <option value="study">学习</option>
              <option value="game">游戏</option>
              <option value="work">个人作品</option>
              <option value="other">其他</option>
            </select>
          </div>
          
          <div class="mb-3">
            <label for="contentMarkdown" class="form-label">内容 (Markdown)</label>
            <textarea 
              class="form-control" 
              id="contentMarkdown" 
              v-model="articleForm.contentMarkdown"
              rows="15" 
              required
            ></textarea>
          </div>
          
          <div class="mb-3">
            <label class="form-label">预览</label>
            <div class="preview-container border rounded p-3">
              <div v-html="htmlPreview"></div>
            </div>
          </div>
          
          <div class="d-flex justify-content-between">
            <button type="button" class="btn btn-outline-secondary" @click="goBack">取消</button>
            <button type="submit" class="btn btn-primary" :disabled="isSaving">
              <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" role="status"></span>
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import articleService from '../../services/articleService';
import MarkdownIt from 'markdown-it';

const route = useRoute();
const router = useRouter();
const md = new MarkdownIt();

const articleForm = ref({
  title: '',
  contentMarkdown: '',
  category: 'study', // 默认类别
});

const loading = ref(false);
const isSaving = ref(false);
const isEdit = computed(() => !!route.params.id);

// 转换Markdown为HTML的计算属性
const htmlPreview = computed(() => {
  return md.render(articleForm.value.contentMarkdown || '');
});

// 获取文章详情
const fetchArticle = async (id) => {
  loading.value = true;
  try {
    const article = await articleService.getArticleById(id);
    articleForm.value = {
      title: article.title,
      contentMarkdown: article.contentMarkdown || article.content, // 兼容没有markdown字段的旧数据
      category: article.category || 'study', // 兼容没有类别字段的旧数据
    };
  } catch (error) {
    console.error('获取文章失败:', error);
    alert('获取文章失败: ' + error.message);
    goBack();
  } finally {
    loading.value = false;
  }
};

// 保存文章
const saveArticle = async () => {
  isSaving.value = true;
  
  try {
    // 将Markdown转换为HTML
    const htmlContent = md.render(articleForm.value.contentMarkdown);
    
    const payload = {
      title: articleForm.value.title,
      contentMarkdown: articleForm.value.contentMarkdown,
      content: htmlContent,
      category: articleForm.value.category, // 添加类别字段
    };
    
    if (isEdit.value) {
      // 更新现有文章
      await articleService.updateArticle(route.params.id, payload);
      alert('文章已成功更新！');
    } else {
      // 创建新文章
      await articleService.createArticle(payload);
      alert('文章已成功创建！');
    }
    
    // 返回到文章列表
    router.push({ name: 'ArticleManager' });
  } catch (error) {
    console.error('保存文章失败:', error);
    alert('保存文章失败: ' + error.message);
  } finally {
    isSaving.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.push({ name: 'ArticleManager' });
};

// 当组件加载时，如果是编辑模式则获取文章详情
onMounted(() => {
  if (isEdit.value) {
    fetchArticle(route.params.id);
  }
});
</script>

<style scoped>
.preview-container {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  background-color: #fff;
}

textarea {
  font-family: monospace;
}
</style>
