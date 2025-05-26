/**
 * Frontend Environment Configuration
 * 
 * Centralized environment variable handling for Vite frontend with priority:
 * 1. GitHub Actions environment (import.meta.env.VITE_*)
 * 2. .env file values (via Vite)
 * 3. Fallback defaults
 * 
 * Note: Vite only exposes variables prefixed with VITE_
 */

/**
 * Get environment variable with fallback
 */
const getEnv = (key, fallback = null) => {
  // Try VITE_ prefixed version first, then regular version, then fallback
  return import.meta.env[`VITE_${key}`] || import.meta.env[key] || fallback;
};

/**
 * Get numeric environment variable
 */
const getEnvNumber = (key, fallback = 0) => {
  const value = getEnv(key, fallback.toString());
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Get boolean environment variable
 */
const getEnvBoolean = (key, fallback = false) => {
  const value = getEnv(key, fallback.toString());
  return value === 'true' || value === '1';
};

/**
 * Get array environment variable (comma-separated)
 */
const getEnvArray = (key, fallback = []) => {
  const value = getEnv(key);
  if (!value) return fallback;
  return value.split(',').map(item => item.trim()).filter(Boolean);
};

// Environment detection
const NODE_ENV = getEnv('NODE_ENV', 'development');
const isProd = NODE_ENV === 'production';
const isDev = NODE_ENV === 'development';

// API Configuration
const api = {
  baseUrl: getEnv('API_URL') || getEnv('BACKEND_URL') || (() => {
    const host = getEnv(isProd ? 'PROD_BACKEND_HOST' : 'DEV_BACKEND_HOST', 'localhost');
    const port = getEnvNumber(isProd ? 'PROD_BACKEND_PORT' : 'DEV_BACKEND_PORT', 3003);
    return `http://${host}:${port}/api`;
  })(),
  timeout: getEnvNumber('API_TIMEOUT', 10000),
  retries: getEnvNumber('API_RETRIES', 3)
};

// Server Configuration (for dev server)
const server = {
  port: getEnvNumber(isProd ? 'PROD_FRONTEND_PORT' : 'DEV_FRONTEND_PORT', 3000),
  host: getEnv(isProd ? 'PROD_FRONTEND_HOST' : 'DEV_FRONTEND_HOST', 'localhost'),
  env: NODE_ENV,
  isProd,
  isDev
};

// Authentication Configuration
const auth = {
  tokenKey: getEnv('AUTH_TOKEN_KEY', 'auth_token'),
  sessionTimeout: getEnvNumber('AUTH_SESSION_TIMEOUT', 24 * 60 * 60 * 1000), // 24 hours
  refreshThreshold: getEnvNumber('AUTH_REFRESH_THRESHOLD', 5 * 60 * 1000), // 5 minutes
  redirectKey: getEnv('AUTH_REDIRECT_KEY', 'auth_return_url')
};

// Feature Flags
const features = {
  enableLogging: getEnvBoolean('ENABLE_LOGGING', isDev),
  enableAnalytics: getEnvBoolean('ENABLE_ANALYTICS', isProd),
  enableOwnerPanel: getEnvBoolean('ENABLE_OWNER_PANEL', true),
  enableDebugMode: getEnvBoolean('ENABLE_DEBUG_MODE', isDev)
};

// UI Configuration
const ui = {
  theme: getEnv('UI_THEME', 'dark'),
  language: getEnv('UI_LANGUAGE', 'en'),
  pageSize: getEnvNumber('UI_PAGE_SIZE', 10),
  animationDuration: getEnvNumber('UI_ANIMATION_DURATION', 300)
};

// Validation
const validateConfig = () => {
  if (!api.baseUrl) {
    console.error('❌ API base URL is required');
    throw new Error('Missing API configuration');
  }

  // Warn about development mode in production
  if (isProd && features.enableDebugMode) {
    console.warn('⚠️ Debug mode is enabled in production');
  }

  // Log configuration in development
  if (isDev && features.enableLogging) {
    console.log('🔧 Frontend Configuration:');
    console.log(`   Environment: ${NODE_ENV}`);
    console.log(`   Server: ${server.host}:${server.port}`);
    console.log(`   API: ${api.baseUrl}`);
    console.log(`   Features: ${Object.entries(features).filter(([, v]) => v).map(([k]) => k).join(', ')}`);
  }
};

// Run validation
validateConfig();

// Unified configuration export
const config = {
  api,
  server,
  auth,
  features,
  ui,
  env: {
    NODE_ENV,
    isProd,
    isDev
  }
};

export default config;

// Named exports for convenience
export { api, server, auth, features, ui };
