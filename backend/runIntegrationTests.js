/**
 * Integration Test Runner
 *
 * This script sets up a test database for integration tests.
 * It runs the tests in the _tests_ directory against the real database
 * but using test tables to keep the main database clean.
 */

import { exec } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runTests() {
  console.log("Setting up test database...");

  try {
    // Run the test database setup script
    await executeCommand("node src/db/setupTestDB.js");

    // Run all tests in the _tests_ directory
    console.log("Running integration tests...");
    await executeCommand("npm test");

    console.log("Tests completed!");
  } catch (error) {
    console.error("Error running tests:", error);
    process.exit(1);
  }
}

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);

      if (error) {
        console.error(`Error executing command: ${command}`);
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

// Run the tests
runTests();
