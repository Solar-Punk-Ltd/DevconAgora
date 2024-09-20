import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.DEVCON6_SESSSIONS_HASH': JSON.stringify(env.DEVCON6_SESSSIONS_HASH) ?? JSON.stringify(''),
      'process.env.BEE_API_URL': JSON.stringify(env.BEE_API_URL) ?? JSON.stringify('http://localhost:1633/'),
      'process.versions': JSON.stringify({ node: 'browser-mock' }), // Mocking process.versions.node
      'process.nextTick': (callback: Function) => setTimeout(callback, 0),
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
        //process: 'process/browser', // Polyfill process for browser 
      }
    }
  }
})