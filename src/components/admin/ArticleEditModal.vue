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
            
            <div class="mb-3">
              <label for="contentMarkdown" class="form-label">内容 (Markdown)</label>
              <textarea 
                class="form-control" 
                id="contentMarkdown" 
                v-model="form.contentMarkdown"
                rows="10" 
                required
              ></textarea>
            </div>
            
            <div class="mb-3">
              <label class="form-label">预览</label>
              <div class="preview-container border rounded p-3">
                <div v-html="htmlPreview"></div>
              </div>
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

// Computed
const htmlPreview = computed(() => {
  return md.render(form.value.contentMarkdown || '');
});

// Methods
const save = async () => {
  saving.value = true;
  
  try {
    // 将Markdown转换为HTML
    const htmlContent = md.render(form.value.contentMarkdown);
    
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

.preview-container {
  min-height: 200px;
  max-height: 300px;
  overflow-y: auto;
  background-color: #fff;
}

textarea {
  font-family: monospace;
}
</style>
