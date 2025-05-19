import { createRouter, createWebHistory } from 'vue-router';
import ArticleList from './components/ArticleList.vue';
import ArticleForm from './components/ArticleForm.vue';
import ArticleDetail from './components/ArticleDetail.vue'; // 导入文章详情组件

const routes = [
  {
    path: '/',
    name: 'ArticleList',
    component: ArticleList,
  },
  {
    path: '/add',
    name: 'AddArticle',
    component: ArticleForm,
    props: { mode: 'add' }
  },
  {
    path: '/edit/:id',
    name: 'EditArticle',
    component: ArticleForm,
    props: route => ({ mode: 'edit', id: route.params.id })
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: ArticleDetail,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
