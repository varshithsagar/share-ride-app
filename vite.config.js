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
    // Bind explicitly to IPv4 loopback to avoid localhost/IPv6 edge cases
    host: '127.0.0.1',
    // Use a stable dev port; combined with strictPort this will not auto-switch
    port: 5175,
    strictPort: true
  },
  preview: {
    host: '127.0.0.1',
    port: 10000,
    strictPort: true
  }
})
