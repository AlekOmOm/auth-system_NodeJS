import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import path from "path";

/**
 * Vite Configuration with Uniform Environment Handling
 * 
 * Loads environment variables with priority:
 * 1. GitHub Secrets (VITE_ prefixed)
 * 2. .env file values
 * 3. Fallback defaults
 */

export default defineConfig(({ mode }) => {
  // Load env file from parent directory (project root)
  const env = loadEnv(mode, path.resolve(__dirname, ".."), "");
  
  // Environment detection
  const NODE_ENV = env.NODE_ENV || mode;
  const isProd = NODE_ENV === 'production';
  const isDev = NODE_ENV === 'development';

  /**
   * Get environment variable with fallback
   */
  const getEnv = (key, fallback = null) => {
    // Try VITE_ prefixed version first, then regular version, then fallback
    return env[`VITE_${key}`] || env[key] || fallback;
  };

  /**
   * Get numeric environment variable
   */
  const getEnvNumber = (key, fallback = 0) => {
    const value = getEnv(key, fallback.toString());
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
  };

  // Server Configuration
  const FRONTEND_PORT = getEnvNumber(isProd ? 'PROD_FRONTEND_PORT' : 'DEV_FRONTEND_PORT', 3000);
  const FRONTEND_HOST = getEnv(isProd ? 'PROD_FRONTEND_HOST' : 'DEV_FRONTEND_HOST', 'localhost');
  
  // Backend Configuration
  const BACKEND_PORT = getEnvNumber(isProd ? 'PROD_BACKEND_PORT' : 'DEV_BACKEND_PORT', 3001);
  const BACKEND_HOST = getEnv(isProd ? 'PROD_BACKEND_HOST' : 'DEV_BACKEND_HOST', 'localhost');

  // API URL Construction
  const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`;
  const API_URL = getEnv('API_URL') || getEnv('BACKEND_URL') || `${BACKEND_URL}/api`;

  // Log configuration in development
  if (isDev) {
    console.log('🔧 Vite Configuration:');
    console.log(`   Mode: ${mode} (${NODE_ENV})`);
    console.log(`   Frontend: ${FRONTEND_HOST}:${FRONTEND_PORT}`);
    console.log(`   Backend: ${BACKEND_HOST}:${BACKEND_PORT}`);
    console.log(`   API URL: ${API_URL}`);
  }

  return {
    plugins: [svelte()],
    envDir: resolve(__dirname, ".."), // Load .env from project root
    server: {
      port: FRONTEND_PORT,
      host: FRONTEND_HOST,
      // Proxy API calls to backend
      proxy: {
        "/api": {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
          configure: (proxy, options) => {
            proxy.on("error", (err, req, res) => {
              console.log("Proxy error:", err);
            });
            if (isDev) {
              proxy.on("proxyReq", (proxyReq, req, res) => {
                console.log(
                  "Proxying request:",
                  req.method,
                  req.url,
                  "->",
                  options.target + req.url
                );
              });
            }
          },
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: isDev,
      minify: isProd,
    },
    define: {
      // Expose environment variables to the frontend
      "import.meta.env.VITE_API_URL": JSON.stringify(API_URL),
      "import.meta.env.VITE_BACKEND_URL": JSON.stringify(API_URL),
      "import.meta.env.VITE_NODE_ENV": JSON.stringify(NODE_ENV),
      "import.meta.env.VITE_FRONTEND_HOST": JSON.stringify(FRONTEND_HOST),
      "import.meta.env.VITE_FRONTEND_PORT": JSON.stringify(FRONTEND_PORT),
      "import.meta.env.VITE_BACKEND_HOST": JSON.stringify(BACKEND_HOST),
      "import.meta.env.VITE_BACKEND_PORT": JSON.stringify(BACKEND_PORT),
    },
  };
});
