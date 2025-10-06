import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // Point d'entrée dans src/
  root: '.',
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: './index.html',
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['motion/react'],
          'vendor-ui': ['lucide-react', '@radix-ui/react-slot']
        }
      }
    }
  },
  
  server: {
    port: 3000,
    host: true
  },
  
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})