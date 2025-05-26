/**
 * Unified Configuration Module
 * 
 * Central export point for all configuration including:
 * - Environment variables
 * - Database settings
 * - Security settings
 * - Server configuration
 * - File paths
 */

import config from './env.js';
import paths from './paths.js';

// Re-export everything for convenience
export default config;
export const {
  server,
  postgres,
  security,
  rateLimit,
  cors,
  schemas,
  frontend,
  env
} = config;

// Explicit paths export
export { paths };
