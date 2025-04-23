import Router from "express";

const router = Router();

// --- services ---
import userService from "../services/user.service.js";

// --- routes ---
router.get("/", userService.getUsers);
router.get("/:id", userService.getUserById);
router.get("/:name&email", userService.getUserByNameAndEmail);
router.put("/:id", userService.updateUser);

// --- export ---
export default router;
