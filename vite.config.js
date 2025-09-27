import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        ranking: resolve(__dirname, 'public/ranking.html'),
        admin: resolve(__dirname, 'public/admin.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})