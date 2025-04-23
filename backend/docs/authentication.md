# Authentication in this Application

Authentication verifies the identity of a user trying to access the system. For this project, it involves:

1.  **User Registration:**

    - Accepting user credentials (name, email, password) via a specific API endpoint (e.g., `POST /api/register`).
    - **Crucially:** Hashing the provided password using `bcryptjs` before storing any user data. Plaintext passwords must _never_ be stored.
    - Storing the user's details (e.g., name, email, hashed password) in the designated data store (currently the in-memory `db.js`).
    - Optionally, sending a confirmation email upon successful registration.

2.  **User Login:**

    - Accepting user credentials (email, password) via a specific API endpoint (e.g., `POST /api/login`).
    - Retrieving the user record matching the provided email from the data store.
    - Comparing the provided password with the stored hash using `bcryptjs.compare()`.
    - **If credentials are valid:** Initiating a user session using `express-session`, typically by storing the user's ID or a minimal user object in `req.session`.

3.  **Password Management:**

    - Implementing secure password handling during registration and login using `bcryptjs` for hashing and comparison.

4.  **Authentication State:**
    - The presence of valid user data within `req.session` signifies that a user is currently authenticated.
