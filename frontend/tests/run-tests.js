import { runAuthTests } from "./auth.test.js";
import { runUserTests } from "./users.test.js";

/**
 * Run all tests
 */
async function runAllTests() {
  console.log("Starting frontend integration tests...");
  console.log("Make sure the backend server is running on port 3001");

  const results = {
    auth: await runAuthTests(),
    users: await runUserTests(),
  };

  const allPassed = Object.values(results).every((result) => result === true);

  console.log("\n=== Test Summary ===");
  console.log("Auth tests:", results.auth ? "✅ Passed" : "❌ Failed");
  console.log("User tests:", results.users ? "✅ Passed" : "❌ Failed");
  console.log("===================");
  console.log(allPassed ? "All tests passed! ✅" : "Some tests failed! ❌");

  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
}

// Run all tests
runAllTests();
