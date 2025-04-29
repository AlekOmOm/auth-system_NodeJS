import db from "../db/db.js";

// --- utils ---
import hashing from "../utils/hashing.js";

/** --- services ---
 *  - current user
 *  - CRUD operations
 *  - helper functions
 *      - isSamePwd
 */

// --- current user ---

const getCurrentUser = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const id = req.session.userId;

  const user = getUserById(id);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  res.status(200).json({ message: "User retrieved successfully", user: user });
};

// --- CRUD operations ---
const saveUser = (req, res, next) => {
  const { name, email, password } = req.body;
  const hashedPassword = hashing.hash(password);
  const role = "user"; // default role
  const user = { name, role, email, password: hashedPassword };
  const newUser = db.createUser(user);

  return newUser;
};

const getUsers = (req, res, next) => {
  const users = db.getUsers();
  users.forEach((user) => {
    user.password = undefined; // remove password from response
  });
  res
    .status(201)
    .json({ message: "Users retrieved successfully", users: users });
};

const getUserById = (req, res, next) => {
  const { id } = req.params;
  const user = db.getUserById(id);
  return user;
};

const getUserByEmail = (email) => {
  return db.getUserByEmail(email);
};

const getUserByNameAndEmail = (req, res, next) => {
  let name = "";
  let email = "";

  // Check if values are in params or body
  if (req.params && req.params.name && req.params.email) {
    name = req.params.name;
    email = req.params.email;
  } else if (req.body && req.body.data) {
    name = req.body.data.name || "";
    email = req.body.data.email || "";
  }

  // Validation
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const user = db.getUserByNameAndEmail(name, email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Remove password for security
  if (user.password) {
    user.password = undefined;
  }

  return res.status(200).json({
    message: "User retrieved successfully",
    user,
  });
};

const updateUser = (req, res, next) => {
  const { id } = req.params;
  const { name, role, email, password } = req.body;

  // Create update object
  const updateData = {
    name,
    role,
    email,
  };

  // Only hash and update password if a new one is provided
  if (password) {
    updateData.password = hashing.hash(password);
  }

  // Update the user
  const user = db.updateUser(id, updateData);

  // Check if user was updated successfully
  if (!user) {
    return res.status(404).json({ message: "User not found or update failed" });
  }

  // Remove password from response
  if (user.password) {
    user.password = undefined;
  }

  // Return success response
  return res.status(200).json({
    message: "User updated successfully",
    user,
  });
};

// --- password compare ---

const isSamePwd = (reqPwd, dbPwd) => {
  // Check if either password is undefined or null
  if (!reqPwd || !dbPwd) {
    return false;
  }

  try {
    const isMatch = hashing.compare(reqPwd, dbPwd);
    return isMatch;
  } catch (error) {
    console.error("Password comparison error:", error.message);
    return false;
  }
};

// --- export ---
const userService = {
  getCurrentUser,
  saveUser,
  getUsers,
  getUserById,
  getUserByEmail,
  getUserByNameAndEmail,
  updateUser,
  isSamePwd,
};

export default userService;
