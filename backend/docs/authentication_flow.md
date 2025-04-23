# Authentication Flow

This document provides a detailed explanation of the authentication flow in the system.

## Registration Flow

![Registration Flow](./diagrams/registration-flow.svg)

### Key Steps:

1. **Client sends registration data**:
   - The client sends a POST request to `/api/auth/register` with name, email, and password.

2. **Validation**:
   - The `validation.register` middleware validates the request data.
   - Checks for required fields, proper formats, and potential security issues.

3. **User creation**:
   - `authService.register` calls `userService.saveUser`.
   - Password is hashed using bcryptjs.
   - User record is created in the database.

4. **Auto-login**:
   - After successful registration, `req.userId` is set.
   - `loginFunc` is called to automatically log in the user.
   - Session is created with user ID.

5. **Response**:
   - Server returns a 200 OK response with user data (excluding password).

## Login Flow

![Login Flow](./diagrams/login-flow.svg)

### Key Steps:

1. **Client sends login credentials**:
   - The client sends a POST request to `/api/auth/login` with email and password.

2. **Validation**:
   - The `validation.login` middleware validates the request data.
   - Checks for required fields and proper formats.

3. **User lookup**:
   - `authService.login` calls `userService.getUserByEmail`.
   - Database is queried for a user with the provided email.

4. **Password verification**:
   - If user is found, password is verified using `hashing.compare`.
   - This compares the plaintext password from the request with the hashed password from the database.

5. **Session creation**:
   - Upon successful verification, a session is created.
   - User ID is stored in the session (`req.session.userId`).

6. **Response**:
   - Server returns a 200 OK response with user data (excluding password).

## Logout Flow

![Logout Flow](./diagrams/logout-flow.svg)

### Key Steps:

1. **Client requests logout**:
   - The client sends a POST request to `/api/auth/logout`.

2. **Session verification**:
   - `authService.logout` checks if the user has an active session.
   - If not, returns a 401 Unauthorized response.

3. **Session destruction**:
   - If a session exists, it is destroyed using `req.session.destroy()`.

4. **Response**:
   - Server returns a 200 OK response with a success message.

## Session Management

- Sessions are managed using `express-session`.
- Session data is stored server-side with only a session ID sent to the client as a cookie.
- Default session expiration is set to 24 hours.
- In a production environment, sessions would typically be stored in a persistent database like Redis.

## Security Considerations

1. **Password Storage**:
   - Passwords are never stored in plaintext.
   - Bcryptjs is used for secure hashing with salts.

2. **Authentication Data**:
   - Sensitive data like passwords is never sent in responses.
   - User objects returned to clients exclude password fields.

3. **Session Security**:
   - Session IDs are stored in HTTP-only cookies.
   - In production, secure flag would be enabled for HTTPS-only.

4. **Rate Limiting**:
   - Login and registration endpoints are protected by rate limiting.
   - This helps prevent brute force attacks.

5. **CORS Protection**:
   - API access is restricted to specified origins.
   - Credentials flag is enabled to allow secure cookie transmission. 