<template>
  <div class="article-list-page" ref="articleListContainer">
    <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
      <h2 class="mb-0">{{ pageTitle }}</h2>
    </div>
    
    <div v-if="error" class="alert alert-danger" role="alert">
      加载或操作文章失败: {{ error.message }}
    </div>
    
    <div v-if="route.query.search" class="mb-4">
      <div class="alert alert-info">
        搜索结果： "{{ route.query.search }}"
        <button class="btn btn-sm btn-outline-secondary ms-3" @click="clearSearch">
          <i class="bi bi-x-circle me-1"></i>清除搜索
        </button>
      </div>
    </div>    <!-- 显示筛选结果 -->
    <template v-if="route.query.search || route.query.category">
      <div v-if="paginatedFilteredArticles.length" class="articles-container">
        <div 
          v-for="(article, index) in paginatedFilteredArticles" 
          :key="article.id" 
          :class="['article-card', 'animate__animated', 'animate__fadeInUp', { 'article-card-reverse': (currentFilteredIndex + index + 1) % 2 === 0 }]"          :style="{ animationDelay: `${index * 0.1}s` }"
        >          <!-- 封面图片区域 -->
          <div class="article-image-section">
            <img
              v-if="article.coverImage && article.coverImage !== 'null'"
              :src="article.coverImage"
              :alt="article.title"
              class="article-image"
              style="height: 300px; aspect-ratio: 16/9; object-fit: cover; width: 100%;"
              @error="handleImageError"
            />
            <div v-else class="article-image-placeholder">
              <i class="bi bi-image fs-1 text-muted"></i>
            </div>
          </div>

          <!-- 内容区域 -->          <div class="article-content-section">
            <div class="article-meta mb-2">
              <span class="article-date">{{ formatDate(article.createdAt) }}</span>
              <span :class="['article-category', getCategoryClass(article.category)]">
                {{ getCategoryName(article.category) }}
              </span>
            </div>

            <router-link :to="getArticleDetailRoute(article.id)" class="article-title-link">
              <h3 class="article-title">{{ article.title }}</h3>
            </router-link>

            <div class="article-excerpt">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="getExcerpt(article.content)" class="article-content-preview"></div>
            </div>

            <router-link :to="getArticleDetailRoute(article.id)" class="read-more-btn">
              阅读全文
              <i class="bi bi-arrow-right ms-1"></i>
            </router-link>
          </div>
        </div>      </div>
      
      <!-- 分页控件 - 筛选结果 -->
      <div v-if="totalFilteredPages > 1" class="pagination-container mt-4">
        <nav aria-label="筛选结果分页">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentFilteredPage === 1 }">
              <button class="page-link" @click="goToFilteredPage(currentFilteredPage - 1)" :disabled="currentFilteredPage === 1">
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>
            
            <li v-for="page in getFilteredPageNumbers()" :key="page" class="page-item" :class="{ active: page === currentFilteredPage }">
              <button v-if="page === '...'" class="page-link disabled">...</button>
              <button v-else class="page-link" @click="goToFilteredPage(page)">{{ page }}</button>
            </li>
            
            <li class="page-item" :class="{ disabled: currentFilteredPage === totalFilteredPages }">
              <button class="page-link" @click="goToFilteredPage(currentFilteredPage + 1)" :disabled="currentFilteredPage === totalFilteredPages">
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
        
        <div class="text-center text-muted mt-2">
          共 {{ filteredArticles.length }} 篇文章，第 {{ currentFilteredPage }} / {{ totalFilteredPages }} 页
        </div>
      </div>
    </template>
    
    <!-- 默认显示所有文章 -->
    <template v-else>
      <div v-if="paginatedArticles.length" class="articles-container">        <div 
          v-for="(article, index) in paginatedArticles" 
          :key="article.id" 
          :class="['article-card', 'animate__animated', 'animate__fadeInUp', { 'article-card-reverse': (currentIndex + index + 1) % 2 === 0 }]"          :style="{ animationDelay: `${index * 0.1}s` }"
        >          <!-- 封面图片区域 -->
          <div class="article-image-section">
            <img
              v-if="article.coverImage && article.coverImage !== 'null'"
              :src="article.coverImage"
              :alt="article.title"
              class="article-image"
              style="height: 300px; aspect-ratio: 16/9; object-fit: cover; width: 100%;"
              @error="handleImageError"
            />
            <div v-else class="article-image-placeholder">
              <i class="bi bi-image fs-1 text-muted"></i>
            </div>
          </div>

          <!-- 内容区域 -->
          <div class="article-content-section"><div class="article-meta mb-2">
              <span class="article-date">{{ formatDate(article.createdAt) }}</span>
              <span :class="['article-category', getCategoryClass(article.category)]">
                {{ getCategoryName(article.category) }}
              </span>
            </div>

            <router-link :to="getArticleDetailRoute(article.id)" class="article-title-link">
              <h3 class="article-title">{{ article.title }}</h3>
            </router-link>

            <div class="article-excerpt">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="getExcerpt(article.content)" class="article-content-preview"></div>
            </div>

            <router-link :to="getArticleDetailRoute(article.id)" class="read-more-btn">
              阅读全文
              <i class="bi bi-arrow-right ms-1"></i>
            </router-link>
          </div>
        </div>      </div>
        <!-- 分页控件 - 所有文章 -->
      <div v-if="totalPages > 1" class="pagination-container mt-4 animate__animated animate__fadeInUp">
        <nav aria-label="文章分页">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link page-btn" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>
            
            <li v-for="page in getPageNumbers()" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <button v-if="page === '...'" class="page-link disabled">...</button>
              <button v-else class="page-link page-btn" @click="goToPage(page)">{{ page }}</button>
            </li>
            
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link page-btn" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
        
        <div class="text-center text-muted mt-2 animate__animated animate__fadeIn animate__delay-0.5s">
          共 {{ articles.length }} 篇文章，第 {{ currentPage }} / {{ totalPages }} 页
        </div>
      </div>
      
      <div v-else class="alert alert-info text-center animate__animated animate__fadeIn" role="alert">
        暂无文章
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { debounce, preloadImages } from '../utils/lazyLoad.js';
import './ArticleList.styles.css';

