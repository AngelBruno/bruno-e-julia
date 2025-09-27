import { defineConfig } from 'vite'

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'public/index.html',
        ranking: 'public/ranking.html',
        admin: 'public/admin.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})