# Authentication System Architecture

This document provides a comprehensive overview of the authentication system architecture, including the technology stack, key components, user functionalities, and data flow.

## Technology Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework for Node.js
- **Express Session**: Session management middleware
- **Express Rate Limit**: Rate limiting middleware to protect against brute force attacks
- **bcryptjs**: Password hashing library
- **CORS**: Cross-Origin Resource Sharing middleware
- **dotenv**: Environment variable management

### Data Storage
- **JSON File**: Simple file-based storage using Node.js fs module and JSON format
- Note: In a production environment, this would be replaced with a proper database like MongoDB, PostgreSQL, etc.

## System Architecture

### Core Components

1. **Server Configuration (`server.js`)**
   - Application entry point
   - Middleware configuration (CORS, sessions, rate limiting)
   - Route registration
   - Environment variable management

2. **Routes**
   - `auth.js`: Authentication-related endpoints (login, register, logout)
   - `user.js`: User management endpoints (get users, get user by ID, update user)

3. **Services**
   - `auth.service.js`: Business logic for authentication operations
   - `user.service.js`: Business logic for user operations

4. **Utilities**
   - `hashing.js`: Password hashing and verification using bcryptjs
   - `validation.js`: Request data validation

5. **Data Access**
   - `db.js`: Database operations for CRUD functionality

### Directory Structure

```
backend/
├── docs/                 # Documentation
├── src/
│   ├── db/              # Database operations
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── utils/           # Utility functions
├── package.json         # Dependencies
└── server.js            # Main application
```

## Authentication Flow

### User Registration

1. Client sends a POST request to `/api/auth/register` with user credentials (name, email, password)
2. `validation.register` middleware validates the input data
3. `authService.register` function processes the registration:
   - Passes data to `userService.saveUser` which:
     - Hashes the password using `hashing.hash`
     - Creates a new user record via `db.createUser`
   - Sets `req.userId` for the next middleware
   - Calls `loginFunc` to automatically log in the user after registration

### User Login

1. Client sends a POST request to `/api/auth/login` with credentials (email, password)
2. `validation.login` middleware validates the input data
3. `authService.login` function processes the login:
   - Retrieves credentials from request body
   - Looks up the user by email using `userService.getUserByEmail`
   - Verifies the password using `hashing.compare`
   - On success, creates a session with `req.session.userId`
   - Returns user information (excluding sensitive data like passwords)

### User Logout

1. Client sends a POST request to `/api/auth/logout`
2. `validation.logout` middleware validates the request
3. `authService.logout` function destroys the session

## Security Measures

1. **Password Hashing**: All passwords are hashed using bcryptjs before storage
2. **Session Management**: User authentication state is maintained via secure sessions
3. **Rate Limiting**: Protection against brute force attacks using express-rate-limit
4. **CORS Configuration**: Restricts API access to specified origins
5. **Input Validation**: Validates and sanitizes all input data before processing

## Data Flow Best Practices

As documented in `req-data_best-practice.md`, the system follows these principles:

1. **Consistent Data Access**: Uses consistent patterns throughout the middleware chain
2. **Minimal Data Transformation**: Transforms data as little as possible between middlewares
3. **Explicit Data Flow**: Clearly indicates data sources and destinations
4. **Clean Error Handling**: Provides clear error messages for invalid/missing data
5. **Secure Data Passing**: Never passes sensitive data (like passwords) between middlewares
6. **Session-Based Authentication**: Uses session objects for authenticated user identification

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate a user
- `POST /api/auth/logout`: Log out a user

### User Management

- `GET /api/users`: Get all users
- `GET /api/users/:id`: Get a specific user by ID
- `GET /api/users/:name&email`: Get a user by name and email
- `PUT /api/users/:id`: Update a user

## Environment Variables

- `BACKEND_PORT`: Port for the backend server (default: 3001)
- `FRONTEND_PORT`: Port for the frontend application (default: 3000)
- `SESSION_SECRET`: Secret for session encryption
- `RATE_LIMIT_WINDOW`: Time window for rate limiting in minutes (default: 15)
- `RATE_LIMIT_LIMIT`: Request limit per window (default: 300) 