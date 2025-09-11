import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const basePath = env.BASE_URL ?? "/";
  const isRelativePath = basePath === "./" || basePath.startsWith("./");
  const routerBasename = isRelativePath ? "" : basePath;

  return {
    define: {
      "process.env.FEED_OWNER_ADDRESS": JSON.stringify(env.FEED_OWNER_ADDRESS) ?? JSON.stringify("1b3fdde3cf9e2b76ea620756040effc3b3276d4f"),
      "process.env.STAMP": JSON.stringify(env.STAMP) ?? JSON.stringify("0000000000000000000000000000000000000000000000000000000000000000"),
      "process.env.HEALTH_CHECK_DATA_REF":
        JSON.stringify(env.HEALTH_CHECK_DATA_REF) ?? JSON.stringify("2fdbf84ba761d65f3b848f22cf3c0f6899c61ada4347b9a1b3fcf0ea27dde6b3"),
      "process.env.BEE_API_URL": JSON.stringify(env.BEE_API_URL) ?? JSON.stringify("http://localhost:1633/"),
      "process.env.BACKEND_API_URL":
        JSON.stringify(env.BACKEND_API_URL) ?? JSON.stringify("https://devcon-backend-1074429022647.asia-southeast1.run.app/"),
      "process.versions": JSON.stringify({ node: "browser-mock" }), // Mocking process.versions.node
      "process.env.ENV": JSON.stringify(env.ENV) ?? JSON.stringify("dev"),
      "process.env.ROUTER_BASENAME": JSON.stringify(routerBasename),
      "process.env.SWARM": JSON.stringify(env.SWARM) ?? JSON.stringify("false"),
      "process.env.POPPINS_FONT_HASH": JSON.stringify(env.POPPINS_FONT_HASH) ?? JSON.stringify(""),
      "process.env.INTER_FONT_HASH": JSON.stringify(env.INTER_FONT_HASH) ?? JSON.stringify(""),
      "process.env.PUBLICSANS_FONT_HASH": JSON.stringify(env.PUBLICSANS_FONT_HASH) ?? JSON.stringify(""),
      "process.env.BEBAS_FONT_HASH": JSON.stringify(env.BEBAS_FONT_HASH) ?? JSON.stringify(""),
    },
    plugins: [
      react(),
      nodePolyfills({
        globals: { process: true, Buffer: true },
      }),
    ],
    base: basePath,
    resolve: {
      alias: {
        stream: "stream-browserify",
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      watch: {
        usePolling: true,
      },
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      host: true,
      strictPort: true,
      port: 5173,
    },
  };
});
