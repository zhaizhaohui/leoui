import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './js/index.js',
      name: 'Leoui',
      fileName: 'leoui'
    },
    rollupOptions: {
      output: {
        format: 'es'
      }
    }
  }
})