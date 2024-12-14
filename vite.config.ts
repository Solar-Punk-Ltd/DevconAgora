import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.FEED_OWNER_ADDRESS":
        JSON.stringify(env.FEED_OWNER_ADDRESS) ??
        JSON.stringify("f4ba07294929857359929d55bec87fc869487c73"),
      "process.env.STAMP":
        JSON.stringify(env.STAMP) ??
        JSON.stringify(
          "0000000000000000000000000000000000000000000000000000000000000000"
        ),
      "process.env.PR_NUMBER":
        JSON.stringify(env.PR_NUMBER) ?? JSON.stringify("unknown-version"),
      "process.env.PR_TIMESTAMP":
        JSON.stringify(env.PR_TIMESTAMP) ?? JSON.stringify("unknown-timestamp"),
      "process.env.HEALTH_CHECK_DATA_REF":
        JSON.stringify(env.HEALTH_CHECK_DATA_REF) ??
        JSON.stringify(
          "2fdbf84ba761d65f3b848f22cf3c0f6899c61ada4347b9a1b3fcf0ea27dde6b3"
        ),
      "process.env.BEE_API_URL":
        JSON.stringify(env.BEE_API_URL) ??
        JSON.stringify("http://localhost:1633/"),
      "process.env.BACKEND_API_URL":
        JSON.stringify(env.BACKEND_API_URL) ??
        JSON.stringify(
          "https://devcon-backend-1074429022647.asia-southeast1.run.app/"
        ),
      "process.env.GATEWAY": JSON.stringify(env.GATEWAY) ?? JSON.stringify(""),
      "process.versions": JSON.stringify({ node: "browser-mock" }), // Mocking process.versions.node
      "process.env.ENV": JSON.stringify(env.ENV) ?? JSON.stringify("dev"),
    },
    plugins: [
      react(),
      nodePolyfills({
        globals: { process: true, Buffer: true },
      }),
    ],
    base: env.BASE_URL ?? "/DevconAgora/",
    resolve: {
      alias: {
        stream: "stream-browserify",
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler", // or 'modern'
        },
      },
    },
    server: {
      watch: {
        usePolling: true,
      },
      host: true,
      strictPort: true,
      port: 5173,
    },
  };
});
