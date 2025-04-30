import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

// Load env variables
const isProd = process.env.NODE_ENV === "production";

const frontendPort = isProd
  ? process.env.PROD_FRONTEND_PORT || 3000
  : process.env.DEV_FRONTEND_PORT || 3000;

const frontendHost = isProd
  ? process.env.PROD_FRONTEND_HOST || "localhost"
  : process.env.DEV_FRONTEND_HOST || "localhost";

const backendPort = isProd
  ? process.env.PROD_BACKEND_PORT || 3001
  : process.env.DEV_BACKEND_PORT || 3001;

const backendHost = isProd
  ? process.env.PROD_BACKEND_HOST || "localhost"
  : process.env.DEV_BACKEND_HOST || "localhost";

const apiUrl = isProd
  ? `http://${backendHost}:${backendPort}/api`
  : `http://${backendHost}:${backendPort}/api`;

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  envDir: resolve(__dirname, ".."),
  server: {
    port: frontendPort,
    host: frontendHost,
  },
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(apiUrl),
  },
});
