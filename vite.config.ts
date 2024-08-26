import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.DEVCON6_SESSSIONS_HASH': JSON.stringify(env.DEVCON6_SESSSIONS_HASH) ?? '',
      'process.env.BEE_API_URL': JSON.stringify(env.BEE_API_URL) ?? 'http://localhost:1633/'
    },
    plugins: [react()],
    base: '/DevconAgora/',
  }
})
