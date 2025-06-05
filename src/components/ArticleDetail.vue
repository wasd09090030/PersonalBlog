<template>
  <div class="article-detail-page">
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary animate__animated animate__pulse animate__infinite" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger animate__animated animate__shakeX" role="alert">
      加载文章失败: {{ error.message }}
    </div>    <div v-else-if="article" class="article-container card shadow-sm animate__animated animate__fadeInUp">
      <div class="card-body">        <!-- 封面图片 -->
        <div v-if="article.coverImage && article.coverImage !== 'null'" class="article-cover mb-4 animate__animated animate__fadeIn">
          <img 
            :src="article.coverImage" 
            :alt="article.title" 
            class="cover-image"
            style="height: 400px; aspect-ratio: 16/9; object-fit: cover; width: 100%; border-radius: 0.5rem;"
          />
        </div>
        
        <div class="article-header mb-4 animate__animated animate__fadeInDown">
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <span class="badge animate__animated animate__bounceIn animate__delay-0.5s" :class="getCategoryBadgeClass(article.category)">
              {{ getCategoryName(article.category) }}
            </span>
            <span class="badge bg-secondary ms-2 animate__animated animate__bounceIn animate__delay-0.7s">{{ formatDate(article.createdAt) }}</span>
            <span v-if="article.updatedAt && article.updatedAt !== article.createdAt" class="ms-2 text-muted animate__animated animate__fadeIn animate__delay-1s">
              最后更新: {{ formatDate(article.updatedAt) }}
            </span>
          </div>
        </div>          <div class="article-actions mb-4 animate__animated animate__fadeInRight">
          <button @click="goBackToList" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>
            返回列表
          </button>
        </div>

        <div class="article-content">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="article.content" class="article-content-html"></div>        </div>        <!-- 评论和点赞区域 -->
        <LazyCommentSection :article-id="article.id" />
          <!-- 底部返回按钮 -->
        <div class="article-bottom-actions mt-5 pt-4 border-top text-center animate__animated animate__fadeInUp">
          <button @click="goBackToList" class="btn btn-primary btn-lg">
            <i class="bi bi-arrow-left me-2"></i>
            返回文章列表
          </button>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-warning" role="alert">
      找不到文章
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LazyCommentSection from './LazyCommentSection.vue';

const route = useRoute();
const router = useRouter();
const article = ref(null);
const loading = ref(true);
const error = ref(null);

