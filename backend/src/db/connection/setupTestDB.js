import db from "./connection.js";
import queries from "./queries.js";
import seedData from "./seedData.json" with { type: "json" };

// Always recreate test tables for clean tests
console.log("Setting up test database...");

// Drop test tables if they exist
await db.exec(queries.dropTableTestSessions);
await db.exec(queries.dropTableTestUsers);

// Create test tables
await db.exec(queries.createTableTestUsers);
await db.exec(queries.createTableTestSessions);

// Seed test data
console.log("Seeding test tables...");
const seedTestQueries = queries.seedTestUsers(seedData.users);
await db.exec(seedTestQueries);

// Log test data for verification
try {
  const testUsers = await db.all(queries.getTestUsers);
  console.log("Test Users:", testUsers);
} catch (error) {
  console.error("Error retrieving test users:", error);
}

try {
  const testSessions = await db.all(queries.getTestSessions);
  console.log("Test Sessions:", testSessions);
} catch (error) {
  console.error("Error retrieving test sessions:", error);
}

console.log("Test database setup complete"); 