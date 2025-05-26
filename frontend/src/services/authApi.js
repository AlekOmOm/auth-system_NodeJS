import { fetchGet, fetchPost } from "../util/fetch";
import { authStore } from "../stores/authStore";
import config from "../config/index.js";

const { api } = config;

/**
 * Test API connection by fetching users
 * @returns {Promise<Object>} The API response with users
 */
const testApi = async () => {
  try {
    console.log("testApi called");
    const result = await fetchGet(`${api.baseUrl}/users`);
    console.log("result");
    console.log(result);

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
  try {
    // Input validation
    if (!credentials.name || !credentials.email || !credentials.password) {
      return {
        message: "Name, email and password are required",
        success: false,
      };
    }

    // fetchPost now returns an object like { success: boolean, data: ..., errors: ..., message: ... }
    const response = await fetchPost(
      `${api.baseUrl}/auth/register`,
      credentials
    );

    if (!response.success) {
      return response;
    }

    console.log("Registration successful response from fetchPost:", response);

    // --- Added: Update authStore on successful registration ---
    if (response.data && response.data.user) {
      authStore.login(response.data.user);
    } else {
      // Start of Selection
      console.warn(
        "Registration successful, but user data missing in response."
      );
      // End of Selection

      // Return the successful response object
      return response;
    }
  } catch (error) {
    // This catch block should now ideally only handle unexpected errors *within this function's logic*,
    // as fetchPost catches its own errors.
    console.error("Unexpected error in authApi.register:", error);
    return {
      message:
        error.message || "An unexpected error occurred during registration",
      success: false,
    };
  }
};

/**
 * Login a user with credentials
 * @param {Object} credentials - User credentials with email and password (name removed)
 * @returns {Promise<Object>} Login result with success status
 * - invalid input (credentials):
 *    {
 *       message: ...,
 *       success: false,
 *    }
 * - sucess:
 *    {
 *       data: {
 *          ... // user data
 *          allowedUrls: [...],
 *       },
 *       message: ...,
 *       errors: ...,
 *    }
 * - failure:
 *    {
 *       message: ...,
 *       success: false,
 *    }
 */
const login = async (credentials, returnUrl = null) => {
  console.log("const login called");

  try {
    // Input validation (assuming email/password for login)
    if (!credentials.email || !credentials.password) {
      return {
        message: "Email and password are required",
        success: false,
      };
    }

    /**
     * sends Post request to /login
     *
     * req:
     *   {
     *     body: {
     *       credentials: { email, password },
     *       returnUrl: ...
     *     }
     *   }
     */
    const response = await fetchPost(`${api.baseUrl}/auth/login`, {
      credentials,
      returnUrl,
    });

    // fetchPost returns { success, data, message, errors }
    if (!response.success) {
      // Return the structured error from fetchPost
      return response;
    }

    // --- Added: Update authStore on successful login ---
    // Check if the response indicates success and contains essential user data (like userId)
    if (response.success && response.data && response.data.userId) {
      authStore.login(response.data); // Pass the whole data object
      return {
        ...response, // Keep other potential info from response
        success: true,
      };
    } else if (response.success) {
      // Handle case where login API reports success but essential data (userId) is missing
      console.warn(
        "Login successful, but essential user data (userId) missing in response:",
        response.data
      );
      return {
        ...response, // Keep other potential info from response
        success: false,
        message: "Login successful, but user data is incomplete.", // More specific message
      };
    } else {
      // Handle the case where fetchPost already indicated failure
      return response; // Return the original error response from fetchPost
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      message: error.message || "Login failed",
      success: false,
    };
  }
};

/**
 * Logout the current user
 * @returns {Promise<Object>} Logout result with success status
 */
const logout = async () => {
  try {
    const response = await fetchPost(`${api.baseUrl}/auth/logout`, {});

    authStore.logout();
    return {
      ...response,
      success: true,
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      message: error.message || "Logout failed",
      success: false,
    };
  }
};

/**
 * Get current user session
 * @returns {Promise<Object>} Session result
 */
const getCurrentUser = async () => {
  try {
    const response = await fetchGet(`${api.baseUrl}/auth/session`);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return {
      message: error.message || "Failed to get current user",
      success: false,
    };
  }
};

// --- export ---
const authApi = {
  testApi,
  register,
  login,
  logout,
  getCurrentUser,
};

export default authApi;