// 静态示例文章数据 - 与ArticleList.vue保持一致
const sampleArticles = [
  {
    id: 1,
    title: '关于Vue3的Composition API最佳实践',
    content: '<p>Composition API是Vue3引入的一种新的组织组件逻辑的方式，相比于Options API，它提供了更好的代码组织性和可复用性。</p><p>在实际项目中，我们可以通过提取可复用的逻辑到独立的组合函数中，从而实现更好的关注点分离。本文将分享一些Composition API的最佳实践和常见陷阱。</p><p>首先，我们要理解ref和reactive的区别与使用场景。ref适用于基本类型值，reactive适用于对象类型。在组件中，我们应该始终使用ref函数来声明响应式变量，这样可以保持一致性...</p>',
    contentMarkdown: '# 关于Vue3的Composition API最佳实践\n\nComposition API是Vue3引入的一种新的组织组件逻辑的方式，相比于Options API，它提供了更好的代码组织性和可复用性。\n\n在实际项目中，我们可以通过提取可复用的逻辑到独立的组合函数中，从而实现更好的关注点分离。本文将分享一些Composition API的最佳实践和常见陷阱。',
    createdAt: '2025-05-15T10:00:00.000Z',
    updatedAt: '2025-05-16T14:30:00.000Z',
    category: 'study',
    coverImage: 'https://picsum.photos/id/180/800/600'
  },
  {
    id: 2,
    title: '《赛博朋克2077》游戏体验分享',
    content: '<p>作为一款备受期待的开放世界RPG游戏，《赛博朋克2077》在经过多次更新后，终于达到了玩家期望的水平。</p><p>夜之城的视觉设计令人惊叹，霓虹灯闪烁的街道、高耸入云的摩天大楼，以及各种科技与朋克元素的融合，构成了一个极具视觉冲击力的未来世界。</p><p>游戏的剧情设计也非常出色，玩家可以根据自己的选择影响故事走向，多结局系统提供了很高的可重玩性...</p>',
    contentMarkdown: '# 《赛博朋克2077》游戏体验分享\n\n作为一款备受期待的开放世界RPG游戏，《赛博朋克2077》在经过多次更新后，终于达到了玩家期望的水平。\n\n夜之城的视觉设计令人惊叹，霓虹灯闪烁的街道、高耸入云的摩天大楼，以及各种科技与朋克元素的融合，构成了一个极具视觉冲击力的未来世界。',
    createdAt: '2025-05-10T15:20:00.000Z',
    updatedAt: '2025-05-11T09:45:00.000Z',
    category: 'game',
    coverImage: 'https://picsum.photos/id/160/800/600'
  },
  {
    id: 3,
    title: '我的个人网站开发历程',
    content: '<p>开发个人博客网站是一个非常有趣的过程，从最初的需求分析到最终的上线部署，每一步都充满了挑战和成长。</p><p>在技术选型阶段，我选择了Vue3+Vite作为前端框架，NestJS作为后端框架，这种组合既现代又高效。数据库方面使用了SQLite，因为它轻量级且易于部署。</p><p>前端开发中，我尝试了许多新特性，如Composition API、自定义组件和动画效果。后端则专注于构建RESTful API和数据库交互...</p>',
    contentMarkdown: '# 我的个人网站开发历程\n\n开发个人博客网站是一个非常有趣的过程，从最初的需求分析到最终的上线部署，每一步都充满了挑战和成长。\n\n在技术选型阶段，我选择了Vue3+Vite作为前端框架，NestJS作为后端框架，这种组合既现代又高效。数据库方面使用了SQLite，因为它轻量级且易于部署。',
    createdAt: '2025-04-28T08:15:00.000Z', 
    updatedAt: '2025-04-30T11:20:00.000Z',
    category: 'work',
    coverImage: 'https://picsum.photos/id/120/800/600'
  },
  {
    id: 4,
    title: '前端性能优化实战技巧',
    content: '<p>前端性能优化是提升用户体验的关键因素，本文将分享一些实用的优化技巧。</p><p>首先，我们应该关注资源加载优化，包括图片懒加载、资源预加载、代码分割等技术。其次，渲染性能优化也很重要，如虚拟列表、防抖节流、WebWorker等。</p><p>在实际项目中，我发现合理使用缓存策略、减少DOM操作、优化CSS选择器也能带来明显的性能提升。最后，别忘了使用性能监测工具来量化优化效果...</p>',
    contentMarkdown: '# 前端性能优化实战技巧\n\n前端性能优化是提升用户体验的关键因素，本文将分享一些实用的优化技巧。\n\n首先，我们应该关注资源加载优化，包括图片懒加载、资源预加载、代码分割等技术。其次，渲染性能优化也很重要，如虚拟列表、防抖节流、WebWorker等。',
    createdAt: '2025-05-20T09:30:00.000Z',
    updatedAt: '2025-05-22T16:40:00.000Z',
    category: 'study',
    coverImage: 'https://picsum.photos/id/110/800/600'
  },
  {
    id: 5,
    title: '《艾尔登法环》Boss攻略集锦',
    content: '<p>《艾尔登法环》作为FromSoftware的代表作，其Boss设计堪称系列巅峰。本文将分享一些主要Boss的攻略策略。</p><p>玛莲妮亚可能是游戏中最具挑战性的Boss之一，她的连击和水舞都极具威胁。应对策略是保持距离，等待她的突进攻击后进行反击，同时准备好闪避她的水舞技能。</p><p>拉达冈则需要利用他的攻击模式间隙进行输出，注意避开他的重击和AOE伤害范围...</p>',
    contentMarkdown: '# 《艾尔登法环》Boss攻略集锦\n\n《艾尔登法环》作为FromSoftware的代表作，其Boss设计堪称系列巅峰。本文将分享一些主要Boss的攻略策略。\n\n玛莲妮亚可能是游戏中最具挑战性的Boss之一，她的连击和水舞都极具威胁。应对策略是保持距离，等待她的突进攻击后进行反击，同时准备好闪避她的水舞技能。',
    createdAt: '2025-04-15T14:25:00.000Z',
    updatedAt: '2025-04-17T10:15:00.000Z',
    category: 'game',
    coverImage: 'https://picsum.photos/id/150/800/600'
  },
  {
    id: 6,
    title: '我的简易音乐播放器实现',
    content: '<p>最近我用Vue3开发了一个简易的音乐播放器组件，它支持播放/暂停、进度条控制、音量调节等基本功能。</p><p>在实现过程中，我主要使用了HTML5的Audio API，结合Vue3的响应式特性来管理播放状态。比较有挑战的部分是进度条的实时更新和拖拽控制，这里我使用了计算属性和事件监听来解决。</p><p>组件设计上采用了模块化思想，将播放控制、进度显示、歌曲信息等拆分为子组件，使代码结构更清晰...</p>',
    contentMarkdown: '# 我的简易音乐播放器实现\n\n最近我用Vue3开发了一个简易的音乐播放器组件，它支持播放/暂停、进度条控制、音量调节等基本功能。\n\n在实现过程中，我主要使用了HTML5的Audio API，结合Vue3的响应式特性来管理播放状态。比较有挑战的部分是进度条的实时更新和拖拽控制，这里我使用了计算属性和事件监听来解决。',
    createdAt: '2025-05-05T11:10:00.000Z',
    updatedAt: '2025-05-07T13:40:00.000Z',
    category: 'work',
    coverImage: 'https://picsum.photos/id/130/800/600'
  },
  {
    id: 7,
    title: '实用开发工具推荐',
    content: '<p>高效的开发工具能大幅提升编程效率，本文推荐一些我日常使用的优秀工具。</p><p>IDE方面，VS Code依然是最佳选择，搭配GitLens、ESLint、Prettier等插件更是如虎添翼。终端工具推荐Windows Terminal或iTerm2，配合Oh My Zsh使用效果更佳。</p><p>API测试工具首选Postman，代码版本控制除了Git外，推荐尝试新兴的GitKraken。此外，Chrome开发者工具、Lighthouse等也是前端开发的得力助手...</p>',
    contentMarkdown: '# 实用开发工具推荐\n\n高效的开发工具能大幅提升编程效率，本文推荐一些我日常使用的优秀工具。\n\nIDE方面，VS Code依然是最佳选择，搭配GitLens、ESLint、Prettier等插件更是如虎添翼。终端工具推荐Windows Terminal或iTerm2，配合Oh My Zsh使用效果更佳。',
    createdAt: '2025-03-25T16:20:00.000Z',
    updatedAt: '2025-03-27T09:30:00.000Z',
    category: 'resource',
    coverImage: 'https://picsum.photos/id/170/800/600'
  },
  {
    id: 8,
    title: 'JavaScript异步编程详解',
    content: '<p>JavaScript的异步编程模式是前端开发中必须掌握的核心概念，从最初的回调函数到Promise，再到现代的async/await语法，异步处理方式不断演进。</p><p>回调函数是最早的异步处理方式，但容易导致回调地狱。Promise的出现解决了这个问题，它提供了更优雅的链式调用方式。而async/await则进一步简化了异步代码的编写，使其看起来像同步代码一样易于理解。</p><p>在实际应用中，我们还需要了解Promise.all、Promise.race等并行处理方法，以及如何正确处理异步错误...</p>',
    contentMarkdown: '# JavaScript异步编程详解\n\nJavaScript的异步编程模式是前端开发中必须掌握的核心概念，从最初的回调函数到Promise，再到现代的async/await语法，异步处理方式不断演进。\n\n回调函数是最早的异步处理方式，但容易导致回调地狱。Promise的出现解决了这个问题，它提供了更优雅的链式调用方式。',
    createdAt: '2025-05-28T10:40:00.000Z',
    updatedAt: '2025-05-30T15:20:00.000Z',
    category: 'study',
    coverImage: 'https://picsum.photos/id/190/800/600'
  },
  {
    id: 9,
    title: '《原神》新版本探索心得',
    content: '<p>随着《原神》4.5版本的发布，游戏新增了枫丹地区的深层探索内容，本文将分享一些探索心得与资源收集攻略。</p><p>新增的地下洞穴系统设计精巧，解谜方式也更加多样化。在探索过程中，务必留意墙壁上的特殊标记和环境中的互动元素，这些往往是解开谜题的关键。</p><p>资源收集方面，新版本增加了特殊矿石和植物，它们大多分布在隐蔽的角落，推荐使用官方互动地图辅助寻找...</p>',
    contentMarkdown: '# 《原神》新版本探索心得\n\n随着《原神》4.5版本的发布，游戏新增了枫丹地区的深层探索内容，本文将分享一些探索心得与资源收集攻略。\n\n新增的地下洞穴系统设计精巧，解谜方式也更加多样化。在探索过程中，务必留意墙壁上的特殊标记和环境中的互动元素，这些往往是解开谜题的关键。',
    createdAt: '2025-06-01T12:15:00.000Z',
    updatedAt: '2025-06-03T09:10:00.000Z',
    category: 'game',
    coverImage: 'https://picsum.photos/id/140/800/600'
  },
  {
    id: 10,
    title: '响应式布局设计实践',
    content: '<p>随着移动设备的普及，响应式布局设计已成为前端开发的标准需求。本文将分享一些响应式设计的实用技巧和最佳实践。</p><p>首先，我们应该采用移动优先的设计理念，从最小屏幕开始设计，再逐步扩展到大屏幕。其次，灵活使用CSS媒体查询、Flexbox和Grid布局可以大幅简化响应式布局的实现。</p><p>在实际项目中，我发现CSS变量和主题切换结合使用效果很好，可以轻松实现不同设备上的样式调整。此外，合理的图片处理策略也是响应式设计中不可忽视的一环...</p>',
    contentMarkdown: '# 响应式布局设计实践\n\n随着移动设备的普及，响应式布局设计已成为前端开发的标准需求。本文将分享一些响应式设计的实用技巧和最佳实践。\n\n首先，我们应该采用移动优先的设计理念，从最小屏幕开始设计，再逐步扩展到大屏幕。其次，灵活使用CSS媒体查询、Flexbox和Grid布局可以大幅简化响应式布局的实现。',
    createdAt: '2025-04-05T09:20:00.000Z',
    updatedAt: '2025-04-08T14:30:00.000Z',
    category: 'study',
    coverImage: 'https://picsum.photos/id/100/800/600'
  },
  {
    id: 11,
    title: '免费设计资源分享',
    content: '<p>优质的设计资源对于开发者和设计师来说都是宝贵的财富，本文整理了一些实用且免费的设计资源网站。</p><p>Unsplash和Pexels提供了海量高质量免费图片；Iconscout和Flaticon则是图标资源的良好来源；对于UI设计，Figma Community和UI8的免费资源也非常值得一看。</p><p>除了素材资源，一些设计工具如Canva、Figma的免费版本也能满足基本需求。字体方面，Google Fonts和Adobe Fonts提供了丰富的免费字体选择...</p>',
    contentMarkdown: '# 免费设计资源分享\n\n优质的设计资源对于开发者和设计师来说都是宝贵的财富，本文整理了一些实用且免费的设计资源网站。\n\nUnsplash和Pexels提供了海量高质量免费图片；Iconscout和Flaticon则是图标资源的良好来源；对于UI设计，Figma Community和UI8的免费资源也非常值得一看。',
    createdAt: '2025-05-18T15:45:00.000Z',
    updatedAt: '2025-05-20T11:25:00.000Z',
    category: 'resource',
    coverImage: 'https://picsum.photos/id/200/800/600'
  },
  {
    id: 12,
    title: '我的3D渲染引擎小项目',
    content: '<p>最近我利用业余时间开发了一个基于WebGL的简易3D渲染引擎，这是我探索图形编程的初步尝试。</p><p>这个引擎支持基本的模型加载、材质系统和简单光照计算。虽然功能还比较初级，但已经可以渲染一些简单的3D场景了。在开发过程中，我学习了大量关于3D数学、着色器编程和渲染管线的知识。</p><p>未来我计划添加更多功能，如阴影映射、后期处理效果和物理碰撞系统等。虽然这只是一个个人学习项目，但它让我对图形渲染有了更深入的理解...</p>',
    contentMarkdown: '# 我的3D渲染引擎小项目\n\n最近我利用业余时间开发了一个基于WebGL的简易3D渲染引擎，这是我探索图形编程的初步尝试。\n\n这个引擎支持基本的模型加载、材质系统和简单光照计算。虽然功能还比较初级，但已经可以渲染一些简单的3D场景了。在开发过程中，我学习了大量关于3D数学、着色器编程和渲染管线的知识。',
    createdAt: '2025-03-10T13:50:00.000Z',
    updatedAt: '2025-03-15T16:20:00.000Z',
    category: 'work',
    coverImage: 'https://picsum.photos/id/210/800/600'
  }
];

