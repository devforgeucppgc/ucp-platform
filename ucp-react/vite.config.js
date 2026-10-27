// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendTarget = process.env.VITE_API_TARGET || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true,
      },
      // ⭐ ADD THIS - Proxy uploads folder
      '/uploads': {
        target: backendTarget,
        changeOrigin: true,
      },
    },
  },
})