/**
 * Test Configuration
 *
 * This file configures how the tests interact with the database.
 * It overrides the normal repository methods to use the test tables
 * instead of the main tables.
 */

import db from "../src/db/repository.js";

// Override repository methods to use test tables
const originalMethods = {
  getUsers: db.getUsers,
  getUser: db.getUser,
  createUser: db.createUser,
  updateUser: db.updateUser,
  deleteUser: db.deleteUser,
  getUserByEmail: db.getUserByEmail,
  getUserByNameAndEmail: db.getUserByNameAndEmail,

  createSession: db.createSession,
  getSession: db.getSession,
  deleteSession: db.deleteSession,
  getSessionByUserId: db.getSessionByUserId,
  deleteSessionByUserId: db.deleteSessionByUserId,
};

// Apply test table overrides
db.getUsers = db.getTestUsers;
db.getUser = db.getTestUser;
db.createUser = db.createTestUser;
db.updateUser = db.updateTestUser;
db.deleteUser = db.deleteTestUser;
db.getUserByEmail = db.getTestUserByEmail;
db.getUserByNameAndEmail = db.getTestUserByNameAndEmail;

db.createSession = db.createTestSession;
db.getSession = db.getTestSession;
db.deleteSession = db.deleteTestSession;

// Function to restore original methods (after tests)
export function restoreRepository() {
  Object.assign(db, originalMethods);
}

// Function to reset test database (before tests)
export async function resetTestDatabase() {
  // Drop and recreate test tables
  await db.exec(db.dropTableTestSessions);
  await db.exec(db.dropTableTestUsers);
  await db.exec(db.createTableTestUsers);
  await db.exec(db.createTableTestSessions);

  // Seed test data if needed
  // await db.exec(db.seedTestUsers(testData));
}

export default db;
