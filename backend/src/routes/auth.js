import { Router } from "express";
const router = Router();

// --- services ---
import authService from "../services/auth.service.js";

// --- utils ---
import validation from "../utils/validation.js"; // types and XSS

// --- routes ---
// docs: docs/auth.routes.md
router.post("/register", validation.register, authService.register);
router.post("/login", validation.login, authService.login);
router.post("/logout", validation.logout, authService.logout);

// --- export ---
export default router;
