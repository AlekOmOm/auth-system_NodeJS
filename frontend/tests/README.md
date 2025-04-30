# Frontend Integration Tests

This directory contains integration tests for the frontend application. These tests verify that the frontend can properly communicate with the backend API.

## Prerequisites

Before running the tests, make sure:

1. The backend server is running on port 3001 (or update the API_URL in `config.js`)
2. The admin user exists in the database with the following credentials:
   - Email: admin@admin.com
   - Password: GoodPassword!123

## Running the Tests

To run all tests:

```bash
npm test
```

To run specific test files:

```bash
node tests/auth.test.js
node tests/users.test.js
```

## Test Structure

The tests are organized as follows:

- `config.js` - Configuration and test data
- `utils.js` - Utility functions for making API requests
- `auth.test.js` - Tests for authentication endpoints (login, register, logout, current user)
- `users.test.js` - Tests for user endpoints (get all users, get user by ID, update user)
- `run-tests.js` - Main test runner that runs all tests

## Test Coverage

The tests cover the following endpoints:

### Authentication

- `POST /api/auth/login` - Login a user
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/logout` - Logout the current user
- `GET /api/auth/current-user` - Get the current user

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get a user by ID
- `PUT /api/users/:id` - Update a user

## Adding New Tests

To add new tests:

1. Add new utility functions to `utils.js` if needed
2. Create a new test file or add to an existing one
3. Update `run-tests.js` to include the new tests 