// 格式化日期的辅助函数
function formatDate(dateString) {
  if (!dateString) return '未知日期';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 获取分类名称
function getCategoryName(category) {
  const categoryMap = {
    'study': '学习',
    'game': '游戏',
    'work': '个人作品',
    'resource': '资源分享',
    'other': '其他'
  };
  return categoryMap[category] || '未分类';
}

// 获取分类徽章样式
function getCategoryBadgeClass(category) {
  const classMap = {
    'study': 'bg-primary',
    'game': 'bg-warning text-dark',
    'work': 'bg-success',
    'resource': 'bg-info text-dark',
    'other': 'bg-secondary'
  };
  return classMap[category] || 'bg-secondary';
}

async function fetchArticle() {
  const id = route.params.id;
  if (!id) {
    error.value = new Error('未提供文章ID');
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // 将字符串ID转换为数字以便匹配
    const articleId = parseInt(id);
    
    // 从静态数据中查找文章
    const foundArticle = sampleArticles.find(article => article.id === articleId);
    
    if (foundArticle) {
      article.value = foundArticle;
    } else {
      throw new Error('文章不存在');
    }
  } catch (e) {
    error.value = e;
    console.error(`获取文章 ${id} 失败:`, e);
  } finally {
    loading.value = false;
  }
}

// 返回文章列表，保持原来的页码和筛选条件
const goBackToList = () => {
  const query = {};
  
  // 获取返回页码
  const returnPage = route.query.returnPage;
  
  // 如果有搜索参数，保持搜索状态
  if (route.query.search) {
    query.search = route.query.search;
  }
  
  // 如果有分类参数，保持分类状态
  if (route.query.category) {
    query.category = route.query.category;
  }
  
  // 构造返回路由
  const returnRoute = {
    name: 'ArticleList',
    query
  };
  
  // 如果有返回页码，需要在跳转后设置页码
  if (returnPage) {
    router.push(returnRoute).then(() => {
      // 通过URL hash来传递页码信息，让ArticleList组件处理
      router.replace({
        ...returnRoute,
        hash: `#page=${returnPage}`
      });
    });
  } else {
    router.push(returnRoute);
  }
};

// 删除功能已经移除

onMounted(() => {
  fetchArticle();
});
</script>

<style scoped>
/* 响应式容器样式 */
.article-container {
  width: 100%;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 封面图片样式 */
.article-cover {
  width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cover-image:hover {
  transform: scale(1.02);
}

.article-title {
  color: #343a40;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
  transition: color 0.3s ease;
}

.article-meta {
  color: #6c757d;
  margin-bottom: 1.5rem;
  transition: color 0.3s ease;
}

/* 底部操作区域样式 */
.article-bottom-actions {
  border-top: 2px solid #e9ecef;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  border-radius: 0 0 0.5rem 0.5rem;
  margin: 0 -1.25rem -1.25rem -1.25rem;
  padding: 2rem 1.25rem;
}

.article-bottom-actions .btn {
  padding: 0.75rem 2rem;
  font-weight: 600;
  border-radius: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(13, 110, 253, 0.2);
}

.article-bottom-actions .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 110, 253, 0.3);
}

/* 文章内容样式 */
.article-content-html {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #333;
  transition: color 0.3s ease;
}

/* 富文本内容样式 */
.article-content-html ::v-deep(h1),
.article-content-html ::v-deep(h2),
.article-content-html ::v-deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.article-content-html ::v-deep(h1) {
  font-size: 1.75rem;
}

.article-content-html ::v-deep(h2) {
  font-size: 1.5rem;
}

.article-content-html ::v-deep(h3) {
  font-size: 1.25rem;
}

.article-content-html ::v-deep(p) {
  margin-bottom: 1rem;
}

.article-content-html ::v-deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
}

