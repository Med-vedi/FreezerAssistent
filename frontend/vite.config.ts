import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
  },
  server: {
    // historyApiFallback: true, // Ensures proper routing in dev mode
  },
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@models': '/src/models',
      '@utils': '/src/utils',
      '@hooks': '/src/hooks',
      '@pages': '/src/pages',
      '@styles': '/src/styles',
      '@contexts': '/src/contexts',
    },
  },
})
