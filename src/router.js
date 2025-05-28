import { createRouter, createWebHistory } from 'vue-router';
import ArticleList from './components/ArticleList.vue';
import ArticleDetail from './components/ArticleDetail.vue';
import AdminLayout from './layouts/AdminLayout.vue';
import AdminLogin from './views/admin/AdminLogin.vue';
import AdminDashboard from './views/admin/AdminDashboard.vue';
import ArticleManager from './views/admin/ArticleManager.vue';
import ArticleEditor from './views/admin/ArticleEditor.vue';
import auth from './store/auth';

const routes = [
  // 前端展示路由 - 保持不变
  {
    path: '/',
    name: 'ArticleList',
    component: ArticleList,
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: ArticleDetail,
    props: true
  },
  
  // 管理员路由 - 完全独立的路径
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin,
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'articles',
        name: 'ArticleManager',
        component: ArticleManager
      },
      {
        path: 'articles/new',
        name: 'ArticleEditor',
        component: ArticleEditor
      },
      {
        path: 'articles/:id/edit',
        name: 'ArticleEditorEdit',
        component: ArticleEditor,
        props: true
      },
      {
        path: 'comments',
        name: 'CommentManager',
        component: () => import('./views/admin/CommentManager.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 添加路由守卫，针对需要验证的管理员路由
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 检查是否已登录为管理员
    if (auth.isAdmin()) {
      next();
    } else {
      // 未登录，重定向到登录页
      next({ name: 'AdminLogin' });
    }
  } else {
    next();
  }
});

export default router;
