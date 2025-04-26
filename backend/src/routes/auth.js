import { Router } from "express";
const router = Router();

// --- controllers ---
import authController from "../controllers/auth.js";

// --- middleware ---
import { isAuthenticated, isNotAdmin, isAdmin } from "../middleware/auth.js";

// --- utils ---
import validation from "../utils/validation.js"; // types and XSS

// --- routes ---
router.post("/register", validation.register, authController.register);
router.post("/login", validation.login, authController.login);
router.post("/logout", validation.logout, isAuthenticated, authController.logout);

/** very protected routes
*   - only for current user (password protection)
*/
router.get("/me", isAuthenticated, isNotAdmin, authController.getCurrentUser);
router.get("/admin", isAuthenticated, isAdmin, authController.getCurrentUser);

// --- export ---
export default router;
