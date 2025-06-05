import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/PersonalBlog/', // GitHub Pages 仓库名
  server: {
    port: 5174, 
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 确保生成的文件路径正确
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  }
})
