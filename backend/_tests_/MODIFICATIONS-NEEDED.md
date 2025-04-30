# Modifications Needed for Test Files

## General Issues

1. **Mock Implementation**: The mocks for database functions aren't working correctly. The main error is `default.getUsers is not a function`. All mocks need to be properly implemented to prevent the actual database from being called.

2. **Response Structure**: The tests expect certain response structures that don't match the actual implementation. For example, validation errors return an `errors` array but tests expect a `message` property.

3. **Error Handling**: Error responses need to be standardized across the application to have a consistent structure with a `message` property.

## By File/Component

### Auth Middleware Tests
- done: `isAuthenticated` is calling `next()` even when it should return a 401 error. The implementation needs to be fixed to match the tests, or tests adjusted to match behavior.
- Error messages don't match between tests and implementation (e.g., "Unauthorized" vs "Authentication required").

### Auth Register Tests
- Response status codes don't match expectations (500 vs 200)
- Response structure for validation errors doesn't match expectations

### Auth Login Tests
- The getUserByEmail mock is causing errors because the return value from db.getUsers() is undefined
- Response status and message structure doesn't match the tests

### Auth Logout Tests
- done: Session handling issues - the sessions aren't being properly initialized or destroyed

### Auth Me Tests
- Response status doesn't match (401 when 200 is expected)
- Error messages don't match expectations

### User Endpoints Tests
- Status codes for GET endpoints should be 200, not 201
- Error response format doesn't match expectations
- Sensitive data isn't being filtered from responses as expected

## Core Implementation Issues to Fix

1. **Database Repository Mock**: The mock implementation for db functions needs to be fixed:
```javascript
vi.mock('../src/db/repository.js', () => {
  return {
    default: {
      getUsers: vi.fn(),
      getUserByEmail: vi.fn(),
      // other functions...
    }
  };
});
```

2. **Response Format Consistency**: All API responses should follow a consistent format:
```javascript
{
  message: "Success or error message",
  data: {} // Optional data object or array
}
```

3. **Error Handling Middleware**: Create a centralized error handling middleware to ensure consistent error responses.

4. **Status Codes**: Use standard HTTP status codes (200 for successful GET requests, 201 for resource creation, 400 for client errors, 401 for authentication errors, etc.). 