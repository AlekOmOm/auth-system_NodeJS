import db from "../db/repository.js";

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

  const user = db.getUser(id);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  res.status(200).json({ message: "User retrieved successfully", user: user });
};

// --- CRUD operations ---
const saveUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashedPassword = hashing.hash(password);
  const role = "user"; // default role
  const user = [name, role, email, hashedPassword]; // Match the parameter order in queries.js
  const newUser = await db.createUser(user);

  return newUser;
};

const getUsers = async (req, res, next) => {
  const users = await db.getUsers();
  users.forEach((user) => {
    user.password = undefined; // remove password from response
  });
  res
    .status(201)
    .json({ message: "Users retrieved successfully", users: users });
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await db.getUser(id);
  return user;
};

const getUserByEmail = async (email) => {
  // This function needs to be implemented in repository.js
  // For now, we'll get all users and filter
  const users = await db.getUsers();
  return users.find((user) => user.email === email);
};

const getUserByNameAndEmail = async (req, res, next) => {
  let name, email;
  if (req.params && req.body.data) {
    name = req.body.data.name;
    email = req.body.data.email;
  }

  // This function needs to be implemented in repository.js
  // For now, we'll get all users and filter
  const users = await db.getUsers();
  return users.find((user) => user.name === name && user.email === email);
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, role, email, password } = req.body;
  const hashedPassword = password; // TODO: hash password
  const user = [name, role, email, hashedPassword, id]; // Match the parameter order in queries.js
  const result = await db.updateUser(user);
  return result;
};

// --- password compare ---

const isSamePwd = (reqPwd, dbPwd) => {
  const isMatch = hashing.compare(reqPwd, dbPwd);
  if (!isMatch) {
    return false;
  }
  return true;
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
