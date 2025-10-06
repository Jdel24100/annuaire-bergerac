import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration Vite spécifique pour Vercel
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  define: {
    global: 'globalThis',
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  esbuild: {
    target: 'es2020',
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'motion/react',
      'lucide-react'
    ],
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    sourcemap: false,
    emptyOutDir: true,
    reportCompressedSize: false, // Plus rapide en production
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('motion/react') || id.includes('motion-dom')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            return 'vendor-misc';
          }
          
          // Page chunks pour lazy loading
          if (id.includes('components/HomePage')) return 'page-home';
          if (id.includes('components/AdminPage')) return 'page-admin';
          if (id.includes('components/DashboardPage')) return 'page-dashboard';
          if (id.includes('components/BlogPage')) return 'page-blog';
          if (id.includes('components/DirectoryPage')) return 'page-directory';
          if (id.includes('components/SearchPage')) return 'page-search';
          if (id.includes('components/AuthPages')) return 'page-auth';
          
          // UI components chunk
          if (id.includes('components/ui/')) return 'ui-components';
          
          // Utils chunk
          if (id.includes('utils/') || id.includes('hooks/')) return 'utils';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    chunkSizeWarningLimit: 500,
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  }
})