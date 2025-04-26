1.  **Define User Roles & Data Model:**
    - [ ] Decide on roles (e.g., 'user', 'admin').
    - [ ] Add a `role` field (e.g., string type) to the user representation in your data store (e.g., `src/db/db.json`).
    - [ ] Manually add/designate at least one user with the 'admin' role in the initial data (e.g., in `db.json`).

2.  **Set up the Auth Router (`src/routes/auth.js`):**

    - [x] Import `express` and create a router instance (`express.Router()`).
    - [x] Import necessary dependencies (e.g., `bcryptjs`, data store module).
    - [x] Import the `UserService` (`../services/user.service.js`).
    - [x] Export the router.

3.  **Implement Registration Route (`POST /register`):**

    - [x] Define a `POST` route handler for `/register` in the auth router.
    - [x] Extract `name`, `email`, `password` from `req.body`.
    - [x] **Input Validation:** Perform validation.
    - [x] **Call Service:** Call `userService.register()` passing the necessary user data. The service should assign the default 'user' role.
    - [ ] Send a success response (e.g., status 201 Created).

4.  **Implement Login Route (`POST /login`):**

    - [x] Define a `POST` route handler for `/login` in the auth router.
    - [x] Extract `email` and `password` from `req.body`.
    - [x] **Call Service:** Call `userService.login()` passing credentials and `req.session`. The service should store `userId` and `role` in the session upon success.
    - [ ] Send a success response (e.g., 200 OK with user data like `userId`, `role`) or an error (e.g., 401 Unauthorized).

5.  **Implement Logout Route (`POST /logout`):**

    - [x] Define a `POST` route handler for `/logout`.
    - [x] **Call Service:** Call `userService.logout()` passing `req.session`.
    - [ ] Send a success response (e.g., 200 OK).

6.  **Implement `UserService` (`src/services/userService.js`):**

    - [x] Define methods for `register`, `login`, `logout`.
    - [ ] **Registration Logic:** Handle validation, password hashing (`bcryptjs`), assigning default 'user' role, user storage, duplicate checks.
    - [ ] **Login Logic:** Find user, compare passwords, fetch user's `role`, store `userId` and `role` in `req.session`, manage session saving.
    - [ ] **Logout Logic:** Handle session destruction (`req.session.destroy()`).
    - [ ] (Optional) Add methods for self-service account operations (get own data, update own data, delete own account) to be called by the Account router.
    - [ ] (Optional) Add methods for admin user operations (get any user, get all users, create user, update any user, delete any user) to be called by the User router.

7.  **Create Authorization Middleware (`src/middleware/authMiddleware.js` or similar):**
    - [ ] Create a file for authorization middleware.
    - [ ] Implement `isAuthenticated(req, res, next)`: Checks if `req.session.isLoggedIn` (or `req.session.userId`) exists. Sends 401 if not logged in.
    - [ ] Implement `isAdmin(req, res, next)`: Checks if `req.session.isLoggedIn` AND `req.session.role === 'admin'`. Sends 403 if not admin.

8.  **Create Account Router (`src/routes/account.js`):**
    - [ ] Create the router file (`express.Router()`).
    - [ ] Import `isAuthenticated` middleware.
    - [ ] Import `UserService` (or relevant service methods).
    - [ ] Apply `isAuthenticated` to all routes in this router (`router.use(isAuthenticated)`).
    - [ ] Define `GET /` route: Calls service to get data for `req.session.userId`.
    - [ ] Define `PUT /` (or `PATCH /`) route: Calls service to update data for `req.session.userId`, taking payload from `req.body`.
    - [ ] Define `DELETE /` route: Calls service to delete account/data for `req.session.userId`.
    - [ ] Export the router.

9.  **Update User Router (`src/routes/user.js`):**
    - [ ] Import `isAdmin` middleware.
    - [ ] Import `UserService` (or relevant service methods).
    - [ ] Apply `isAdmin` to all routes in this router (`router.use(isAdmin)`).
    - [ ] Define routes for admin actions (e.g., `GET /users`, `GET /user/:id`, `POST /user`, `PUT /user/:id`, `DELETE /user/:id`). Handlers should interact with the service for admin operations.
    - [ ] Export the router.

10. **Integrate Routers and Middleware in `server.js`:**
    - [x] Import the auth router (`authRoute`). Mount under `/api/auth`.
    - [ ] Import the account router (`accountRoute`). Mount under `/api/account`.
    - [ ] Import the user router (`userRoute`). Mount under `/api/users`.
    - [ ] Ensure session middleware is configured *before* the routers that use it.
    - [ ] Consider applying middleware directly in `server.js` if preferred (e.g., `app.use('/api/account', isAuthenticated, accountRoute); app.use('/api/users', isAdmin, userRoute);`).
