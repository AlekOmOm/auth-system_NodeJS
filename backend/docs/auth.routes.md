# notes on --- routes --- of auth.js

## terms

- middleware chain
  - `... , validation.register, userService.register);`
  - each middleware receives (req, res, next)
  - chain can have conditional continuation
    - if validation.register doesn't succeed and call `next()`, then next in chain doesn't execute ( `userService.register` )
- validation.register
  - validation of incoming request data ( `req.body` )
- userService.register
  - handles core logic of user registration
  - aspects
    - hashing
    - DB
    - business logic

## syntax notes

- `router` object
- `"/path"` endpoint
- `validation.register` validation middleware for register with next(), so that it passes on to userService, if no errors
- `userService.register` the business logic execution of register, this can still return errors if fx duplicate user exists

```JavaScript
router.post("/register", validation.register, userService.register);
router.post("/login", validation.login, userService.login);
router.post("/logout", validation.logout, userService.logout);
```

## full code

```JavaScript
import { Router } from "express";
const router = Router();

// --- services ---
import userService from "../services/user.service.js";

// --- utils ---
import validation from "../utils/validation.js"; // types and XSS

// --- routes ---
// docs: docs/auth.routes.md
router.post("/register", validation.register, userService.register);
router.post("/login", validation.login, userService.login);
router.post("/logout", validation.logout, userService.logout);

// --- export ---
export default router;

```
