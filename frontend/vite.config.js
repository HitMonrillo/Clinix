import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/records': 'http://localhost:8000',
      '/insurance': 'http://localhost:8000',
      '/appointments': 'http://localhost:8000',
      '/chat': 'http://localhost:8000',
    },
  },
})
