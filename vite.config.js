import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactSvgPlugin from 'vite-plugin-react-svg'

export default defineConfig({
  plugins: [
    react(),
    reactSvgPlugin({ defaultExport: 'component', expandProps: 'end' })
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src')
    }
  }
})
