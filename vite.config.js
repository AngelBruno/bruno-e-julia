import { defineConfig } from 'vite'

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        ranking: 'ranking.html',
        admin: 'admin.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})