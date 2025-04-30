// queries in SQL for
/**
 * DDL
 * - users table
 *
 * DML
 * - CRUD sql
 */

// ----- DDL -----

const createTableUsers = `
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, 
    role TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
);
`;

// ----- DML -----

/** ---- CRUD users table ---
 *
 * - create user
 * - read user
 *    - read all users
 * - update user
 * - delete user
 */

const createUser = `
INSERT INTO users (name, role, email, password) VALUES (?, ?, ?, ?);
`;

const getUsers = `
SELECT * FROM users;
`;

const getUser = `
SELECT * FROM users WHERE id = ?;
`;

const getUserByNameAndEmail = `
SELECT * FROM users WHERE name = ? AND email = ?;
`;

const getUserByEmail = `
SELECT * FROM users WHERE email = ?;
`;

const updateUser = `
UPDATE users SET name = ?, role = ?, email = ?, password = ? WHERE id = ?;
`;

const deleteUser = `
DELETE FROM users WHERE id = ?;
`;

const seedDefaultUsers = (users) => {
  let insertQueries = "";
  users.forEach((user) => {
    insertQueries += `INSERT INTO users (name, role, email, password) VALUES ('${user.name}', '${user.role}', '${user.email}', '${user.password}');\n`;
  });
  return insertQueries;
};

// ----- export -----

const queries = {
  createTableUsers,
  createUser,
  getUsers,
  getUser,
  getUserByNameAndEmail,
  getUserByEmail,
  updateUser,
  deleteUser,
  // ----- seeding -----
  seedDefaultUsers,
};

export default queries;
