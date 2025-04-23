1.  **Set up the Auth Router (`src/routes/auth.js`):**

    - [x] Import `express` and create a router instance (`express.Router()`).
    - [x] Import necessary dependencies (e.g., `bcryptjs`, data store module).
    - [x] Import the `UserService` (`../services/user.service.js`).
    - [x] Export the router.

2.  **Implement Registration Route (`POST /register`):**

    - [x] Define a `POST` route handler for `/register` in the auth router.
    - [x] Extract `name`, `email`, `password` from `req.body`.
    - [x] **Input Validation:** Optionally perform basic validation in the route handler or delegate fully to the service.
    - [x] **Call Service:** Call `userService.register()` passing the necessary user data.
    - [x] Send a success response (e.g., status 201 Created) based on the service's result.

3.  **Implement Login Route (`POST /login`):**

    - [x] Define a `POST` route handler for `/login` in the auth router.
    - [x] Extract `email` and `password` from `req.body`.
    - [x] **Call Service:** Call `userService.login()` passing the credentials and `req.session`.
    - [ ] Send a success response (e.g., 200 OK with user data/session status) or an error response (e.g., 401 Unauthorized) based on the service's result.

4.  **Implement Logout Route (`POST /logout`):**

    - [x] Define a `POST` route handler for `/logout`.
    - [x] **Call Service:** Call `userService.logout()` passing `req.session`.
    - [ ] Send a success response (e.g., 200 OK).

5.  **Implement `UserService` (`src/services/user.service.js`):**

    - [x] Define methods for `register`, `login`, `logout`.
    - [ ] **Registration Logic:** Handle input validation (if not done in route), password hashing (`bcryptjs`), user storage (database interaction), and duplicate checks.
    - [ ] **Login Logic:** Handle finding the user by email, comparing passwords (`bcryptjs`), and managing session creation (`req.session`).
    - [ ] **Logout Logic:** Handle session destruction (`req.session.destroy()`).
    - [ ] See `learnings/user.service.js.md` for detailed design notes.

6.  **Integrate Auth Router into `server.js`:**
    - [x] Import the auth router into `server.js`.
    - [x] Mount the router using `app.use()` under an appropriate base path (e.g., `/api/auth`).
