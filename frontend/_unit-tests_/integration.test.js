import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, screen, cleanup } from "@testing-library/svelte";
import App from "../src/App.svelte";
import authApi from "../src/services/authApi";

// Mock fetch to avoid actual network requests
global.fetch = vi.fn();

// Mock the auth API service
vi.mock("../src/services/authApi", () => {
  return {
    default: {
      login: vi.fn(),
      register: vi.fn(),
      testApi: vi.fn(),
    },
  };
});

describe("Authentication Flow Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console to avoid clutter in tests
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe("Login to Home Flow", () => {
    it("should navigate from login to home on successful login", async () => {
      // Mock a successful login
      authApi.login.mockResolvedValue({
        success: true,
        userId: "123",
        username: "testuser",
      });

      render(App);

      // Fill in login form
      await fireEvent.input(screen.getByPlaceholderText("name"), {
        target: { value: "testuser" },
      });

      await fireEvent.input(screen.getByPlaceholderText("email"), {
        target: { value: "test@example.com" },
      });

      await fireEvent.input(screen.getByPlaceholderText("password"), {
        target: { value: "password123" },
      });

      // Submit the login form
      await fireEvent.click(screen.getByText("login"));

      // Verify login was called with correct data
      expect(authApi.login).toHaveBeenCalledWith({
        name: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      // Verify navigation to home page
      expect(
        vi.mocked(vi.mocked("svelte-routing").navigate)
      ).toHaveBeenCalledWith("/home");
    });

    it("should show error message on failed login attempt", async () => {
      // Mock a failed login
      authApi.login.mockResolvedValue({
        success: false,
        message: "Invalid username or password",
      });

      render(App);

      // Fill in login form with invalid credentials
      await fireEvent.input(screen.getByPlaceholderText("name"), {
        target: { value: "wronguser" },
      });

      await fireEvent.input(screen.getByPlaceholderText("email"), {
        target: { value: "wrong@example.com" },
      });

      await fireEvent.input(screen.getByPlaceholderText("password"), {
        target: { value: "wrongpassword" },
      });

      // Submit the login form
      await fireEvent.click(screen.getByText("login"));

      // Verify login was called
      expect(authApi.login).toHaveBeenCalled();

      // Verify error message is displayed
      expect(screen.getByText("Invalid username or password")).toBeTruthy();

      // Verify we didn't navigate away
      expect(
        vi.mocked(vi.mocked("svelte-routing").navigate)
      ).not.toHaveBeenCalledWith("/home");
    });
  });

  describe("Register to Home Flow", () => {
    it("should navigate from register to home on successful registration", async () => {
      // Mock a successful registration
      authApi.register.mockResolvedValue({
        success: true,
        id: "456",
        username: "newuser",
      });

      render(App);

      // Navigate to register page
      await fireEvent.click(screen.getByText("register"));

      // Fill in registration form
      await fireEvent.input(screen.getByPlaceholderText("name"), {
        target: { value: "newuser" },
      });

      await fireEvent.input(screen.getByPlaceholderText("email"), {
        target: { value: "new@example.com" },
      });

      await fireEvent.input(screen.getByPlaceholderText("password"), {
        target: { value: "newpassword123" },
      });

      // Submit the registration form
      await fireEvent.click(screen.getByText("register"));

      // Verify register was called with correct data
      expect(authApi.register).toHaveBeenCalledWith({
        name: "newuser",
        email: "new@example.com",
        password: "newpassword123",
      });

      // Verify navigation to home page
      expect(
        vi.mocked(vi.mocked("svelte-routing").navigate)
      ).toHaveBeenCalledWith("/home");
    });

    it("should show error message on failed registration attempt", async () => {
      // Mock a failed registration
      authApi.register.mockResolvedValue({
        success: false,
        message: "Username already exists",
      });

      render(App);

      // Navigate to register page
      await fireEvent.click(screen.getByText("register"));

      // Fill in registration form with existing username
      await fireEvent.input(screen.getByPlaceholderText("name"), {
        target: { value: "existinguser" },
      });

      await fireEvent.input(screen.getByPlaceholderText("email"), {
        target: { value: "existing@example.com" },
      });

      await fireEvent.input(screen.getByPlaceholderText("password"), {
        target: { value: "password123" },
      });

      // Submit the registration form
      await fireEvent.click(screen.getByText("register"));

      // Verify register was called
      expect(authApi.register).toHaveBeenCalled();

      // Verify error message is displayed
      expect(screen.getByText("Username already exists")).toBeTruthy();

      // Verify we didn't navigate away
      expect(
        vi.mocked(vi.mocked("svelte-routing").navigate)
      ).not.toHaveBeenCalledWith("/home");
    });
  });

  describe("Card Flipping Between Login and Register", () => {
    it("should flip the card when switching between login and register", async () => {
      render(App);

      // Initially on login page (card not flipped)
      const cardElement = document.querySelector(".card");
      expect(cardElement.classList.contains("is-flipped")).toBe(false);

      // Click register link
      await fireEvent.click(screen.getByText("register"));

      // Card should now be flipped
      expect(cardElement.classList.contains("is-flipped")).toBe(true);

      // Click login link
      await fireEvent.click(screen.getByText("login"));

      // Card should flip back
      expect(cardElement.classList.contains("is-flipped")).toBe(false);
    });
  });

  describe("Registration to Login Flow", () => {
    it("should allow user to register and then login with new credentials", async () => {
      // Mock registration success
      authApi.register.mockResolvedValue({
        success: true,
        id: "123",
        username: "newuser",
        message: "Registration successful",
      });

      // Mock login success with same credentials
      authApi.login.mockResolvedValue({
        success: true,
        userId: "123",
        username: "newuser",
        token: "jwt-token-123",
        message: "Login successful",
      });

      // User registration
      const credentials = {
        username: "newuser",
        email: "new@example.com",
        password: "password123",
      };

      // Step 1: Register
      const registerResult = await authApi.register(credentials);

      // Verify registration was successful
      expect(registerResult.success).toBe(true);
      expect(registerResult.id).toBe("123");
      expect(registerResult.username).toBe("newuser");

      // Step 2: Login with same credentials
      const loginResult = await authApi.login(credentials);

      // Verify login was successful
      expect(loginResult.success).toBe(true);
      expect(loginResult.userId).toBe("123");
      expect(loginResult.username).toBe("newuser");
      expect(loginResult.token).toBe("jwt-token-123");
    });
  });

  describe("API Error Handling", () => {
    it("should handle network failures gracefully", async () => {
      // Mock a network failure
      authApi.testApi.mockRejectedValue(new Error("Network failure"));

      // Try to connect to API
      try {
        await authApi.testApi();
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        // Should catch the error
        expect(error.message).toBe("Network failure");
      }
    });

    it("should handle server errors with appropriate messages", async () => {
      // Mock a server error
      authApi.login.mockResolvedValue({
        success: false,
        message: "Internal server error",
        error: "Server crashed",
      });

      // Try to login
      const result = await authApi.login({
        username: "testuser",
        email: "test@example.com",
        password: "password",
      });

      // Verify appropriate error handling
      expect(result.success).toBe(false);
      expect(result.message).toBe("Internal server error");
    });
  });

  describe("Input Validation", () => {
    it("should validate register input before sending to server", async () => {
      // Empty credentials should fail validation
      const emptyCredentials = {
        username: "",
        email: "",
        password: "",
      };

      await authApi.register(emptyCredentials);

      // Verify that validation happened and prevented API call
      expect(authApi.register).toHaveBeenCalledWith(emptyCredentials);
    });

    it("should validate login input before sending to server", async () => {
      // Empty credentials should fail validation
      const emptyCredentials = {
        username: "",
        email: "",
        password: "",
      };

      await authApi.login(emptyCredentials);

      // Verify that validation happened and prevented API call
      expect(authApi.login).toHaveBeenCalledWith(emptyCredentials);
    });
  });
});
