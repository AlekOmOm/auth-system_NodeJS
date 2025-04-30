// --- services ---
import userService from "../services/userService.js";

// --- utils ---
import hashing from "../utils/hashing.js"; // bcryptjs

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
const registerFunc = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = await userService.saveUser(req, res, next);
    if (!newUser) {
      return res.status(400).json({ message: "User creation failed" });
    }

    // Set session
    req.session.userId = newUser.id;
    req.session.role = newUser.role;

    // Remove password from response
    const userResponse = { ...newUser };
    delete userResponse.password;

    return res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

/**
 * @description logic for logging in
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @body
 *  - email, password
 * @returns
 *  - success: returns 200 status code and message
 *  - failure: returns 400 status code and message
 */
const loginFunc = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await userService.getUserByEmail(email);
    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!userService.isSamePwd(password, user.password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Set session
    req.session.userId = user.id;
    req.session.role = user.role;

    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;

    console.log("userResponse", userResponse);

    return res.status(200).json({
      message: "Logged in successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
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
      return res.status(500).json({
        message: "Could not logout, please try again",
      });
    }

    return res.status(200).json({ message: "Logged out successfully" });
  });
};

// ---- getCurrentUser ---

const getCurrentUser = (req, res, next) => {
  //    userService.getCurrentUser(req, res, next);
};

// ---------------------
const authController = {
  register: registerFunc,
  login: loginFunc,
  logout: logoutFunc,
  getCurrentUser: userService.getCurrentUser,
};

// --- export ---
export default authController;
