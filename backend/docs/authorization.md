# Authorization in this Application

Authorization determines what an authenticated user is allowed to do within the system. For this project, using `express-session`, authorization primarily involves:

1.  **Session Check:**

    - For protected routes or actions, middleware will check if a valid session exists (`req.session` contains the expected user identifier set during login).
    - If a valid session exists, the user is considered authorized to proceed.
    - If no valid session exists, access is denied (e.g., redirecting to a login page, sending a 401 Unauthorized or 403 Forbidden status).

2.  **Route Protection:**

    - Identifying specific API endpoints or server-side resources that require a user to be logged in.
    - Applying session-checking middleware selectively to these routes. For example, an endpoint to view user profile data (`GET /api/profile`) should be protected, while the login endpoint (`POST /api/login`) should not.

3.  **Access Control (Basic):**
    - Initially, the authorization might be binary: either you are logged in (and can access protected resources) or you are not.
    - (Future enhancement: This could be expanded to role-based access control if needed, where different logged-in users have different permissions based on roles stored in their user record or session).
