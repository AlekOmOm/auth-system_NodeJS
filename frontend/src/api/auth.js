/**
 * Authentication API client
 * Simple wrapper for making API calls to the backend
 */

const API_URL = import.meta.env.BACKEND_URL || "http://localhost:3001/api";

/**
 * Login user
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} - User data and token
 */
export async function login(credentials) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for cookies/session
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Register new user
 * @param {Object} userData - User data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @returns {Promise<Object>} - User data
 */
export async function register(userData) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for cookies/session
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

/**
 * Logout user
 * @returns {Promise<Object>} - Success message
 */
export async function logout() {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // Important for cookies/session
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Logout failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

/**
 * Get current user
 * @returns {Promise<Object>} - User data
 */
export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_URL}/auth/current-user`, {
      method: "GET",
      credentials: "include", // Important for cookies/session
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get current user");
    }

    return await response.json();
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
}
