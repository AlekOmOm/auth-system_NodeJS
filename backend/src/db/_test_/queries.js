// ----- TEST TABLES -----

// test users
const dropTableTestUsers = `
DROP TABLE IF EXISTS test_users;
`;

const createTableTestUsers = `
CREATE TABLE IF NOT EXISTS test_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, 
    role TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
);
`;

// test sessions
const dropTableTestSessions = `
DROP TABLE IF EXISTS test_sessions;
`;

const createTableTestSessions = `
CREATE TABLE IF NOT EXISTS test_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    sessionId TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES test_users(id)
);
`;

// ----- TEST TABLE DML -----

const createTestUser = `
INSERT INTO test_users (name, role, email, password) VALUES (?, ?, ?, ?);
`;

const getTestUsers = `
SELECT * FROM test_users;
`;

const getTestUser = `
SELECT * FROM test_users WHERE id = ?;
`;

const getTestUserByNameAndEmail = `
SELECT * FROM test_users WHERE name = ? AND email = ?;
`;

const getTestUserByEmail = `
SELECT * FROM test_users WHERE email = ?;
`;

const updateTestUser = `
UPDATE test_users SET name = ?, role = ?, email = ?, password = ? WHERE id = ?;
`;

const deleteTestUser = `
DELETE FROM test_users WHERE id = ?;
`;

const createTestSession = `
INSERT INTO test_sessions (userId, sessionId) VALUES (?, ?);
`;

const getTestSession = `
SELECT * FROM test_sessions WHERE sessionId = ?;
`;

const getTestSessions = `
SELECT * FROM test_sessions;
`;

const deleteTestSession = `
DELETE FROM test_sessions WHERE sessionId = ?;
`;

const seedTestUsers = (users) => {
  let insertQueries = "";
  users.forEach((user) => {
    insertQueries += `INSERT INTO test_users (name, role, email, password) VALUES ('${user.name}', '${user.role}', '${user.email}', '${user.password}');\n`;
  });
  return insertQueries;
};

const queries = {
  // test tables
  dropTableTestUsers,
  createTableTestUsers,
  dropTableTestSessions,
  createTableTestSessions,

  // test tables
  createTestUser,
  getTestUsers,
  getTestUser,
  getTestUserByNameAndEmail,
  getTestUserByEmail,
  updateTestUser,
  deleteTestUser,
  createTestSession,
  getTestSession,
  getTestSessions,
  deleteTestSession,
  seedTestUsers,
};

export default queries;
