import { API_URL } from "./config.js";

/**
 * Make an API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - Response data
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Important for cookies/session
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();

  return {
    status: response.status,
    data,
    ok: response.ok,
  };
}

/**
 * Login a user
 * @param {Object} credentials - User credentials
 * @returns {Promise<Object>} - Login response
 */
export async function loginUser(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

/**
 * Register a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Registration response
 */
export async function registerUser(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/**
 * Logout the current user
 * @returns {Promise<Object>} - Logout response
 */
export async function logoutUser() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}

/**
 * Get the current user
 * @returns {Promise<Object>} - Current user response
 */
export async function getCurrentUser() {
  return apiRequest("/auth/current-user", {
    method: "GET",
  });
}

/**
 * Get all users (admin only)
 * @returns {Promise<Object>} - Users response
 */
export async function getAllUsers() {
  return apiRequest("/users", {
    method: "GET",
  });
}

/**
 * Get a user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} - User response
 */
export async function getUserById(id) {
  return apiRequest(`/users/${id}`, {
    method: "GET",
  });
}

/**
 * Update a user
 * @param {string} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} - Update response
 */
export async function updateUser(id, userData) {
  return apiRequest(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}
