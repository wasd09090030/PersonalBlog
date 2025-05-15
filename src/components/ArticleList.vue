<template>
  <div class="article-list">
    <h2>文章列表</h2>
    <div v-if="error" class="error-message">加载或操作文章失败: {{ error.message }}</div>

    <!-- Edit Article Form -->
    <div v-if="editingArticle" class="edit-form">
      <h3>编辑文章</h3>
      <form @submit.prevent="saveArticle">
        <div>
          <label for="edit-title">标题:</label>
          <input type="text" id="edit-title" v-model="editingArticle.title" required />
        </div>
        <div>
          <label for="edit-content">内容 (Markdown):</label>
          <v-md-editor v-model="editingArticle.contentMarkdown" height="400px"></v-md-editor>
        </div>
        <div class="form-actions">
          <button type="submit">保存</button>
          <button type="button" @click="cancelEdit">取消</button>
        </div>
      </form>
    </div>

    <ul v-else-if="articles.length">
      <li v-for="article in articles" :key="article.id">
        <div class="article-header">
          <h3>{{ article.title }}</h3>
          <div>
            <button @click="startEdit(article)" class="edit-button">编辑</button>
            <button @click="deleteArticle(article.id)" class="delete-button">删除</button>
          </div>
        </div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="article.content"></div>
      </li>
    </ul>
    <div v-else class="no-articles">暂无文章</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MarkdownIt from 'markdown-it';

const articles = ref([]);
const error = ref(null);
const editingArticle = ref(null); 
const md = new MarkdownIt();

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

function startEdit(article) {
  editingArticle.value = { ...article, contentMarkdown: article.content };
}

function cancelEdit() {
  editingArticle.value = null;
}

async function saveArticle() {
  if (!editingArticle.value) return;
  error.value = null;
  try {
    const htmlContent = md.render(editingArticle.value.contentMarkdown);
    const response = await fetch(`http://localhost:3000/articles/${editingArticle.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: editingArticle.value.title,
        content: htmlContent,
      }),
    });
    if (!response.ok) {
      let errorData = { message: `HTTP error! status: ${response.status}` };
      try {
        errorData = await response.json();
      } catch (e) {
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    await fetchArticles();
    cancelEdit();
  } catch (e) {
    error.value = e;
    console.error(`更新文章 ${editingArticle.value.id} 失败:`, e);
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
      } catch (e) {
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    await fetchArticles();
  } catch (e) {
    error.value = e;
    console.error(`删除文章 ${id} 失败:`, e);
  }
}

onMounted(() => {
  fetchArticles();
});

defineExpose({
  fetchArticles,
});
</script>

<style scoped>
.article-list {
  font-family: sans-serif;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.article-list h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  position: relative;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.article-header h3 {
  margin-top: 0;
  margin-bottom: 0;
  color: #42b983;
}

.article-header div button {
  margin-left: 8px;
}

.edit-button {
  background-color: #f0ad4e;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8em;
}

.edit-button:hover {
  background-color: #ec971f;
}

.delete-button {
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8em;
}

.delete-button:hover {
  background-color: #c9302c;
}

li div[v-html] {
  margin-bottom: 0;
  color: #555;
  white-space: pre-wrap;
}

.error-message {
  color: #d9534f;
  text-align: center;
  padding: 10px;
  border: 1px solid #d9534f;
  border-radius: 4px;
  background-color: #f2dede;
}

.no-articles {
  text-align: center;
  color: #777;
  padding: 20px;
}

/* Edit Form Styles */
.edit-form {
  background-color: #f9f9f9;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.edit-form h3 {
  text-align: center;
  color: #333;
  margin-top: 0;
  margin-bottom: 15px;
}

.edit-form div {
  margin-bottom: 10px;
}

.edit-form label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

.edit-form input[type="text"],
.edit-form textarea {
  width: calc(100% - 22px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.edit-form textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.form-actions button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-actions button[type="submit"] {
  background-color: #5cb85c;
  color: white;
}

.form-actions button[type="submit"]:hover {
  background-color: #4cae4c;
}

.form-actions button[type="button"] {
  background-color: #aaa;
  color: white;
}

.form-actions button[type="button"]:hover {
  background-color: #888;
}
</style>
