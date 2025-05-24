<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ article ? '编辑文章' : '创建文章' }}</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="save">
            <div class="mb-3">
              <label for="title" class="form-label">标题</label>
              <input 
                type="text" 
                class="form-control" 
                id="title" 
                v-model="form.title" 
                required
              >
            </div>
            
            <!-- 添加文章类别选择 -->
            <div class="mb-3">
              <label for="category" class="form-label">文章类别</label>
              <select 
                class="form-select" 
                id="category" 
                v-model="form.category"
                required
              >
                <option value="study">学习</option>
                <option value="game">游戏</option>
                <option value="work">个人作品</option>
                <option value="other">其他</option>
              </select>
            </div>
              <!-- 替换为Markdown编辑器 -->
            <div class="mb-3">
              <label class="form-label">内容 (Markdown编辑器)</label>              <MdEditor
                v-model="form.contentMarkdown"
                height="400px"
                :toolbars="toolbars"
                preview-theme="github"
                code-theme="github"
                language="zh-CN"
                @onChange="handleContentChange"
              />
            </div>
            
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn btn-secondary" @click="$emit('close')">
                取消
              </button>
              <button 
                type="submit" 
                class="btn btn-primary" 
                :disabled="saving"
              >
                <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import MarkdownIt from 'markdown-it';
import articleService from '../../services/articleService';

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

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  article: {
    type: Object,
    default: null
  }
});

// Emits
const emit = defineEmits(['close', 'saved']);

// Setup markdown parser
const md = new MarkdownIt();

// State
const form = ref({
  title: '',
  contentMarkdown: '',
  category: 'study' // 默认类别
});
const saving = ref(false);

// 定义编辑器工具栏
const toolbars = [
  'bold', 'italic', 'strikethrough', 'heading', 'quote', 
  'code', 'link', 'image', 'table', 'list-ordered', 'list-unordered',
  'check', 'line', 'revoke', 'next', 'save', 'prettier',
  'preview', 'htmlPreview', 'fullscreen', 'pageFullscreen', 'catalog', 'help'
];

// 处理编辑器内容变化
const handleContentChange = (text) => {
  form.value.contentMarkdown = text;
};

// Methods
const save = async () => {
  saving.value = true;
  
  try {
    // 将Markdown转换为HTML
    const htmlContent = md.render(form.value.contentMarkdown || '');
    
    const payload = {
      title: form.value.title,
      contentMarkdown: form.value.contentMarkdown,
      content: htmlContent,
      category: form.value.category // 添加类别字段
    };
    
    if (props.article) {
      // 更新现有文章
      await articleService.updateArticle(props.article.id, payload);
    } else {
      // 创建新文章
      await articleService.createArticle(payload);
    }
    
    emit('saved');
  } catch (error) {
    console.error('保存文章失败:', error);
    alert('保存文章失败: ' + error.message);
  } finally {
    saving.value = false;
  }
};

// Watch props to update form
watch(() => props.article, (newVal) => {
  if (newVal) {
    form.value = {
      title: newVal.title,
      contentMarkdown: newVal.contentMarkdown || newVal.content,
      category: newVal.category || 'study' // 默认类别为学习
    };
  } else {
    form.value = {
      title: '',
      contentMarkdown: '',
      category: 'study' // 重置为默认类别
    };
  }
}, { immediate: true });
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-dialog {
  max-width: 800px;
  width: 90%;
  margin: 30px auto;
}

.modal-content {
  border-radius: 8px;
  max-height: 90vh;
  overflow-y: auto;
}

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