// 创建ref来引用ArticleList容器
const articleListContainer = ref(null);
const articles = ref([]);
const error = ref(null);
const route = useRoute();
const router = useRouter();

// 分页相关变量
const currentPage = ref(1);
const currentFilteredPage = ref(1);
const articlesPerPage = 8;

// 静态示例文章数据 - 用于前端展示
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

// 根据路由参数计算页面标题
const pageTitle = computed(() => {
  if (route.query.search) return '搜索结果';
  if (route.query.category === 'study') return '学习';
  if (route.query.category === 'game') return '游戏';
  if (route.query.category === 'work') return '个人作品';
  if (route.query.category === 'resource') return '资源分享';
  return '文章列表';
});

// 根据搜索关键词或分类筛选文章
const filteredArticles = computed(() => {
  if (route.query.search) {
    const searchTerm = route.query.search.toLowerCase();
    return articles.value.filter(article => {
      return article.title.toLowerCase().includes(searchTerm) ||
             (article.contentMarkdown && article.contentMarkdown.toLowerCase().includes(searchTerm)) ||
             article.content.toLowerCase().includes(searchTerm);
    });
  } else if (route.query.category) {
    // 直接使用路由参数中的category值过滤文章
    return articles.value.filter(article => article.category === route.query.category);
  }
  return articles.value;
});

// 分页计算
const totalPages = computed(() => Math.ceil(articles.value.length / articlesPerPage));
const totalFilteredPages = computed(() => Math.ceil(filteredArticles.value.length / articlesPerPage));

// 当前页的文章
const currentIndex = computed(() => (currentPage.value - 1) * articlesPerPage);
const currentFilteredIndex = computed(() => (currentFilteredPage.value - 1) * articlesPerPage);

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage;
  const end = start + articlesPerPage;
  return articles.value.slice(start, end);
});

const paginatedFilteredArticles = computed(() => {
  const start = (currentFilteredPage.value - 1) * articlesPerPage;
  const end = start + articlesPerPage;
  return filteredArticles.value.slice(start, end);
});

// 获取分类中文名称
const getCategoryName = (category) => {
  const categoryMap = {
    'study': '学习',
    'game': '游戏',
    'work': '个人作品',
    'resource': '资源分享'
  };
  return categoryMap[category] || '其他';
};

// 获取分类样式类
const getCategoryClass = (category) => {
  const categoryClassMap = {
    'study': 'category-study',
    'game': 'category-game', 
    'work': 'category-work',
    'resource': 'category-resource'
  };
  return categoryClassMap[category] || 'category-other';
};

