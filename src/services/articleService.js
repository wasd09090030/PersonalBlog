// 文章服务 - 处理与后端API的通信
import { UserRoles } from '../store/auth';

class ArticleService {
  constructor() {
    this.baseURL = 'http://localhost:3000';
  }

  // 获取所有文章 - 前端展示用
  async getArticles(category) {
    try {
      let url = `${this.baseURL}/articles`;
      // 如果提供了类别参数，添加到查询字符串
      if (category) {
        url += `?category=${category}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('获取文章失败');
      return await response.json();
    } catch (error) {
      console.error('获取文章失败:', error);
      throw error;
    }
  }

  // 获取指定类别的文章
  async getArticlesByCategory(category) {
    try {
      const response = await fetch(`${this.baseURL}/articles/category/${category}`);
      if (!response.ok) throw new Error('获取分类文章失败');
      return await response.json();
    } catch (error) {
      console.error(`获取${category}分类文章失败:`, error);
      throw error;
    }
  }

  // 获取单篇文章 - 前端展示用
  async getArticleById(id) {
    try {
      const response = await fetch(`${this.baseURL}/articles/${id}`);
      if (!response.ok) throw new Error('获取文章失败');
      return await response.json();
    } catch (error) {
      console.error('获取文章失败:', error);
      throw error;
    }
  }

  // === 以下为管理员专用API ===
  
  // 创建文章
  async createArticle(articleData) {
    try {
      const response = await fetch(`${this.baseURL}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader()
        },
        body: JSON.stringify(articleData)
      });
      if (!response.ok) throw new Error('创建文章失败');
      return await response.json();
    } catch (error) {
      console.error('创建文章失败:', error);
      throw error;
    }
  }

  // 更新文章
  async updateArticle(id, articleData) {
    try {
      const response = await fetch(`${this.baseURL}/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader()
        },
        body: JSON.stringify(articleData)
      });
      if (!response.ok) throw new Error('更新文章失败');
      return await response.json();
    } catch (error) {
      console.error('更新文章失败:', error);
      throw error;
    }
  }

  // 删除文章
  async deleteArticle(id) {
    try {
      const response = await fetch(`${this.baseURL}/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': this.getAuthHeader()
        }
      });
      if (!response.ok) throw new Error('删除文章失败');
      return true;
    } catch (error) {
      console.error('删除文章失败:', error);
      throw error;
    }
  }

  // 获取授权头
  getAuthHeader() {
    // 使用本地存储的认证信息
    return localStorage.getItem('isAuthenticated') === 'true' ? 'AdminToken' : '';
  }
}

export default new ArticleService();
