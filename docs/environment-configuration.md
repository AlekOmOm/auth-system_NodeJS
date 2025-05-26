# Environment Configuration Guide

This document explains the uniform environment variable handling system implemented across both backend and frontend.

## Overview

The system provides centralized, prioritized environment variable loading with the following priority order:

1. **GitHub Secrets** (process.env in production)
2. **.env file values** (local development)
3. **Fallback defaults** (safe defaults for development)

## Architecture

### Backend (`backend/src/config/`)

```
backend/src/config/
├── index.js      # Main export point
├── env.js        # Environment configuration (uses paths.js)
└── paths.js      # Path configuration (existing, reused)
```

**Key Features:**
- **Reuses existing `paths.js`** for consistent path handling
- Centralized configuration loading via `dotenv.config({ path: paths.ENV_PATH })`
- Environment-specific defaults (dev/prod)
- Security validation (prevents insecure defaults in production)
- Automatic logging in development mode
- Type-safe getters for numbers, booleans, arrays

### Frontend (`frontend/src/config/`)

```
frontend/src/config/
├── index.js      # Main export point
└── env.js        # Environment configuration
```

**Key Features:**
- Vite-compatible variable loading (`VITE_` prefix)
- Automatic API URL construction
- Feature flags support
- UI configuration
- Development logging

## Usage

### Backend

```javascript
import config, { paths } from './src/config/index.js';

// Access configuration
const { server, postgres, security, rateLimit, cors } = config;

// Access paths (existing functionality preserved)
console.log('ENV path:', paths.ENV_PATH);
console.log('Backend dir:', paths.BACKEND_DIR);

// Use in your code
app.listen(server.port, server.host, () => {
  console.log(`Server running on ${server.host}:${server.port}`);
});
```

### Frontend

```javascript
import config from '../config/index.js';

// Access configuration
const { api, server, auth, features } = config;

// Use in your code
const response = await fetch(`${api.baseUrl}/auth/login`, {
  method: 'POST',
  body: JSON.stringify(credentials)
});
```

## Environment Variables

### Priority Order

1. **GitHub Actions/CI Environment**
   ```bash
   export VITE_API_URL=https://production-api.com/api
   export SESSION_SECRET=production-secret-from-github-secrets
   ```

2. **.env File** (project root, loaded via `paths.ENV_PATH`)
   ```bash
   VITE_API_URL=http://localhost:3001/api
   SESSION_SECRET=dev-session-secret
   ```

3. **Fallback Defaults** (in code)
   ```javascript
   const apiUrl = getEnv('API_URL', 'http://localhost:3001/api');
   ```

### Variable Categories

#### Frontend Variables (VITE_ prefix required)
```bash
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_BACKEND_URL=http://localhost:3001/api

# Environment
VITE_NODE_ENV=development

# Feature Flags
VITE_ENABLE_LOGGING=true
VITE_ENABLE_DEBUG_MODE=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_OWNER_PANEL=true

# Server Configuration
VITE_FRONTEND_HOST=localhost
VITE_FRONTEND_PORT=3000
VITE_BACKEND_HOST=localhost
VITE_BACKEND_PORT=3001
```

#### Backend Variables
```bash
# Server Configuration
DEV_BACKEND_PORT=3001
DEV_BACKEND_HOST=localhost
PROD_BACKEND_PORT=3001
PROD_BACKEND_HOST=localhost

# Database
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database_name
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Security
SESSION_SECRET=your-super-secret-session-key
JWT_SECRET=your-super-secret-jwt-key
SECRET_KEY=your-super-secret-key
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_LIMIT=300

# CORS
ALLOWED_CLIENT_ORIGINS=http://localhost:5173,http://localhost:5174

# Schemas
AUTH_SCHEMA=auth_internal
TEMPLATE_SCHEMA=client_template
SEED_SCHEMA=client_template
```

## Migration Guide

### From Old System

**Before:**
```javascript
// Multiple ways to access env vars
const PORT = process.env.BACKEND_PORT || 3001;
const dbConfig = { host: process.env.POSTGRES_HOST || 'localhost' };
```

**After:**
```javascript
// Centralized configuration
import config from './src/config/index.js';
const { server, postgres } = config;

app.listen(server.port, server.host);
pool = new Pool(postgres);
```

### Key Benefits

1. **Consistent Paths**: Uses existing `paths.js` for reliable path resolution
2. **Type Safety**: Built-in getters for numbers, booleans, arrays
3. **Environment Awareness**: Automatic dev/prod configuration
4. **Security**: Validates production secrets
5. **Logging**: Development-friendly configuration display
6. **Backward Compatibility**: Preserves existing `paths` exports

## Validation

The system includes automatic validation:

- **Required Variables**: Fails in production if database credentials missing
- **Security Check**: Prevents default secrets in production
- **Type Validation**: Ensures numbers are numbers, booleans are booleans
- **Development Warnings**: Shows missing variables in development

## GitHub Actions Integration

Set production secrets in GitHub repository settings:

```bash
# Required for production
SESSION_SECRET=production-session-secret
JWT_SECRET=production-jwt-secret
POSTGRES_USER=production-db-user
POSTGRES_PASSWORD=production-db-password
POSTGRES_HOST=production-db-host

# Frontend (VITE_ prefix for exposure to browser)
VITE_API_URL=https://your-production-api.com/api
VITE_NODE_ENV=production
```

## Best Practices

1. **Use existing infrastructure**: The system builds on your well-functioning `paths.js`
2. **Prefix frontend vars**: Always use `VITE_` for variables needed in browser
3. **Set GitHub secrets**: Never commit production credentials
4. **Use type getters**: `getEnvNumber()`, `getEnvBoolean()` vs string parsing
5. **Validate locally**: Test with `.env` before deploying

## Implementation Notes

- **Backend**: Uses existing `paths.ENV_PATH` for consistent `.env` loading
- **Frontend**: Vite automatically loads `.env` files with `VITE_` prefix
- **Paths Preserved**: All existing `paths.js` functionality remains available
- **Legacy Support**: Old config imports still work during transition period
