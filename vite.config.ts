import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: { host: '127.0.0.1', port: 5174, strictPort: true, proxy: { '/api': { target: 'https://api.you2mematrimonial.com', changeOrigin: true } } },
  plugins: [
    react(),
    tailwindcss(),
  ],
})

