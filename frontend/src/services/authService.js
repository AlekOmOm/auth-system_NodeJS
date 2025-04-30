// src/services/authService.js
const API_URL = import.meta.env.BACKEND_URL || "http://localhost:3001/api";

export const authService = {
  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  },

  /*
    {
      "name": "admin",
      "email": "admin@admin.com",
      "password": "GoodPassword!123"
    }
  */

  async login(credentials) {
    console.log(credentials);
    const url = `${API_URL}/auth/login`;
    console.log(url);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  },

  async logout() {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Logout failed");
    }

    return response.json();
  },

  async getCurrentUser() {
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Not authenticated");
    }

    return response.json();
  },
};
