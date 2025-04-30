// src/stores/authStore.js
import { writable, derived } from "svelte/store";
import { API_URL } from "../config";

// Create the auth store
const createAuthStore = () => {
  const { subscribe, set, update } = writable({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  });

  return {
    subscribe,

    // Check authentication status
    checkAuth: async () => {
      update((state) => ({ ...state, loading: true, error: null }));

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include", // Important for cookies/session
        });

        // If we get a 401, the user is not authenticated
        if (response.status === 401) {
          set({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
          });
          return null;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to check authentication");
        }

        // Update the store with the user data
        set({
          user: data.user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });

        return data;
      } catch (error) {
        // If there's an error, assume user is not authenticated
        set({
          user: null,
          loading: false,
          error: null,
          isAuthenticated: false,
        });
        return null;
      }
    },

    // Login function
    login: async (credentials) => {
      update((state) => ({ ...state, loading: true, error: null }));

      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important for cookies/session
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        // Update the store with the user data
        set({
          user: data.user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });

        return data;
      } catch (error) {
        update((state) => ({
          ...state,
          loading: false,
          error: error.message || "Login failed",
          isAuthenticated: false,
        }));
        throw error;
      }
    },

    // Register function
    register: async (userData) => {
      update((state) => ({ ...state, loading: true, error: null }));

      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important for cookies/session
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        // Update the store with the user data
        set({
          user: data.user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });

        return data;
      } catch (error) {
        update((state) => ({
          ...state,
          loading: false,
          error: error.message || "Registration failed",
          isAuthenticated: false,
        }));
        throw error;
      }
    },

    // Logout function
    logout: async () => {
      update((state) => ({ ...state, loading: true, error: null }));

      try {
        const response = await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          credentials: "include", // Important for cookies/session
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Logout failed");
        }

        // Clear the store
        set({
          user: null,
          loading: false,
          error: null,
          isAuthenticated: false,
        });

        return data;
      } catch (error) {
        update((state) => ({
          ...state,
          loading: false,
          error: error.message || "Logout failed",
        }));
        throw error;
      }
    },

    // Get current user function
    getCurrentUser: async () => {
      update((state) => ({ ...state, loading: true, error: null }));

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include", // Important for cookies/session
        });

        // If we get a 401, the user is not authenticated
        if (response.status === 401) {
          set({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
          });
          return null;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to get current user");
        }

        // Update the store with the user data
        set({
          user: data.user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });

        return data;
      } catch (error) {
        update((state) => ({
          ...state,
          loading: false,
          error: error.message || "Failed to get current user",
          isAuthenticated: false,
        }));
        throw error;
      }
    },

    // Clear error function
    clearError: () => {
      update((state) => ({ ...state, error: null }));
    },
  };
};

// Create and export the auth store
export const auth = createAuthStore();
export const isAuthenticated = derived(auth, ($auth) => !!$auth.user);
export const isAdmin = derived(auth, ($auth) => $auth.user?.role === "admin");
