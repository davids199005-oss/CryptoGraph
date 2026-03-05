import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: '/CryptoGraph/',
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        const src = path.resolve(__dirname, 'dist/index.html')
        const dest = path.resolve(__dirname, 'dist/404.html')
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest)
        }
      },
    },
  ],
  server: { open: true },
})
