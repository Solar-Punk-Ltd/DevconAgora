import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {

    plugins: [react()],
    base: '/DevconAgora/',
    build: {
      sourcemap: true,
      rollupOptions: {
        external: ['react', 'react-dom'],
      },
    },
    resolve: {
      alias: {
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom')
      }
    }
  }
})