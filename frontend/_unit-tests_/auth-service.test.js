import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchGet, fetchPost } from "../src/util/fetch";
import authApi from "../src/services/authApi";

// Mock global fetch
global.fetch = vi.fn();

describe("Fetch Utilities", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.spyOn(global, "fetch");
    fetchMock.mockClear();
  });

  describe("fetchGet", () => {
    it("should fetch data successfully", async () => {
      const mockData = { success: true, data: "test data" };
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue("application/json"),
        },
        json: vi.fn().mockResolvedValue(mockData),
      };

      fetchMock.mockResolvedValue(mockResponse);

      const result = await fetchGet("http://test-url.com");

      expect(fetchMock).toHaveBeenCalledWith("http://test-url.com", {
        credentials: "include",
      });
      expect(result).toEqual(mockData);
    });

    it("should handle API error responses", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        text: vi.fn().mockResolvedValue("Not Found"),
      };

      fetchMock.mockResolvedValue(mockResponse);

      await expect(fetchGet("http://test-url.com")).rejects.toThrow(
        "API error (404): Not Found"
      );
    });

    it("should handle non-JSON responses", async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue("text/html"),
        },
        text: vi.fn().mockResolvedValue("<html>Some HTML</html>"),
      };

      fetchMock.mockResolvedValue(mockResponse);

      await expect(fetchGet("http://test-url.com")).rejects.toThrow(
        "API returned non-JSON response"
      );
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network error");
      fetchMock.mockRejectedValue(networkError);

      await expect(fetchGet("http://test-url.com")).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("fetchPost", () => {
    it("should post data successfully", async () => {
      const requestBody = { username: "test", password: "password" };
      const mockData = { success: true, data: "test data" };
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue("application/json"),
        },
        json: vi.fn().mockResolvedValue(mockData),
      };

      fetchMock.mockResolvedValue(mockResponse);

      const result = await fetchPost("http://test-url.com", requestBody);

      expect(fetchMock).toHaveBeenCalledWith("http://test-url.com", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      expect(result).toEqual(mockData);
    });

    it("should handle API error responses", async () => {
      const requestBody = { username: "test", password: "wrong" };
      const mockResponse = {
        ok: false,
        status: 401,
        text: vi.fn().mockResolvedValue("Unauthorized"),
      };

      fetchMock.mockResolvedValue(mockResponse);

      await expect(
        fetchPost("http://test-url.com", requestBody)
      ).rejects.toThrow("API error (401): Unauthorized");
    });
  });
});

describe("Auth API Service", () => {
  let fetchMock;

  beforeEach(() => {
    // Mock fetch and reset it between tests
    fetchMock = vi.spyOn(global, "fetch");
    fetchMock.mockClear();

    // Reset console.log and console.error to avoid cluttered test output
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("register", () => {
    it("should register a user successfully", async () => {
      const credentials = { username: "newuser", password: "password123" };
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue("application/json"),
        },
        json: vi.fn().mockResolvedValue({
          id: "123",
          username: "newuser",
          message: "Registration successful",
        }),
      };

      fetchMock.mockResolvedValue(mockResponse);

      const result = await authApi.register(credentials);

      expect(result.success).toBe(true);
      expect(result.id).toBe("123");
      expect(result.username).toBe("newuser");
    });

    it("should return error when registration fails", async () => {
      const credentials = { username: "existinguser", password: "password123" };
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue("application/json"),
        },
        json: vi.fn().mockResolvedValue({
          error: "Username already exists",
        }),
      };

      fetchMock.mockResolvedValue(mockResponse);

      const result = await authApi.register(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Username already exists");
    });

    it("should validate input before making API call", async () => {
      const result = await authApi.register({ username: "", password: "" });

      expect(result.success).toBe(false);
      expect(result.message).toContain("Username and password are required");
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should login a user successfully", async () => {
      const credentials = {
        username: "existinguser",
        password: "correctpassword",
      };
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue("application/json"),
        },
        json: vi.fn().mockResolvedValue({
          userId: "123",
          username: "existinguser",
          token: "jwt-token-here",
          message: "Login successful",
        }),
      };

      fetchMock.mockResolvedValue(mockResponse);

      const result = await authApi.login(credentials);

      expect(result.success).toBe(true);
      expect(result.userId).toBe("123");
      expect(result.username).toBe("existinguser");
      expect(result.token).toBe("jwt-token-here");
    });

    it("should return error when login fails with wrong credentials", async () => {
      const credentials = {
        username: "existinguser",
        password: "wrongpassword",
      };
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue("application/json"),
        },
        json: vi.fn().mockResolvedValue({
          error: "Invalid username or password",
        }),
      };

      fetchMock.mockResolvedValue(mockResponse);

      const result = await authApi.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid username or password");
    });

    it("should validate input before making API call", async () => {
      const result = await authApi.login({ username: "", password: "" });

      expect(result.success).toBe(false);
      expect(result.message).toContain("Username and password are required");
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("testApi", () => {
    it("should successfully connect to the API", async () => {
      // Mock for direct fetch
      fetchMock.mockImplementation((url) => {
        if (url === "http://localhost:3001/api/users") {
          return Promise.resolve({
            ok: true,
            headers: {
              get: () => "application/json",
            },
            json: () =>
              Promise.resolve({ users: [{ id: 1, username: "test" }] }),
          });
        }
        return Promise.resolve({
          ok: true,
          headers: {
            get: () => "application/json",
          },
          json: () => Promise.resolve({ users: [{ id: 1, username: "test" }] }),
        });
      });

      const result = await authApi.testApi();

      expect(result).toHaveProperty("users");
      expect(fetchMock).toHaveBeenCalled();
    });

    it("should handle API connection errors", async () => {
      fetchMock.mockRejectedValue(new Error("Connection failed"));

      await expect(authApi.testApi()).rejects.toThrow("Connection failed");
    });
  });
});
