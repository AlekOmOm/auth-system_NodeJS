# Request Data Handling: Best Practices

This document outlines best practices for handling data in Express.js middleware chains, particularly focusing on authentication flows.

## Core Principles

1. **Keep Data Access Consistent**: Use consistent patterns to access data throughout your middleware chain
2. **Minimize Data Transformation**: Transform data as little as possible between middleware functions
3. **Be Explicit**: Clearly indicate where data is coming from and being stored
4. **Provide Clear Error Messages**: When data is missing or invalid, return clear error messages

## Request Object Properties

### Standard Express Properties

- `req.body`: Contains data sent in the request body (requires body-parser middleware)
- `req.params`: Contains route parameters (e.g., `/users/:id` -> `req.params.id`)
- `req.query`: Contains URL query parameters (e.g., `?search=term` -> `req.query.search`)
- `req.cookies`: Contains cookies (requires cookie-parser middleware)

### Custom Properties

- Use custom properties on `req` for passing data between middleware:
  ```javascript
  // Add data in one middleware
  req.userData = { id: 123, role: 'user' };
  
  // Access it in subsequent middleware
  const userData = req.userData;
  ```

## Authentication Data Flow Best Practices

### Login Request Handling

1. **Direct API Login**: Expect credentials in `req.body`
   ```javascript
   // Recommended structure for login requests
   // POST /api/auth/login
   {
     "email": "user@example.com",
     "password": "userPassword"
   }
   
   // Access in your handler
   const { email, password } = req.body;
   ```

2. **Post-Registration Auto-Login**: Don't pass sensitive data between middleware
   ```javascript
   // RECOMMENDED
   function registerUser(req, res, next) {
     // Create user with hashed password
     const user = userService.createUser(req.body);
     
     // Set non-sensitive user data for next middleware
     req.userId = user.id;
     next();
   }
   
   function loginAfterRegistration(req, res, next) {
     // Use userId to generate tokens/session
     const token = generateTokenForUser(req.userId);
     res.json({ token });
   }
   
   // NOT RECOMMENDED: Passing passwords between middleware
   req.userPassword = password; // Avoid this!
   ```

### Data Extraction Pattern

When handling multiple potential data sources (e.g., different entry points to the same function):

```javascript
function loginHandler(req, res) {
  // Declare variables at the start
  let email, password;
  
  // Use a single conditional block to determine source
  if (req.userId) {
    // Coming from registration flow, fetch from user record
    const user = getUserById(req.userId);
    email = user.email;
    // Never try to "decrypt" hashed passwords!
    // Password verification should always happen with plaintext against stored hash
  } else {
    // Coming from direct login request
    email = req.body.email;
    password = req.body.password;
  }
  
  // Proceed with authentication using determined values
}
```

### Security Considerations

1. **Never store plaintext passwords** in the request object, even temporarily
2. **Never pass hashed passwords** unnecessarily between middleware functions
3. **Use tokens or session IDs** to identify authenticated users, not credentials

## Session Management

Use the session object for storing authenticated user information:

```javascript
// After successful authentication
req.session.userId = user.id;
req.session.userRole = user.role;

// In protected routes
const userId = req.session.userId;
if (!userId) {
  return res.status(401).json({ message: 'Unauthorized' });
}
``` 