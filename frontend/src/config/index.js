/**
 * Frontend Configuration Index
 * 
 * Central export point for all frontend configuration
 */

import config from './env.js';

// Re-export everything for convenience
export default config;
export const {
  api,
  server,
  auth,
  features,
  ui,
  env
} = config;
