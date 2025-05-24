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
            <label class="form-label">内容 (Markdown编辑器)</label>
            <MdEditor
              v-model="articleForm.contentMarkdown"
              height="500px"
              :toolbars="toolbars"
              preview-theme="github"
              code-theme="github"
              language="zh-CN"
              @onChange="handleContentChange"
              required
            />
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

// 导入 md-editor-v3 编辑器及其样式
import { MdEditor, config } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

// 设置中文界面
config({
  editorConfig: {
    languageUserDefined: {
      'zh-CN': {
        toolbarTips: {
          bold: '加粗',
          underline: '下划线',
          italic: '斜体',
          strikeThrough: '删除线',
          title: '标题',
          sub: '下标',
          sup: '上标',
          quote: '引用',
          unorderedList: '无序列表',
          orderedList: '有序列表',
          task: '任务列表',
          codeRow: '行内代码',
          code: '块级代码',
          link: '链接',
          image: '图片',
          table: '表格',
          mermaid: 'Mermaid图',
          katex: 'Katex公式',
          revoke: '撤销',
          next: '重做',
          save: '保存',
          prettier: '美化',
          pageFullscreen: '浏览器全屏',
          fullscreen: '全屏',
          catalog: '目录',
          preview: '预览',
          htmlPreview: 'HTML预览',
          github: 'GitHub',
          help: '帮助'
        }
      }
    }
  }
});

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

// 定义编辑器工具栏
const toolbars = [
  'bold', 'italic', 'strikethrough', 'heading', 'quote', 
  'code', 'link', 'image', 'table', 'list-ordered', 'list-unordered',
  'check', 'line', 'revoke', 'next', 'save', 'prettier',
  'preview', 'htmlPreview', 'fullscreen', 'pageFullscreen', 'catalog', 'help'
];

// 转换Markdown为HTML的计算属性
const htmlPreview = computed(() => {
  return md.render(articleForm.value.contentMarkdown || '');
});

// 处理编辑器内容变化
const handleContentChange = (text) => {
  articleForm.value.contentMarkdown = text;
};

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
/* 编辑器样式覆盖 */
:deep(.md-editor) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
}

:deep(.md-editor-toolbar) {
  border-bottom: 1px solid #ced4da;
  background-color: #f8f9fa;
}

:deep(.md-editor-preview) {
  padding: 16px;
  font-size: 16px;
  line-height: 1.6;
}

:deep(.md-editor-input) {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace !important;
  font-size: 14px;
  line-height: 1.6;
  padding: 16px !important;
}
</style>
