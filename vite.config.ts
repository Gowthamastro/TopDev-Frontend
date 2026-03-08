import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Data fetching / state
          'vendor-query': ['@tanstack/react-query', 'axios', 'zustand'],
          // Charts
          'vendor-charts': ['recharts'],
          // Icons
          'vendor-icons': ['lucide-react'],
          // Forms / validation
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Monaco editor (heaviest dependency — split out)
          'vendor-monaco': ['@monaco-editor/react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
