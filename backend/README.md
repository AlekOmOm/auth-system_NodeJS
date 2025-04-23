# Authentication System Backend

A secure, Node.js-based authentication system with user management capabilities.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Security](#security)
- [Development](#development)

## Overview

This authentication system provides a secure, scalable backend for managing user authentication. Built with Node.js and Express, it implements industry best practices for user registration, login, and session management.

### Technology Stack

- **Node.js** & **Express.js** - Server framework
- **Express Session** - Session management
- **bcryptjs** - Password hashing
- **JSON File Storage** - Data persistence (for development)
- **Rate Limiting** - Protection against brute force attacks
- **CORS** - Cross-Origin Resource Sharing security

## Getting Started

### Prerequisites

- Node.js (14.x or higher)
- npm (6.x or higher)

### Installation

1. Clone the repository
2. Install dependencies

```bash
cd backend
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
BACKEND_PORT=3001
FRONTEND_PORT=3000
SESSION_SECRET=your_secret_key_here
RATE_LIMIT_WINDOW=15
RATE_LIMIT_LIMIT=300
```

### Running the Server

Development mode with auto-reload:

```bash
npm run dev
```

Production mode:

```bash
npm run start
```

## Features

- **User Registration**: Create new user accounts with secure password hashing
- **User Authentication**: Verify user credentials and manage sessions
- **Session Management**: Maintain authenticated user state with secure cookies
- **Rate Limiting**: Protect against brute force attacks
- **CORS Protection**: Secure cross-origin requests
- **Security Best Practices**: Follows OWASP guidelines for authentication

## API Documentation

### Authentication Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/auth/register` | POST | Register a new user | `{ name, email, password }` | `{ message, user }` |
| `/api/auth/login` | POST | Authenticate a user | `{ email, password }` | `{ message, user }` |
| `/api/auth/logout` | POST | End a user session | None | `{ message }` |

### User Management Endpoints

| Endpoint | Method | Description | Request Body/Params | Response |
|----------|--------|-------------|--------------|----------|
| `/api/users` | GET | Get all users | None | `{ message, users }` |
| `/api/users/:id` | GET | Get a specific user | `:id` (URL param) | `{ user }` |
| `/api/users/:id` | PUT | Update a user | `:id` (URL param), `{ name, email, password }` | `{ message, user }` |

For detailed information on the authentication flow, see [Authentication Flow Documentation](./docs/authentication_flow.md).

## Architecture

The system follows a modular architecture with clear separation of concerns:

- **Routes**: Define API endpoints and handle HTTP requests/responses
- **Services**: Implement business logic and handle data processing
- **Database**: Manage data persistence and retrieval
- **Utilities**: Provide helper functions for common tasks

For a comprehensive overview of the system architecture, see [System Architecture Documentation](./docs/system_architecture.md).

## Security

This authentication system implements numerous security best practices:

- **Password Hashing**: All passwords are securely hashed using bcryptjs
- **Session Security**: HTTP-only cookies with secure configuration
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Validation of all user input

For a detailed security assessment and implementation status, see the [Security Checklist](./docs/checklists/security_checklist.md).

## Development

### Project Structure

```
backend/
├── docs/                 # Documentation
│   ├── checklists/      # Implementation checklists
│   ├── diagrams/        # Visual diagrams
│   └── ...              # Other documentation
├── src/                  # Source code
│   ├── db/              # Database operations
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── utils/           # Utility functions
├── package.json          # Dependencies
├── server.js             # Main application
└── README.md             # This file
```

### Documentation Resources

- [Authentication Flow](./docs/authentication_flow.md) - Detailed explanation of authentication processes
- [System Architecture](./docs/system_architecture.md) - Overview of system components and design
- [Authentication Checklist](./docs/checklists/authentication.checklist.md) - Implementation status of authentication features
- [Security Checklist](./docs/checklists/security_checklist.md) - Security assessment and implementation status
- [Request Data Best Practices](./docs/req-data_best-practice.md) - Guidelines for handling request data

### Contributing

1. Follow the existing code style and patterns
2. Update documentation for any changes
3. Add tests for new functionality
4. Update the relevant checklist with implementation status

---

## License

This project is licensed under the ISC License - see the LICENSE file for details. 