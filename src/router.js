import { createRouter, createWebHistory } from 'vue-router';
import ArticleList from './components/ArticleList.vue';
import ArticleForm from './components/ArticleForm.vue';
import ArticleDetail from './components/ArticleDetail.vue';
import auth from './store/auth';

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

// 导入 Toast 通知功能
import { showToast } from './components/Toast.vue';

// 路由守卫，限制非管理员访问添加/编辑页面
router.beforeEach((to, from, next) => {
  // 初始化用户角色
  auth.initUserRole();
  
  // 如果尝试访问需要管理员权限的页面，但不是管理员
  if ((to.name === 'AddArticle' || to.name === 'EditArticle') && !auth.isAdmin()) {
    // 重定向到文章列表页
    next({ name: 'ArticleList' });
    // 显示权限不足的提示信息
    setTimeout(() => {
      showToast('您需要管理员权限才能执行此操作', 'danger', 5000);
    }, 300);
  } else {
    // 其他情况正常导航
    next();
  }
});

export default router;
