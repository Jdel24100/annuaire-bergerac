import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'globalThis',
  },
  build: {
    target: 'es2020',
    outDir: 'dist'
  },
  server: {
    port: 3000,
    host: true,
  }
})