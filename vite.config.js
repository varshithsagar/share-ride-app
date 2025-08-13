import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    // Expose on LAN for testing from other devices
    host: '0.0.0.0',
    // Use a stable dev port; combined with strictPort this will not auto-switch
    port: 5175,
    strictPort: true
  },
  preview: {
    host: '0.0.0.0',
    port: 10000,
    strictPort: true
  }
})
