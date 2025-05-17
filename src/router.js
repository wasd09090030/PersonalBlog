import { createRouter, createWebHistory } from 'vue-router';
import ArticleList from './components/ArticleList.vue';
import ArticleForm from './components/ArticleForm.vue';

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
