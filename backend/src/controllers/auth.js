// --- services ---
import userService from "../services/userService.js";

// --- utils ---
import hashing from "../utils/hashing.js"; // bcryptjs
import { json } from "express";

// --- controller ---
/**
 * auth controller
 *   - register
 *   - login
 *   - logout
 */

/**
 * @description logic for registering a new user
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 *  - success: calls login function after registering a new user
 *  - failure: returns 400 status code and message
 */
const registerFunc = (req, res, next) => {
  const newUser = userService.saveUser(req, res, next);

  if (!newUser) {
    return res.status(400).json({ message: "User creation failed" });
  }

  res.message = json({ message: "User created successfully", user: newUser });

  req.userId = newUser.id;

  loginFunc(req, res, next);
};

/**
 * @description logic for logging in
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 *  - success: returns 200 status code and message
 *  - failure: returns 400 status code and message
 */
const loginFunc = (req, res, next) => {};

/**
 * @description logic for logging out
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 *  - success: returns 200 status code and message
 *  - failure: returns 400 status code and message
 */
const logoutFunc = (req, res, next) => {};

// ---------------------
const authService = {
  register: registerFunc,
  login: loginFunc,
  logout: logoutFunc,
};

// --- export ---
export default authService;
