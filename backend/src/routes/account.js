import { Router } from "express";

const router = Router();

// --- middleware ---
import auth from "../middleware/auth.js";

// --- controller ---
import accountController from "../controllers/account.js";

// --- routes ---
/*
   - get account
   - update account
   - delete account
*/

router.use(auth.isAuthenticated);

/**
 * @name: get account
 * @description: get the account of the logged in user
 * @route: GET /api/account/
 * @access: logged-in user
 */
router.get("/", accountController.getAccount);

/**
 * @name: update account
 * @description: update the account of the logged in user
 * @route: PUT /api/account/
 * @access: logged-in user
 */
router.put("/", accountController.updateAccount);

/**
 * @name: delete account
 * @description: delete the account of the logged in user
 * @route: DELETE /api/account/
 * @access: logged-in user
 */
router.delete("/", accountController.deleteAccount);

// --- export ---
export default router;
