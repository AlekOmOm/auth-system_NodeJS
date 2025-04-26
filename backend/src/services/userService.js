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

    const user = getUserById(id)

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User retrieved successfully", user: user });

}

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
