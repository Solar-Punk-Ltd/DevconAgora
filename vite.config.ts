import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.DEVCON6_SESSSIONS_HASH': JSON.stringify(env.DEVCON6_SESSSIONS_HASH) ?? JSON.stringify(''),
      'process.env.BEE_API_URL': JSON.stringify(env.BEE_API_URL) ?? JSON.stringify('http://localhost:1633/'),
      'process.env.FEED_OWNER_ADDRESS': JSON.stringify(env.FEED_OWNER_ADDRESS) ?? JSON.stringify('5F7b9cc47803fD4586E92c1702b114B22DB5dd4f')
    },
    plugins: [react()],
    base: '/DevconAgora/',
  }
})