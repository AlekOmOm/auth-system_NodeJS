import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import authApi from "../src/services/authApi";
import { fetchGet, fetchPost } from "../src/util/fetch";

// Mock environment variables
vi.stubEnv("VITE_BACKEND_URL", "http://localhost:3001/api");

// Mock the fetch utilities
vi.mock("../src/util/fetch", () => ({
  fetchGet: vi.fn(),
  fetchPost: vi.fn(),
}));

describe("Auth API Integration Tests", () => {
  // Mock data that matches actual API response structure
  const mockUsers = {
    message: "Users retrieved successfully",
    users: [
      { id: 1, name: "admin", role: "admin", email: "admin@admin.com" },
      { id: 2, name: "user1", role: "user", email: "user1@user.com" },
      { id: 3, name: "user2", role: "user", email: "user2@user.com" },
      { id: 4, name: "user3", role: "user", email: "user3@user.com" },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful direct fetch
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      })
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("testApi", () => {
    it("should fetch users successfully", async () => {
      // Mock successful response for fetchGet
      fetchGet.mockResolvedValue(mockUsers);

      const result = await authApi.testApi();

      // Check that fetchGet was called with correct URL
      expect(fetchGet).toHaveBeenCalledWith("http://localhost:3001/api/users");
      expect(result).toEqual(mockUsers);
    });

    it("should handle API errors", async () => {
      // Mock direct fetch success but fetchGet failure
      global.fetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUsers),
        })
      );

      // Mock error response for fetchGet
      fetchGet.mockRejectedValue(new Error("Network error"));

      await expect(authApi.testApi()).rejects.toThrow("Network error");
    });
  });

  describe("register", () => {
    it("should register a user successfully", async () => {
      const credentials = { username: "testuser", password: "password123" };
      const mockResponse = {
        id: 5,
        name: "testuser",
        role: "user",
        email: "testuser@example.com",
        message: "User registered successfully",
      };

      fetchPost.mockResolvedValue(mockResponse);

      const result = await authApi.register(credentials);

      expect(fetchPost).toHaveBeenCalledWith(
        "http://localhost:3001/api/auth/register",
        credentials
      );
      expect(result).toEqual({
        ...mockResponse,
        success: true,
      });
    });

    it("should handle registration errors", async () => {
      const credentials = { username: "admin", password: "password123" };
      const mockError = { message: "Username already exists" };

      fetchPost.mockResolvedValue(mockError);

      const result = await authApi.register(credentials);

      expect(result).toEqual({
        ...mockError,
        success: false,
      });
    });

    it("should validate input data", async () => {
      const invalidCredentials = { username: "", password: "" };

      const result = await authApi.register(invalidCredentials);

      expect(fetchPost).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: "Username and password are required",
        success: false,
      });
    });
  });

  describe("login", () => {
    it("should login a user successfully", async () => {
      const credentials = { username: "testuser", password: "password123" };
      const mockResponse = {
        userId: 1,
        name: "testuser",
        role: "user",
        message: "Login successful",
      };

      fetchPost.mockResolvedValue(mockResponse);

      const result = await authApi.login(credentials);

      expect(fetchPost).toHaveBeenCalledWith(
        "http://localhost:3001/api/auth/login",
        credentials
      );
      expect(result).toEqual({
        ...mockResponse,
        success: true,
      });
    });

    it("should handle login errors", async () => {
      const credentials = { username: "testuser", password: "wrongpassword" };
      const mockError = { message: "Invalid credentials" };

      fetchPost.mockResolvedValue(mockError);

      const result = await authApi.login(credentials);

      expect(result).toEqual({
        ...mockError,
        success: false,
      });
    });

    it("should validate input data", async () => {
      const invalidCredentials = { username: "", password: "" };

      const result = await authApi.login(invalidCredentials);

      expect(fetchPost).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: "Username and password are required",
        success: false,
      });
    });
  });
});
