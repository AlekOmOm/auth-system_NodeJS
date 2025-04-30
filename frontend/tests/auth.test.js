import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
} from "./utils.js";
import { TEST_USER, ADMIN_USER } from "./config.js";

/**
 * Test the login endpoint
 */
async function testLogin() {
  console.log("Testing login endpoint...");

  try {
    // Test admin login
    const adminResponse = await loginUser({
      email: ADMIN_USER.email,
      password: ADMIN_USER.password,
    });

    console.log("Admin login response:", adminResponse);

    // Assert admin login was successful
    if (!adminResponse.ok) {
      throw new Error(`Admin login failed: ${adminResponse.data.message}`);
    }

    // Test invalid login
    const invalidResponse = await loginUser({
      email: "invalid@example.com",
      password: "wrongpassword",
    });

    console.log("Invalid login response:", invalidResponse);

    // Assert invalid login failed
    if (invalidResponse.ok) {
      throw new Error("Invalid login should have failed");
    }

    console.log("Login tests passed! ✅");
    return true;
  } catch (error) {
    console.error("Login tests failed:", error);
    return false;
  }
}

/**
 * Test the register endpoint
 */
async function testRegister() {
  console.log("Testing register endpoint...");

  try {
    // Test user registration
    const registerResponse = await registerUser(TEST_USER);

    console.log("Register response:", registerResponse);

    // Assert registration was successful
    if (!registerResponse.ok) {
      throw new Error(`Registration failed: ${registerResponse.data.message}`);
    }

    // Test duplicate registration
    const duplicateResponse = await registerUser(TEST_USER);

    console.log("Duplicate registration response:", duplicateResponse);

    // Assert duplicate registration failed
    if (duplicateResponse.ok) {
      throw new Error("Duplicate registration should have failed");
    }

    console.log("Register tests passed! ✅");
    return true;
  } catch (error) {
    console.error("Register tests failed:", error);
    return false;
  }
}

/**
 * Test the logout endpoint
 */
async function testLogout() {
  console.log("Testing logout endpoint...");

  try {
    // Login first
    await loginUser({
      email: ADMIN_USER.email,
      password: ADMIN_USER.password,
    });

    // Test logout
    const logoutResponse = await logoutUser();

    console.log("Logout response:", logoutResponse);

    // Assert logout was successful
    if (!logoutResponse.ok) {
      throw new Error(`Logout failed: ${logoutResponse.data.message}`);
    }

    // Test getting current user after logout
    const currentUserResponse = await getCurrentUser();

    console.log("Current user after logout:", currentUserResponse);

    // Assert getting current user failed after logout
    if (currentUserResponse.ok) {
      throw new Error("Getting current user should have failed after logout");
    }

    console.log("Logout tests passed! ✅");
    return true;
  } catch (error) {
    console.error("Logout tests failed:", error);
    return false;
  }
}

/**
 * Test the current user endpoint
 */
async function testCurrentUser() {
  console.log("Testing current user endpoint...");

  try {
    // Login first
    const loginResponse = await loginUser({
      email: ADMIN_USER.email,
      password: ADMIN_USER.password,
    });

    // Test getting current user
    const currentUserResponse = await getCurrentUser();

    console.log("Current user response:", currentUserResponse);

    // Assert getting current user was successful
    if (!currentUserResponse.ok) {
      throw new Error(
        `Getting current user failed: ${currentUserResponse.data.message}`
      );
    }

    // Assert user data is correct
    const user = currentUserResponse.data.user;
    if (user.email !== ADMIN_USER.email) {
      throw new Error(
        `User email mismatch: expected ${ADMIN_USER.email}, got ${user.email}`
      );
    }

    // Logout
    await logoutUser();

    console.log("Current user tests passed! ✅");
    return true;
  } catch (error) {
    console.error("Current user tests failed:", error);
    return false;
  }
}

/**
 * Run all auth tests
 */
async function runAuthTests() {
  console.log("Running auth tests...");

  const results = {
    login: await testLogin(),
    register: await testRegister(),
    logout: await testLogout(),
    currentUser: await testCurrentUser(),
  };

  const allPassed = Object.values(results).every((result) => result === true);

  console.log("Auth test results:", results);
  console.log(
    allPassed ? "All auth tests passed! ✅" : "Some auth tests failed! ❌"
  );

  return allPassed;
}

// Run the tests
runAuthTests();
