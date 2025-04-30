import db from "./connection.js";
import queries from "./queries.js";
import seedData from "./seedData.json" with { type: "json" };

// Delete mode
process.argv.includes("--delete") && console.log("Deleting tables...");

const deleteMode = process.argv.includes("--delete");

if (deleteMode) {
  db.exec("DROP TABLE IF EXISTS users");
}

// DDL
await db.exec(queries.createTableUsers);

// DML

// -- seeding --

if (deleteMode) {
  console.log("Seeding tables...");

  const seedQueries = queries.seedDefaultUsers(seedData.users);
  await db.exec(seedQueries);
}

// ------ print out ------

try {
  const users = await db.all(queries.getUsers);
  console.log("Users:", users);
} catch (error) {
  console.error("Error retrieving users:", error);
}
