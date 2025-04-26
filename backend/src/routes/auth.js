import { Router } from "express";
const router = Router();

// --- controllers ---
import authController from "../controllers/auth.js";

// --- middleware ---
import { isAuthenticated } from "../middleware/auth.js";

// --- utils ---
import validation from "../utils/validation.js"; // types and XSS

// --- routes ---
router.post("/register", validation.register, authController.register);
router.post("/login", validation.login, authController.login);
router.post("/logout", validation.logout, isAuthenticated, authController.logout);

// --- export ---
export default router;
