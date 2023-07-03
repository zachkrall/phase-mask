/* eslint-env node */
import path from 'path'
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr-component'

export default defineConfig({
  base: './',
  server: {
    https: true,
  },
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
})
