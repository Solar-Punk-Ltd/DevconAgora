import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.FEED_OWNER_ADDRESS': JSON.stringify(env.FEED_OWNER_ADDRESS) ?? JSON.stringify('5F7b9cc47803fD4586E92c1702b114B22DB5dd4f'),
      'process.env.HEALTH_CHECK_DATA_REF': JSON.stringify(env.HEALTH_CHECK_DATA_REF) ?? JSON.stringify('2fdbf84ba761d65f3b848f22cf3c0f6899c61ada4347b9a1b3fcf0ea27dde6b3'),
      'process.env.DEVCON6_SESSSIONS_HASH': JSON.stringify(env.DEVCON6_SESSSIONS_HASH) ?? JSON.stringify(''),
      'process.env.BEE_API_URL': JSON.stringify(env.BEE_API_URL) ?? JSON.stringify('http://localhost:1633/'),
      'process.versions': JSON.stringify({ node: 'browser-mock' }), // Mocking process.versions.node
    },
    plugins: [
      react(),
      nodePolyfills({
        exclude: ['fs', 'path'], // Exclude unnecessary polyfills for the browser
        globals: { process: true, Buffer: true }
      })
    ],
    base: '/DevconAgora/',
    resolve: {
      alias: {
        stream: 'stream-browserify',
      }
    }
  }
})