.article-content-html ::v-deep(pre) {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 0.25rem;
  margin: 1rem 0;
  overflow: auto;
}

.article-content-html ::v-deep(blockquote) {
  border-left: 0.25rem solid #adb5bd;
  padding-left: 1rem;
  color: #6c757d;
  margin: 1rem 0;
}

.article-content-html ::v-deep(ul),
.article-content-html ::v-deep(ol) {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.article-content-html ::v-deep(a) {
  color: #0d6efd;
  text-decoration: none;
}

.article-content-html ::v-deep(a:hover) {
  text-decoration: underline;
}

/* 暗色主题支持 */
[data-bs-theme="dark"] .article-container {
  background-color: var(--bs-dark);
  color: #ffffff;
}

[data-bs-theme="dark"] .article-cover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

[data-bs-theme="dark"] .article-title {
  color: #ffffff;
}

[data-bs-theme="dark"] .article-meta {
  color: #adb5bd;
}

[data-bs-theme="dark"] .article-bottom-actions {
  border-top-color: #495057;
  background: linear-gradient(135deg, #2d3748, #1a1a1a);
}

[data-bs-theme="dark"] .article-content-html {
  color: #dee2e6;
}

[data-bs-theme="dark"] .article-content-html ::v-deep(h1),
[data-bs-theme="dark"] .article-content-html ::v-deep(h2),
[data-bs-theme="dark"] .article-content-html ::v-deep(h3) {
  color: #ffffff;
}

[data-bs-theme="dark"] .article-content-html ::v-deep(p) {
  color: #dee2e6;
}

[data-bs-theme="dark"] .article-content-html ::v-deep(pre) {
  background-color: #2d3748;
  color: #e2e8f0;
}

[data-bs-theme="dark"] .article-content-html ::v-deep(blockquote) {
  border-left-color: #6c757d;
  color: #adb5bd;
}

[data-bs-theme="dark"] .article-content-html ::v-deep(a) {
  color: #60a5fa;
}

[data-bs-theme="dark"] .article-content-html ::v-deep(a:hover) {
  color: #93c5fd;
}
</style>