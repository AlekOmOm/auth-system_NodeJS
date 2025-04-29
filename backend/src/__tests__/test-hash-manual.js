import hashing from "../utils/hashing.js";

/**
 * Manual test script for password hashing and comparison
 * Run this with: node src/utils/test-hash-manual.js
 */

// Test scenario 1: Basic hash and compare
console.log("=== Test Scenario 1: Basic hash and compare ===");
const password = "secretPassword123";
console.log(`Original password: ${password}`);

const hashedPassword = hashing.hash(password);
console.log(`Hashed password: ${hashedPassword}`);

const compareResult = hashing.compare(password, hashedPassword);
console.log(`Compare result (should be true): ${compareResult}`);

const wrongCompare = hashing.compare("wrongPassword", hashedPassword);
console.log(`Compare with wrong password (should be false): ${wrongCompare}`);

// Test scenario 2: Edge cases
console.log("\n=== Test Scenario 2: Edge cases ===");

console.log("Testing with empty string:");
try {
  const emptyHash = hashing.hash("");
  console.log(`Empty string hash: ${emptyHash}`);
  const emptyCompare = hashing.compare("", emptyHash);
  console.log(`Empty string compare (should be true): ${emptyCompare}`);
} catch (error) {
  console.error(`Error with empty string: ${error.message}`);
}

console.log("\nTesting error handling:");
try {
  console.log("Attempting to compare with undefined hash...");
  const undefinedResult = hashing.compare(password, undefined);
  console.log(`Result (should throw error): ${undefinedResult}`);
} catch (error) {
  console.error(`Expected error caught: ${error.message}`);
}

// Test scenario 3: Modified isSamePwd function with error handling
console.log("\n=== Test Scenario 3: Safe password comparison ===");

// Replicating the fixed isSamePwd function
function isSamePwd(reqPwd, dbPwd) {
  // Check if either password is undefined or null
  if (!reqPwd || !dbPwd) {
    console.log("One of the passwords is undefined or null, returning false");
    return false;
  }

  try {
    const isMatch = hashing.compare(reqPwd, dbPwd);
    return isMatch;
  } catch (error) {
    console.error(`Password comparison error: ${error.message}`);
    return false;
  }
}

// Test with valid values
console.log("Test with valid values:");
const validResult = isSamePwd(password, hashedPassword);
console.log(`Valid comparison result (should be true): ${validResult}`);

// Test with undefined
console.log("\nTest with undefined password:");
const safeResult = isSamePwd(password, undefined);
console.log(
  `Safe comparison result with undefined (should be false): ${safeResult}`
);

console.log("\n=== Tests completed ===");
