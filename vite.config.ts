import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
    }
  }
})