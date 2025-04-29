// frontend/vite.config.js
import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load env file from parent directory
  const parentEnv = loadEnv(mode, path.resolve(__dirname, ".."), "");

  return {
    plugins: [svelte()],
    server: {
      port: parseInt(parentEnv.FRONTEND_PORT) || 3000,
    },
    define: {
      // Make env variables available to your app
      "import.meta.env.BACKEND_URL": JSON.stringify(
        // BACKEND_HOST + BACKEND_PORT
        `http://${parentEnv.BACKEND_HOST}:${parentEnv.BACKEND_PORT}/api`
      ),
      "import.meta.env.FRONTEND_PORT": JSON.stringify(
        parentEnv.FRONTEND_PORT || 3000
      ),
    },
  };
});
