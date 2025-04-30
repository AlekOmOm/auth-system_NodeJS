import { fetchGet, fetchPost } from "../util/fetch";

// Log the environment variable to debug
console.log("VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL);

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api";
console.log("Using BACKEND_URL:", BACKEND_URL);

const BACKEND_URL_AUTH = `${BACKEND_URL}/auth`;
const BACKEND_URL_USERS = `${BACKEND_URL}/users`;

/**
 * Test API connection by fetching users
 * @returns {Promise<Object>} The API response with users
 */
const testApi = async () => {
  try {
    // Direct fetch approach - this works
    const test = await fetch(`http://localhost:3001/api/users`);
    const response = await test.json();
    console.log("Direct fetch response:", response);

    // Using fetchGet utility
    console.log("Attempting fetchGet with URL:", BACKEND_URL_USERS);
    const result = await fetchGet(`${BACKEND_URL_USERS}`);
    console.log("fetchGet result:", result);

    return result;
  } catch (error) {
    console.error("Error in testApi:", error);
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} credentials - User credentials with username and password
 * @returns {Promise<Object>} Registration result with success status
 */
const register = async (credentials) => {
  console.log("const register called");

  try {
    // Input validation
    if (!credentials.username || !credentials.password) {
      return {
        message: "Username and password are required",
        success: false,
      };
    }

    const response = await fetchPost(
      `${BACKEND_URL_AUTH}/register`,
      credentials
    );

    // Check if the response indicates an error
    if (response.error || !response.id) {
      return {
        ...response,
        success: false,
      };
    }

    return {
      ...response,
      success: true,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      message: error.message || "Registration failed",
      success: false,
    };
  }
};

/**
 * Login a user with credentials
 * @param {Object} credentials - User credentials with username and password
 * @returns {Promise<Object>} Login result with success status
 */
const login = async (credentials) => {
  console.log("const login called");

  try {
    // Input validation
    if (!credentials.username || !credentials.password) {
      return {
        message: "Username and password are required",
        success: false,
      };
    }

    const response = await fetchPost(`${BACKEND_URL_AUTH}/login`, credentials);

    // Check if the response indicates an error
    if (response.error || !response.userId) {
      return {
        ...response,
        success: false,
      };
    }

    return {
      ...response,
      success: true,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      message: error.message || "Login failed",
      success: false,
    };
  }
};

// --- export ---
const authApi = {
  testApi,
  register,
  login,
};

export default authApi;
