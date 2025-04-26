import db from "../db/db.js";

// --- utils ---
import hashing from "../utils/hashing.js";

// --- CRUD operations ---
const saveUser = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = hashing.hash(password);
  const user = { name, role, email, password: hashedPassword };
  const newUser = db.createUser(user);

  return newUser;
};

const getUsers = (req, res, next) => {
  const users = db.getUsers();
  res
    .status(201)
    .json({ message: "Users retrieved successfully", user: users });
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
  let { name, email } = "";
  if (req.params === None && req.body.data !== None) {
    name = req.body.data.name;
    email = req.body.data.email;
  }

  const user = db.getUserByNameAndEmail(name, email);
  return user;
};

const updateUser = (req, res, next) => {
  const { id } = req.params;
  const { name, role, email, password } = req.body;
  const hashedPassword = password; // TODO: hash password
  const user = db.updateUser(id, {
    name,
    role,
    email,
    password: hashedPassword,
  });
};

// --- export ---
const userService = {
  saveUser,
  getUsers,
  getUserById,
  getUserByEmail,
  getUserByNameAndEmail,
  updateUser,
};

export default userService;
