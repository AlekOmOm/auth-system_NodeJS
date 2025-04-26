import db from "../db/db.js";

// --- utils ---
import hashing from "../utils/hashing.js";

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

// --- password compare ---

const isSamePwd = (reqPwd, dbPwd) => {
    const isMatch = hashing.compare(reqPwd, dbPwd);
    if (!isMatch) {
        return false;
    }
    return true;
}



// --- export ---
const userService = {
  saveUser,
  getUsers,
  getUserById,
  getUserByEmail,
  getUserByNameAndEmail,
  updateUser,
  isSamePwd,
};

export default userService;
