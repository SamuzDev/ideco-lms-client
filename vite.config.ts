import { defineConfig } from 'vite'
import path from "path"
import viteCompression from 'vite-plugin-compression';
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteCompression({
    algorithm: 'gzip',
    threshold: 1024,
  }),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
