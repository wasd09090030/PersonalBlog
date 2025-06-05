# 个人博客 - GitHub Pages 部署指南

这是一个基于 Vue 3 + Vite 构建的个人博客静态网站，可以部署到 GitHub Pages。

## 🚀 部署步骤

### 1. 创建 GitHub 仓库

1. 登录到您的 GitHub 账号 (wasd09090030)
2. 创建一个新仓库，命名为 `PersonalBlog`
3. 设置为 Public 仓库（GitHub Pages 免费版需要）

### 2. 推送代码到 GitHub

在项目根目录执行以下命令：

```bash
# 初始化 Git 仓库
git init

# 添加远程仓库
git remote add origin https://github.com/wasd09090030/PersonalBlog.git

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: Personal blog with sample articles"

# 推送到 main 分支
git push -u origin main
```

### 3. 配置 GitHub Pages

1. 进入仓库的 Settings 页面
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分选择 "GitHub Actions"
4. 保存设置

### 4. 自动部署

代码推送后，GitHub Actions 会自动：
- 安装依赖
- 构建项目
- 部署到 gh-pages 分支

部署完成后，您的网站将在以下地址访问：
**https://wasd09090030.github.io/PersonalBlog/**

## 📁 项目结构

```
PersonalBlog/
├── src/
│   ├── components/
│   │   ├── ArticleList.vue      # 文章列表页
│   │   ├── ArticleDetail.vue    # 文章详情页
│   │   └── ...
│   ├── router.js               # 路由配置
│   └── main.js                 # 入口文件
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 配置
├── dist/                       # 构建输出目录
├── vite.config.js             # Vite 配置
└── package.json               # 依赖配置
```

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## ✨ 功能特性

- ✅ 响应式设计，支持移动端
- ✅ 12篇示例文章，包含多种分类
- ✅ 文章搜索和分类过滤
- ✅ 分页功能
- ✅ 动画效果
- ✅ 暗色主题支持
- ✅ 静态部署，无需后端

## 📝 文章管理

当前包含的示例文章分类：
- **学习** (4篇): Vue3、前端性能优化、JavaScript异步编程、响应式布局
- **游戏** (3篇): 赛博朋克2077、艾尔登法环、原神
- **个人作品** (3篇): 个人网站、音乐播放器、3D渲染引擎
- **资源分享** (2篇): 开发工具推荐、免费设计资源

## 🔄 更新网站

要添加新文章或修改现有内容：

1. 编辑 `src/components/ArticleList.vue` 和 `src/components/ArticleDetail.vue` 中的 `sampleArticles` 数组
2. 提交并推送代码到 GitHub
3. GitHub Actions 会自动重新部署

## 📞 技术支持

如果遇到部署问题，请检查：
- GitHub Actions 的运行日志
- 仓库是否设置为 Public
- GitHub Pages 是否正确配置为使用 GitHub Actions

### 常见问题解决方案

#### 404错误问题
如果访问网站时出现404错误，请按以下步骤排查：

1. **检查GitHub Pages设置**
   - 进入仓库 Settings > Pages
   - 确保Source设置为 "GitHub Actions"
   - 不要选择 "Deploy from a branch"

2. **检查GitHub Actions状态**
   - 进入仓库的 Actions 标签页
   - 查看最近的工作流是否成功执行
   - 如果失败，点击查看详细日志

3. **检查权限设置**
   - 进入 Settings > Actions > General
   - 确保 "Allow all actions and reusable workflows" 已选中
   - 在 "Workflow permissions" 中选择 "Read and write permissions"

4. **验证文件配置**
   - 确认 `vite.config.js` 中 base 设置为 `/PersonalBlog/`
   - 确认 `src/router.js` 中路由设置正确
   - 确认 `public/404.html` 文件存在

#### 如果仍然无法访问
1. 等待5-10分钟，GitHub Pages部署需要一些时间
2. 尝试硬刷新浏览器 (Ctrl+F5)
3. 检查网络连接和DNS设置

## 🌐 访问地址

部署成功后，您的个人博客将在以下地址上线：
**https://wasd09090030.github.io/PersonalBlog/**
