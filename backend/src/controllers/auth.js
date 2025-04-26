// --- services ---
import userService from "../services/userService.js";

// --- utils ---
import hashing from "../utils/hashing.js"; // bcryptjs
import { json } from "express";

// --- service ---
/**
 * auth services
 * - register
 *   - login
 *   - logout
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
 */
const loginFunc = (req, res, next) => {};

const logoutFunc = (req, res, next) => {};

// ---------------------
const authService = {
  register: registerFunc,
  login: loginFunc,
  logout: logoutFunc,
};

// --- export ---
export default authService;
