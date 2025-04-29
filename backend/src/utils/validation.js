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
    .isLength({ max: rules.NAME_RULES.MAX_LENGTH }) // set max length
    .withMessage(rules.ERROR_MESSAGES.NAME.MAX_LENGTH_ERROR)
    .escape(), // <-- Sanitize by escaping HTML chars
  body("email")
    .trim()
    .notEmpty()
    .withMessage(rules.ERROR_MESSAGES.USER.FIELD_REQUIRED("Email"))
    .isEmail()
    .withMessage(rules.ERROR_MESSAGES.EMAIL.INVALID_EMAIL) // Use the corrected message key
    .normalizeEmail(), // <-- Sanitizer specific to emails
  body("password")
    .trim()
    .notEmpty()
    .withMessage(rules.ERROR_MESSAGES.USER.FIELD_REQUIRED("Password"))
    .isLength({ min: rules.PASSWORD_RULES.MIN_LENGTH })
    .withMessage(rules.ERROR_MESSAGES.PASSWORD.WEAK_PASSWORD) // Use the corrected message key
    .isLength({ max: rules.PASSWORD_RULES.MAX_LENGTH })
    .withMessage(rules.ERROR_MESSAGES.PASSWORD.MAX_LENGTH_ERROR)
    .isStrongPassword({
      minLength: rules.PASSWORD_RULES.MIN_LENGTH,
      minLowercase: rules.PASSWORD_RULES.LOWER_CASE,
      minUppercase: rules.PASSWORD_RULES.UPPER_CASE,
      minNumbers: rules.PASSWORD_RULES.DIGIT,
      minSymbols: 1,
    })
    .withMessage(rules.ERROR_MESSAGES.PASSWORD.WEAK_PASSWORD),

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
  body("email")
    .trim()
    .notEmpty()
    .withMessage(rules.ERROR_MESSAGES.USER.FIELD_REQUIRED("Email"))
    .isEmail()
    .withMessage(rules.ERROR_MESSAGES.EMAIL.INVALID_EMAIL)
    .normalizeEmail(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(rules.ERROR_MESSAGES.USER.FIELD_REQUIRED("Password"))
    .isLength({ min: rules.PASSWORD_RULES.MIN_LENGTH })
    .withMessage(rules.ERROR_MESSAGES.PASSWORD.WEAK_PASSWORD),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

/*
 * logout
 * - No validation needed for logout as it only depends on the session
 * - We only need to check if the session exists, which is handled by middleware
 * - TODO: No input fields are required for logout, so this should just pass through
 */
const logout = [
  // No validation needed for logout - just pass to next middleware
  (req, res, next) => {
    next();
  },
];

// --- export ---
export default {
  register,
  login,
  logout,
};
