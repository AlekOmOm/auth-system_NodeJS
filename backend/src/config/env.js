/**
 * Environment Configuration
 * 
 * Centralized environment variable loading with priority:
 * 1. GitHub Secrets (process.env)
 * 2. .env file
 * 3. Fallback defaults
 */
import dotenv from "dotenv";
import paths from "./paths.js"; // Use existing paths configuration

// Load .env from project root using existing paths configuration
dotenv.config({ path: paths.ENV_PATH });

/**
 * Get environment variable with priority:
 * 1. GitHub Secrets (already in process.env)
 * 2. .env file values
 * 3. Fallback default
 */
const getEnv = (key, fallback = null) => {
  return process.env[key] || fallback;
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

// Server Configuration
const server = {
  port: getEnvNumber(isProd ? 'PROD_BACKEND_PORT' : 'DEV_BACKEND_PORT', 3001),
  host: getEnv(isProd ? 'PROD_BACKEND_HOST' : 'DEV_BACKEND_HOST', 'localhost'),
  env: NODE_ENV,
  isProd,
  isDev
};

// Database Configuration
const postgres = {
  host: getEnv('POSTGRES_HOST', 'localhost'),
  port: getEnvNumber('POSTGRES_PORT', 5432),
  user: getEnv('POSTGRES_USER', 'postgres'),
  password: getEnv('POSTGRES_PASSWORD', 'password'),
  database: getEnv('POSTGRES_DB', 'auth_system'),
  ssl: isProd ? { rejectUnauthorized: false } : false
};

// Security Configuration
const security = {
  sessionSecret: getEnv('SESSION_SECRET', 'dev-session-secret-change-in-production'),
  jwtSecret: getEnv('JWT_SECRET', 'dev-jwt-secret-change-in-production'),
  secretKey: getEnv('SECRET_KEY', 'dev-secret-key-change-in-production'),
  bcryptRounds: getEnvNumber('BCRYPT_ROUNDS', 12)
};

// Rate Limiting Configuration
const rateLimit = {
  windowMs: getEnvNumber('RATE_LIMIT_WINDOW', 15) * 60 * 1000, // Convert to milliseconds
  limit: getEnvNumber('RATE_LIMIT_LIMIT', 300),
  standardHeaders: 'draft-8',
  legacyHeaders: false
};

// CORS Configuration
const cors = {
  allowedOrigins: getEnvArray('ALLOWED_CLIENT_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4173'
  ]),
  credentials: true
};

// Schema Configuration
const schemas = {
  auth: getEnv('AUTH_SCHEMA', 'auth_internal'),
  template: getEnv('TEMPLATE_SCHEMA', 'client_template'),
  seed: getEnv('SEED_SCHEMA', 'client_template')
};

// Frontend Configuration (for CORS and redirects)
const frontend = {
  port: getEnvNumber(isProd ? 'PROD_FRONTEND_PORT' : 'DEV_FRONTEND_PORT', 3000),
  host: getEnv(isProd ? 'PROD_FRONTEND_HOST' : 'DEV_FRONTEND_HOST', 'localhost'),
  url: (() => {
    const host = getEnv(isProd ? 'PROD_FRONTEND_HOST' : 'DEV_FRONTEND_HOST', 'localhost');
    const port = getEnvNumber(isProd ? 'PROD_FRONTEND_PORT' : 'DEV_FRONTEND_PORT', 3000);
    return `http://${host}:${port}`;
  })()
};

// Validation
const validateConfig = () => {
  const required = [
    { key: 'POSTGRES_USER', value: postgres.user },
    { key: 'POSTGRES_PASSWORD', value: postgres.password },
    { key: 'POSTGRES_DB', value: postgres.database }
  ];

  const missing = required.filter(({ value }) => !value || value === 'your_username' || value === 'your_password' || value === 'your_database_name');
  
  if (missing.length > 0 && isProd) {
    console.error('❌ Missing required environment variables in production:');
    missing.forEach(({ key }) => console.error(`   - ${key}`));
    process.exit(1);
  }

  if (missing.length > 0 && isDev) {
    console.warn('⚠️ Using default values for missing environment variables:');
    missing.forEach(({ key }) => console.warn(`   - ${key}`));
  }

  // Warn about insecure defaults in production
  if (isProd) {
    const insecureDefaults = [
      { key: 'SESSION_SECRET', value: security.sessionSecret, default: 'dev-session-secret-change-in-production' },
      { key: 'JWT_SECRET', value: security.jwtSecret, default: 'dev-jwt-secret-change-in-production' }
    ];

    const insecure = insecureDefaults.filter(({ value, default: def }) => value === def);
    if (insecure.length > 0) {
      console.error('🚨 SECURITY WARNING: Using default secrets in production:');
      insecure.forEach(({ key }) => console.error(`   - ${key}`));
      process.exit(1);
    }
  }
};

// Run validation
validateConfig();

// Unified configuration export
const config = {
  server,
  postgres,
  security,
  rateLimit,
  cors,
  schemas,
  frontend,
  env: {
    NODE_ENV,
    isProd,
    isDev
  },
  paths // Include existing paths for backward compatibility
};

// Log configuration (excluding sensitive data) in development
if (isDev) {
  console.log('🔧 Backend Configuration:');
  console.log(`   Server: ${server.host}:${server.port} (${server.env})`);
  console.log(`   Database: ${postgres.host}:${postgres.port}/${postgres.database}`);
  console.log(`   Frontend: ${frontend.url}`);
  console.log(`   Schemas: ${schemas.auth}, ${schemas.template}`);
  console.log(`   CORS Origins: ${cors.allowedOrigins.join(', ')}`);
  console.log(`   ENV Path: ${paths.ENV_PATH}`);
}

export default config;

// Legacy exports for backward compatibility
export { postgres, schemas, paths };
