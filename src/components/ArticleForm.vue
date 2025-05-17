<template>
  <div class="article-form-page py-4">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h2 class="mb-0">{{ formTitle }}</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitArticle">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="title" class="form-label">标题:</label>
              <input type="text" id="title" class="form-control" v-model="article.title" required />
            </div>
            <div class="col-md-6">
              <label for="author" class="form-label">作者:</label>
              <input type="text" id="author" class="form-control" v-model="article.author" :disabled="props.mode === 'edit'" />
            </div>
          </div>
          
          <div class="mb-3">
            <label for="content" class="form-label">内容 (Markdown):</label>
            <v-md-editor v-model="article.contentMarkdown" height="600px" class="form-control p-0"></v-md-editor>
          </div>
          
          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error.message }}
          </div>
          
          <div class="d-flex justify-content-end mt-4">
            <router-link to="/" class="btn btn-outline-secondary me-2">取消</router-link>
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-check-circle-fill me-2"></i>{{ submitButtonText }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import MarkdownIt from 'markdown-it';

const props = defineProps({
  mode: {
    type: String,
    required: true, // 'add' or 'edit'
  },
  id: {
    type: String, // Article ID for edit mode
    default: null,
  },
});

const router = useRouter();
const article = ref({
  title: '',
  author: '',
  contentMarkdown: '', // Store markdown content here
});
const error = ref(null);
const md = new MarkdownIt();

const formTitle = computed(() => (props.mode === 'edit' ? '编辑文章' : '撰写新文章'));
const submitButtonText = computed(() => (props.mode === 'edit' ? '保存更改' : '提交文章'));

async function fetchArticleForEdit() {
  if (props.mode === 'edit' && props.id) {
    error.value = null;
    try {
      const response = await fetch(`http://localhost:3000/articles/${props.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      article.value = { 
        title: data.title,
        author: data.author, // 确保编辑时也加载作者信息
        contentMarkdown: data.contentMarkdown || data.content // 优先使用 contentMarkdown，如果不存在则使用 content
      }; 
    } catch (e) {
      error.value = e;
      console.error(`获取文章 ${props.id} 失败:`, e);
    }
  }
}

async function submitArticle() {
  error.value = null;
  try {
    const htmlContent = md.render(article.value.contentMarkdown);
    const url = props.mode === 'edit' ? `http://localhost:3000/articles/${props.id}` : 'http://localhost:3000/articles';
    const method = props.mode === 'edit' ? 'PUT' : 'POST';

    const payload = {
      title: article.value.title,
      author: article.value.author, // 确保提交时包含作者信息
      content: htmlContent, // 发送HTML到后端
      contentMarkdown: article.value.contentMarkdown // 同时发送Markdown原文
    };

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorData = { message: `HTTP error! status: ${response.status}` };
      try {
        errorData = await response.json();
      } catch (e) { /* Ignore if response is not JSON */ }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    router.push('/'); // Navigate back to the article list
  } catch (e) {
    error.value = e;
    console.error(`${props.mode === 'edit' ? '更新' : '创建'}文章失败:`, e);
  }
}

onMounted(() => {
  if (props.mode === 'edit') {
    fetchArticleForEdit();
  }
});

</script>

<style scoped>
/* .article-form-page is intentionally left empty if no specific overrides are needed beyond Bootstrap's container/page background */

/* v-md-editor 的高度和边框等通过 class="form-control p-0" 和内联 height 属性控制 */
.editor-container ::v-deep .v-md-editor .editor-wrapper {
  width: 100% !important;
}

/* 如果需要 Bootstrap 图标，请确保已安装 bootstrap-icons */
/* 例如: npm install bootstrap-icons */
/* 并在 main.js 中导入: import 'bootstrap-icons/font/bootstrap-icons.css'; */

/* 确保 v-md-editor 应用 form-control 样式时表现正常 */
.form-control.v-md-editor {
  padding: 0; /* 移除 form-control 默认的 padding，因为编辑器内部有自己的布局 */
  border: 1px solid #ced4da; /* 确保边框与普通 form-control 一致 */
}

.form-control.v-md-editor ::v-deep(.github-markdown-body) {
    padding: 0.5rem 0.75rem; /* 在预览区域添加一些内边距 */
}

.form-control.v-md-editor ::v-deep(.v-md-editor__toolbar) {
    border-bottom: 1px solid #ced4da; /* 给工具栏下方添加分割线 */
}

/* .form-control.v-md-editor ::v-deep(.codemirror-wrapper) is intentionally left empty if no specific overrides are needed */
</style>
