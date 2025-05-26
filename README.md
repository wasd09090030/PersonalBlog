# 个人博客系统

这是一个完整的全栈个人博客系统，采用前后端分离的B/S架构，支持文章管理、分类浏览、搜索功能，并内置了音乐播放器和管理员后台。

## 🚀 技术栈

### 前端技术
- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Vue Router** - 官方路由管理器
- **Bootstrap 5** - 响应式 CSS 框架
- **Bootstrap Icons** - 图标库
- **Markdown Editor** - 支持 Markdown 编辑和预览

### 后端技术
- **NestJS** - 基于 TypeScript 的 Node.js 框架
- **TypeORM** - TypeScript ORM 框架
- **SQLite** - 轻量级数据库
- **Markdown-it** - Markdown 解析器
- **Express** - HTTP 服务器框架

## 🌐 前后端通信

### API 接口设计
- **RESTful API** - 遵循 REST 架构风格
- **HTTP/JSON** - 数据交换格式
- **CORS** - 跨域资源共享支持
- **JWT 认证** - 管理员身份验证（计划中）

### 主要 API 端点
```
GET    /articles              # 获取所有文章
GET    /articles/:id          # 获取指定文章
GET    /articles/category/:category  # 获取分类文章
POST   /articles              # 创建文章（需管理员权限）
PUT    /articles/:id          # 更新文章（需管理员权限）
DELETE /articles/:id          # 删除文章（需管理员权限）
```

## 🖥️ 后端实现

### 项目结构
```
backend/
├── src/
│   ├── app.module.ts          # 应用主模块
│   ├── main.ts                # 应用入口
│   └── article/               # 文章模块
│       ├── article.controller.ts  # 控制器层
│       ├── article.service.ts     # 业务逻辑层
│       ├── article.entity.ts      # 数据实体
│       └── dto/               # 数据传输对象
└── blog.sqlite               # SQLite 数据库文件
```

### 核心功能
- **文章 CRUD** - 完整的文章增删改查
- **分类管理** - 支持文章分类（学习、游戏、个人作品）
- **数据持久化** - 使用 TypeORM + SQLite
- **自动种子数据** - 启动时自动初始化示例文章
- **Markdown 支持** - 原生支持 Markdown 格式文章

## 🎨 前端实现

### 项目结构
```
src/
├── components/                # 组件目录
│   ├── ArticleList.vue       # 文章列表组件
│   ├── ArticleDetail.vue     # 文章详情组件
│   ├── MusicPlayer.vue       # 音乐播放器
│   ├── SearchBar.vue         # 搜索栏组件
│   ├── PersonalInfo.vue      # 个人信息组件
│   ├── WelcomeSection.vue    # 欢迎页面
│   └── Toast.vue             # 消息提示组件
├── views/admin/               # 管理员页面
├── layouts/                   # 布局组件
├── services/                  # API 服务层
├── store/                     # 状态管理
└── assets/                    # 静态资源
```

### 主要功能
- **响应式设计** - 支持移动端和桌面端
- **文章浏览** - 分页展示、分类筛选、搜索功能
- **管理后台** - 完整的文章管理功能
- **音乐播放器** - 支持上一首/下一首控制
- **主题切换** - 支持明暗主题切换
- **Markdown 渲染** - 实时预览和语法高亮

### 特色组件
- **MusicPlayer** - 浮动式音乐播放器，支持多首歌曲循环播放
- **SearchBar** - 实时搜索功能，支持标题和内容搜索
- **ArticleEditor** - 所见即所得的 Markdown 编辑器
- **Toast** - 全局消息提示系统

## 🛠️ 启动项目

### 1. 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0

### 2. 安装依赖

```bash
# 前端依赖
npm install

# 后端依赖
cd backend
npm install
cd ..
```

### 3. 启动后端服务

```bash
cd backend
npm run start:dev
```

后端服务将在 `http://localhost:3000` 启动

### 4. 启动前端开发服务器

```bash
npm run dev
```

前端开发服务器将在 `http://localhost:5173` 启动（端口可能根据占用情况自动调整）

### 5. 访问应用

- **前端页面**: http://localhost:5173
- **后端 API**: http://localhost:3000
- **管理后台**: http://localhost:5173/admin/login

### 6. 管理员登录

默认管理员密码：`admin123`

## 📦 构建部署

```bash
# 构建前端
npm run build

# 构建后端
cd backend
npm run build

# 生产环境启动后端
npm run start:prod
```

## 🎵 特色功能

- **音乐播放器** - 内置三首背景音乐，支持循环播放
- **响应式设计** - 完美适配各种设备尺寸
- **管理后台** - 功能完整的文章管理系统
- **实时搜索** - 快速定位目标文章
- **主题切换** - 明暗两种主题模式

## 📝 开发说明

本项目采用前后端分离架构，前端负责用户界面和交互，后端提供 API 接口和数据管理。所有数据通过 HTTP 请求进行交换，支持跨域访问。
   
