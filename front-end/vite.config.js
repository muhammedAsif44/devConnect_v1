import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    strictPort: true,   // fail if port is in use
  },
  build: {
    outDir: 'dist',
  },
  // SPA fallback for React Router
  // Any route not found will serve index.html
  // This allows refresh and direct URL access to work
  optimizeDeps: {
    include: [],
  },
  resolve: {
    alias: {},
  },
})
