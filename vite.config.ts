import {defineConfig} from 'vite'
import wasm from 'vite-plugin-wasm'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
      wasm(),
      vue()
    ],
    server: {
      open: false,
      host: '0.0.0.0',
      port: 8086,
  },
  optimizeDeps: {
      exclude: ['@babylonjs/havok'],
  },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
    base: './',
})
