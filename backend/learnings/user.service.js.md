# UserService Design (`src/services/user.service.js`)

This document outlines the design and responsibilities of the `UserService`.

## Responsibilities

- Handles the core business logic related to user authentication (registration, login, logout).
- Acts as an intermediary between the route handlers (`auth.js`) and the data persistence layer (database).
- Encapsulates validation logic for user data.
- Manages password hashing and comparison.
- Handles session management logic during login and logout.

## Interaction with Database

- hardcoded-data user data [db](../src/db/db.js)

## Use of Utility Functions

- **Password Hashing:** Details on how `bcryptjs` (or another library) is used for hashing and comparison.
- **Validation:** Mention any validation libraries or custom validation functions used.
- **Other Utilities:** List any other helper functions or modules the service depends on.

## Business Logic

- **Registration:** Flow for registering a new user, including duplicate checks (e.g., email uniqueness), data formatting, and error handling.
- **Login:** Flow for authenticating a user, including finding the user, comparing passwords, creating/updating the session, and error handling (user not found, wrong password).
- **Logout:** Flow for logging out a user, including session destruction and any necessary cleanup.

## Methods

- `register(userData)`: Describe parameters, return value, and logic.
- `login(credentials, session)`: Describe parameters, return value, and logic.
- `logout(session)`: Describe parameters, return value, and logic.
