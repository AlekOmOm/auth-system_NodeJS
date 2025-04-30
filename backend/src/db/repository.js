// Main repository module that combines user and session repositories
import userRepository from "./repository/userRepository.js";
import sessionRepository from "./repository/sessionRepository.js";

// Additional methods from MODIFICATIONS-NEEDED.md
import db from "./connection/connection.js";
import queries from "./connection/queries.js";
import testQueries from "./_test_/queries.js";

const getUserByEmail = (email) => {
  return db.get(queries.getUserByEmail, email);
};

const getUserByNameAndEmail = (name, email) => {
  return db.get(queries.getUserByNameAndEmail, [name, email]);
};

const getSessionByUserId = (userId) => {
  return db.get(queries.getSessionByUserId, userId);
};

const deleteSessionByUserId = (userId) => {
  return db.run(queries.deleteSessionByUserId, userId);
};

// For test database
const getTestUserByEmail = (email) => {
  return db.get(queries.getTestUserByEmail, email);
};

const getTestUserByNameAndEmail = (name, email) => {
  return db.get(queries.getTestUserByNameAndEmail, [name, email]);
};

// combined export for repositories
export default {
  // User methods
  ...userRepository,
  getUserByEmail,
  getUserByNameAndEmail,

  // Session methods
  ...sessionRepository,
  getSessionByUserId,
  deleteSessionByUserId,

  /* ---- test methods ----
   */
  // Test users
  getTestUsers: () => db.all(testQueries.getTestUsers),
  getTestUser: (id) => db.get(testQueries.getTestUser, id),
  createTestUser: (user) => db.run(testQueries.createTestUser, user),
  updateTestUser: (user) => db.run(testQueries.updateTestUser, user),
  deleteTestUser: (id) => db.run(testQueries.deleteTestUser, id),
  getTestUserByEmail,
  getTestUserByNameAndEmail,

  // Test sessions
  createTestSession: (session) =>
    db.run(testQueries.createTestSession, session),
  getTestSession: (id) => db.get(testQueries.getTestSession, id),
  getTestSessions: () => db.all(testQueries.getTestSessions),
  deleteTestSession: (id) => db.run(testQueries.deleteTestSession, id),
};
