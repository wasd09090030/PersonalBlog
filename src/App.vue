<script setup>
import ArticleList from './components/ArticleList.vue';
import MarkdownIt from 'markdown-it';
import { ref, reactive } from 'vue';

const showAddArticleForm = ref(false);
const newArticle = ref({
  title: '',
  content: '',
  author: '',
});
const articleListRef = ref(null);
const error = ref(null);
const md = new MarkdownIt();

async function submitArticle() {
  error.value = null;
  try {
    const htmlContent = md.render(newArticle.value.content);
    const response = await fetch('http://localhost:3000/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...newArticle.value,
        content: htmlContent, // 发送 HTML 内容到后端
      }),
    });
    if (!response.ok) {
      let errorData = { message: `HTTP error! status: ${response.status}` };
      try {
        errorData = await response.json();
      } catch (e) {
        // Ignore if response is not JSON
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    newArticle.value = { title: '', content: '', author: '' };
    showAddArticleForm.value = false;
    if (articleListRef.value && typeof articleListRef.value.fetchArticles === 'function') {
      await articleListRef.value.fetchArticles();
    } else {
      console.warn('Could not refresh article list. fetchArticles method not found on ArticleList component.');
    }
  } catch (e) {
    error.value = e.message || "创建文章失败，请稍后再试。";
    console.error("创建文章失败:", e);
  }
}
</script>

<template>
  <div id="app">
    <div class="container">
      <header>
        <h1>我的个人博客</h1>
      </header>
      <main>
        <div class="actions">
          <button @click="showAddArticleForm = !showAddArticleForm" class="action-button">
            {{ showAddArticleForm ? '取消' : '撰写新文章' }}
          </button>
        </div>

        <div v-if="showAddArticleForm" class="article-form">
          <h2>撰写新文章</h2>
          <form @submit.prevent="submitArticle">
            <div>
              <label for="title">标题:</label>
              <input type="text" id="title" v-model="newArticle.title" required />
            </div>
            <div>
              <label for="author">作者:</label>
              <input type="text" id="author" v-model="newArticle.author" />
            </div>
            <div>
              <label for="content">内容 (Markdown):</label>
              <v-md-editor v-model="newArticle.content" height="400px"></v-md-editor>
            </div>
            <button type="submit" class="submit-button">提交</button>
          </form>
        </div>
        <article-list ref="articleListRef"></article-list>
      </main>
    </div>
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

header h1 {
  color: #333;
  font-size: 2.5em;
}

.actions {
  margin-bottom: 20px;
  text-align: right;
}

.action-button {
  background-color: #5cb85c;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

.action-button:hover {
  background-color: #4cae4c;
}

.article-form {
  background-color: #f9f9f9;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.article-form h2 {
  text-align: center;
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
}

.article-form div {
  margin-bottom: 15px;
}

.article-form label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: bold;
}

.article-form input[type="text"] {
  width: calc(100% - 22px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  display: block;
  margin: 10px auto 0;
}

.submit-button:hover {
  background-color: #0056b3;
}

.error-message-app {
  color: #d9534f;
  text-align: center;
  padding: 10px;
  border: 1px solid #d9534f;
  border-radius: 4px;
  background-color: #f2dede;
  margin-bottom: 20px;
}
</style>
