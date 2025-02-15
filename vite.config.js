import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', 
  build: {
    outDir: 'dist',
  },
  plugins: [
    react(),
    visualizer({
      emitFile: true,
      filename: "stats.html",
    }),
  ],
  optimizeDeps: {
    include: ['@mui/material', '@emotion/styled'],
  },
})