// 获取文章摘要
const getExcerpt = (content) => {
  if (!content) return '';
  // 移除HTML标签并限制字数
  const plainText = content.replace(/<[^>]*>/g, '');
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
};

// 清除搜索
const clearSearch = () => {
  router.push({ name: 'ArticleList' });
};

// 生成文章详情路由，包含当前页面信息
const getArticleDetailRoute = (articleId) => {
  const query = {};
  
  // 如果当前是筛选状态，传递筛选页码
  if (route.query.search || route.query.category) {
    query.returnPage = currentFilteredPage.value;
  } else {
    // 否则传递普通页码
    query.returnPage = currentPage.value;
  }
  
  // 保持原有的搜索和分类参数
  if (route.query.search) {
    query.search = route.query.search;
  }
  if (route.query.category) {
    query.category = route.query.category;
  }
  
  const detailRoute = {
    path: `/article/${articleId}`,
    query
  };
  
  console.log('生成文章详情路由:', detailRoute); // 调试日志
  return detailRoute;
};

// 分页方法
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // 滚动到ArticleList容器的顶部而不是页面顶部
    if (articleListContainer.value) {
      articleListContainer.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};

const goToFilteredPage = (page) => {
  if (page >= 1 && page <= totalFilteredPages.value) {
    currentFilteredPage.value = page;
    // 滚动到ArticleList容器的顶部而不是页面顶部
    if (articleListContainer.value) {
      articleListContainer.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};

// 获取页码数组（智能省略）
const getPageNumbers = () => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    
    if (current > 4) {
      pages.push('...');
    }
    
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (current < total - 3) {
      pages.push('...');
    }
    
    pages.push(total);
  }
  
  return pages;
};

const getFilteredPageNumbers = () => {
  const total = totalFilteredPages.value;
  const current = currentFilteredPage.value;
  const pages = [];
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    
    if (current > 4) {
      pages.push('...');
    }
    
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (current < total - 3) {
      pages.push('...');
    }
    
    pages.push(total);
  }
  
  return pages;
};

// 处理图片加载错误
const handleImageError = (event) => {
  // 隐藏加载失败的图片
  event.target.style.display = 'none';
};

// 格式化日期的辅助函数
function formatDate(dateString) {
  if (!dateString) return '未知日期';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
}

// 监听路由变化，重新获取文章
watch(() => route.query, (newQuery, oldQuery) => {
  // 只有当搜索或分类参数变化时才重置分页，忽略returnPage参数的变化
  const newSearch = newQuery.search;
  const oldSearch = oldQuery?.search;
  const newCategory = newQuery.category;
  const oldCategory = oldQuery?.category;
  
  if (newSearch !== oldSearch || newCategory !== oldCategory) {
    // 重置分页
    currentPage.value = 1;
    currentFilteredPage.value = 1;
    loadArticles(); // 使用本地函数加载文章
  }
}, { deep: true });

// 替换原有的fetchArticles函数，使用本地示例数据
function loadArticles() {
  error.value = null;
  try {
    // 使用示例数据
    if (route.query.category) {
      // 根据分类过滤文章
      articles.value = sampleArticles.filter(article => article.category === route.query.category);
    } else {
      // 不过滤，显示全部
      articles.value = [...sampleArticles];
    }
  } catch (e) {
    error.value = e;
    console.error("加载文章失败:", e);
  }
}

onMounted(async () => {
  // 加载示例文章数据
  loadArticles();
  
  // 检查URL hash中是否有页码信息
  if (route.hash && route.hash.startsWith('#page=')) {
    const pageNum = parseInt(route.hash.replace('#page=', ''));
    
    if (!isNaN(pageNum) && pageNum > 0) {
      // 使用nextTick确保DOM更新后再设置页码
      await new Promise(resolve => setTimeout(resolve, 100)); // 给计算属性一些时间更新
      
      // 根据当前是否在筛选状态来设置相应的页码
      if (route.query.search || route.query.category) {
        if (pageNum <= totalFilteredPages.value) {
          currentFilteredPage.value = pageNum;
        }
      } else {
        if (pageNum <= totalPages.value) {
          currentPage.value = pageNum;
        }
      }
      
      // 清除hash，避免页面刷新时重复处理
      router.replace({ ...route, hash: '' });
    }
  }
});
</script>
