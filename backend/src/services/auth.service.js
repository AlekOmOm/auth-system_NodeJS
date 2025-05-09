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
  console.log("registerFunc");
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
 *
 * @body
 *  - name, email, password
 * @returns
 *  - success: returns 200 status code and message
 *  - failure: returns 400 status code and message
 *
 *  @note
 *  - password in db is hashed
 *  - password in req.body is plain text
 *  - use hashing.compare() to compare the two passwords
 */
const loginFunc = (req, res, next) => {

  // user retrieved with hashed password
  const user = userService.getUserByEmail(req.body.email);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (!userService.isSamePwd(req.body.password, user.password)) {
    return res.status(400).json({ message: "Password incorrect" });
  }

  req.session.userId = user.id;
  req.session.role = user.role;

  user.password = undefined;

  res.status(200).json({ message: "Logged in successfully", user: user });
};

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
const logoutFunc = (req, res, next) => {

  if (!req.session) {
    return res.status(400).json({ message: "No active session found" });
  }
  
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Could not logout, please try again" });
    }
    
    return res.status(200).json({ message: "Logged out successfully" });
  });

};

// ---- getCurrentUser ---

const getCurrentUser = (req, res, next) => {
//    userService.getCurrentUser(req, res, next);
};

// ---------------------
const authService = {
  register: registerFunc,
  login: loginFunc,
  logout: logoutFunc,
  getCurrentUser: userService.getCurrentUser,
};

// --- export ---
export default authService;
