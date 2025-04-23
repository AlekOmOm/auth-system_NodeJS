// utils/validation.js (Conceptual example with express-validator)
import { body, validationResult } from "express-validator";
import * as rules from "./validationRules.js";

/*
 * register
 * - validate register details
 * - trim whitespace
 * - not empty
 * - max length 50
 * - escape
 * - is email
 * - normalize email
 * - password min length
 *
 * tldr:
 * - body
 * - validationResult
 * - if errors, return 400
 * - next
 */
const register = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage(rules.ERROR_MESSAGES.USER.FIELD_REQUIRED("Name"))
    .isLength({ max: 50 })
    .withMessage("Name cannot exceed 50 characters")
    .escape(), // <-- Sanitize by escaping HTML chars
  body("email")
    .trim()
    .notEmpty()
    .withMessage(rules.ERROR_MESSAGES.USER.FIELD_REQUIRED("Email"))
    .isEmail()
    .withMessage(rules.ERROR_MESSAGES.USER.INVALID_EMAIL) // Use the corrected message key
    .normalizeEmail(), // <-- Sanitizer specific to emails
  body("password")
    .isLength({ min: rules.MIN_PASSWORD_LENGTH })
    .withMessage(rules.ERROR_MESSAGES.USER.INVALID_PASSWORD), // Use the corrected message key

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

/*
 * login
 * - validate login details
 * - is email
 * - password min length
 */
const login = [
  body("email").isEmail().withMessage(rules.ERROR_MESSAGES.USER.INVALID_EMAIL),
  body("password")
    .isLength({ min: rules.MIN_PASSWORD_LENGTH })
    .withMessage(rules.ERROR_MESSAGES.USER.INVALID_PASSWORD),
];

/*
 * logout
 * - validate logout details
 * - is email
 * - password min length
 */
const logout = [
  body("email").isEmail().withMessage(rules.ERROR_MESSAGES.USER.INVALID_EMAIL),
  body("password")
    .isLength({ min: rules.MIN_PASSWORD_LENGTH })
    .withMessage(rules.ERROR_MESSAGES.USER.INVALID_PASSWORD),
];

// --- export ---
export default {
  register,
  login,
  logout,
};
