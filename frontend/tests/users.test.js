import {
  loginUser,
  registerUser,
  logoutUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "./utils.js";
import { TEST_USER, ADMIN_USER } from "./config.js";

/**
 * Test getting all users (admin only)
 */
async function testGetAllUsers() {
  console.log("Testing get all users endpoint...");

  try {
    // Login as admin
    const loginResponse = await loginUser({
      email: ADMIN_USER.email,
      password: ADMIN_USER.password,
    });

    if (!loginResponse.ok) {
      throw new Error(`Admin login failed: ${loginResponse.data.message}`);
    }

    // Test getting all users
    const allUsersResponse = await getAllUsers();

    console.log("Get all users response:", allUsersResponse);

    // Assert getting all users was successful
    if (!allUsersResponse.ok) {
      throw new Error(
        `Getting all users failed: ${allUsersResponse.data.message}`
      );
    }

    // Assert users array is returned
    if (!Array.isArray(allUsersResponse.data.user)) {
      throw new Error("Users should be an array");
    }

    // Logout
    await logoutUser();

    // Test getting all users without being logged in
    const unauthorizedResponse = await getAllUsers();

    console.log("Unauthorized get all users response:", unauthorizedResponse);

    // Assert getting all users failed without being logged in
    if (unauthorizedResponse.ok) {
      throw new Error(
        "Getting all users should have failed without being logged in"
      );
    }

    console.log("Get all users tests passed! ✅");
    return true;
  } catch (error) {
    console.error("Get all users tests failed:", error);
    return false;
  }
}

/**
 * Test getting a user by ID
 */
async function testGetUserById() {
  console.log("Testing get user by ID endpoint...");

  try {
    // Register a test user
    const registerResponse = await registerUser(TEST_USER);

    if (!registerResponse.ok) {
      throw new Error(`Registration failed: ${registerResponse.data.message}`);
    }

    const userId = registerResponse.data.user.id;

    // Login as admin
    const loginResponse = await loginUser({
      email: ADMIN_USER.email,
      password: ADMIN_USER.password,
    });

    if (!loginResponse.ok) {
      throw new Error(`Admin login failed: ${loginResponse.data.message}`);
    }

    // Test getting user by ID
    const userResponse = await getUserById(userId);

    console.log("Get user by ID response:", userResponse);

    // Assert getting user by ID was successful
    if (!userResponse.ok) {
      throw new Error(
        `Getting user by ID failed: ${userResponse.data.message}`
      );
    }

    // Assert user data is correct
    const user = userResponse.data.user;
    if (user.email !== TEST_USER.email) {
      throw new Error(
        `User email mismatch: expected ${TEST_USER.email}, got ${user.email}`
      );
    }

    // Logout
    await logoutUser();

    // Test getting user by ID without being logged in
    const unauthorizedResponse = await getUserById(userId);

    console.log("Unauthorized get user by ID response:", unauthorizedResponse);

    // Assert getting user by ID failed without being logged in
    if (unauthorizedResponse.ok) {
      throw new Error(
        "Getting user by ID should have failed without being logged in"
      );
    }

    console.log("Get user by ID tests passed! ✅");
    return true;
  } catch (error) {
    console.error("Get user by ID tests failed:", error);
    return false;
  }
}

/**
 * Test updating a user
 */
async function testUpdateUser() {
  console.log("Testing update user endpoint...");

  try {
    // Register a test user
    const registerResponse = await registerUser(TEST_USER);

    if (!registerResponse.ok) {
      throw new Error(`Registration failed: ${registerResponse.data.message}`);
    }

    const userId = registerResponse.data.user.id;

    // Login as admin
    const loginResponse = await loginUser({
      email: ADMIN_USER.email,
      password: ADMIN_USER.password,
    });

    if (!loginResponse.ok) {
      throw new Error(`Admin login failed: ${loginResponse.data.message}`);
    }

    // Test updating user
    const updatedName = "Updated Test User";
    const updateResponse = await updateUser(userId, {
      name: updatedName,
    });

    console.log("Update user response:", updateResponse);

    // Assert updating user was successful
    if (!updateResponse.ok) {
      throw new Error(`Updating user failed: ${updateResponse.data.message}`);
    }

    // Get updated user
    const userResponse = await getUserById(userId);

    // Assert user data was updated
    const user = userResponse.data.user;
    if (user.name !== updatedName) {
      throw new Error(
        `User name was not updated: expected ${updatedName}, got ${user.name}`
      );
    }

    // Logout
    await logoutUser();

    // Test updating user without being logged in
    const unauthorizedResponse = await updateUser(userId, {
      name: "Unauthorized Update",
    });

    console.log("Unauthorized update user response:", unauthorizedResponse);

    // Assert updating user failed without being logged in
    if (unauthorizedResponse.ok) {
      throw new Error(
        "Updating user should have failed without being logged in"
      );
    }

    console.log("Update user tests passed! ✅");
    return true;
  } catch (error) {
    console.error("Update user tests failed:", error);
    return false;
  }
}

/**
 * Run all user tests
 */
async function runUserTests() {
  console.log("Running user tests...");

  const results = {
    getAllUsers: await testGetAllUsers(),
    getUserById: await testGetUserById(),
    updateUser: await testUpdateUser(),
  };

  const allPassed = Object.values(results).every((result) => result === true);

  console.log("User test results:", results);
  console.log(
    allPassed ? "All user tests passed! ✅" : "Some user tests failed! ❌"
  );

  return allPassed;
}

// Run the tests
runUserTests();
