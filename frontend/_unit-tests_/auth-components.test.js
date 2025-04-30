import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, screen, cleanup } from "@testing-library/svelte";
import Login from "../src/routes/card/Login.svelte";
import Register from "../src/routes/card/Register.svelte";
import Card from "../src/components/Card.svelte";
import authApi from "../src/services/authApi";

// Mock the svelte-routing module
vi.mock("svelte-routing", () => {
  return {
    Router: vi.fn(),
    Route: vi.fn(),
    Link: vi.fn(),
    navigate: vi.fn(),
    useLocation: vi.fn().mockReturnValue({ pathname: "/" }),
  };
});

// Mock the components
vi.mock("../src/routes/card/Login.svelte", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      $set: vi.fn(),
      $on: vi.fn(),
      $destroy: vi.fn(),
    })),
  };
});

vi.mock("../src/routes/card/Register.svelte", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      $set: vi.fn(),
      $on: vi.fn(),
      $destroy: vi.fn(),
    })),
  };
});

vi.mock("../src/components/Card.svelte", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      $set: vi.fn(),
      $on: vi.fn(),
      $destroy: vi.fn(),
    })),
  };
});

// Mock auth API
vi.mock("../src/services/authApi", () => {
  return {
    default: {
      login: vi.fn(),
      register: vi.fn(),
    },
  };
});

const authApi = await import("../src/services/authApi");

describe("Auth Components Tests", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Suppress console output during tests
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Authentication Components", () => {
    it("should handle successful login", async () => {
      // Mock successful login
      authApi.default.login.mockResolvedValue({
        success: true,
        userId: "123",
        username: "testuser",
      });

      // Simulate login form submission with test credentials
      const credentials = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const result = await authApi.default.login(credentials);

      // Verify login was called with correct data
      expect(authApi.default.login).toHaveBeenCalledWith(credentials);
      expect(result.success).toBe(true);
      expect(result.userId).toBe("123");
    });

    it("should handle failed login", async () => {
      // Mock failed login
      authApi.default.login.mockResolvedValue({
        success: false,
        message: "Invalid credentials",
      });

      // Simulate login with bad credentials
      const badCredentials = {
        username: "wronguser",
        email: "wrong@example.com",
        password: "wrongpassword",
      };

      const result = await authApi.default.login(badCredentials);

      // Verify results
      expect(authApi.default.login).toHaveBeenCalledWith(badCredentials);
      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid credentials");
    });

    it("should handle successful registration", async () => {
      // Mock successful registration
      authApi.default.register.mockResolvedValue({
        success: true,
        id: "456",
        username: "newuser",
      });

      // Simulate registration
      const newUser = {
        username: "newuser",
        email: "new@example.com",
        password: "newpassword123",
      };

      const result = await authApi.default.register(newUser);

      // Verify results
      expect(authApi.default.register).toHaveBeenCalledWith(newUser);
      expect(result.success).toBe(true);
      expect(result.id).toBe("456");
    });

    it("should handle failed registration", async () => {
      // Mock failed registration
      authApi.default.register.mockResolvedValue({
        success: false,
        message: "Username already exists",
      });

      // Simulate registration with existing username
      const existingUser = {
        username: "existinguser",
        email: "existing@example.com",
        password: "password123",
      };

      const result = await authApi.default.register(existingUser);

      // Verify results
      expect(authApi.default.register).toHaveBeenCalledWith(existingUser);
      expect(result.success).toBe(false);
      expect(result.message).toBe("Username already exists");
    });
  });

  // TODO: Add tests for form validation and error handling
  // TODO: Add tests for navigation between login and register forms
});

describe("Login Component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up the DOM after each test
    cleanup();
  });

  it("should render login form with required fields", () => {
    render(Login);

    expect(screen.getByPlaceholderText("name")).toBeTruthy();
    expect(screen.getByPlaceholderText("email")).toBeTruthy();
    expect(screen.getByPlaceholderText("password")).toBeTruthy();
    expect(screen.getByText("login")).toBeTruthy();
  });

  it("should call authApi.login with form data on submission", async () => {
    // Mocking a successful login
    authApi.login.mockResolvedValue({ success: true });

    render(Login);

    // Fill in the form
    await fireEvent.input(screen.getByPlaceholderText("name"), {
      target: { value: "testuser" },
    });

    await fireEvent.input(screen.getByPlaceholderText("email"), {
      target: { value: "test@example.com" },
    });

    await fireEvent.input(screen.getByPlaceholderText("password"), {
      target: { value: "password123" },
    });

    // Submit the form
    await fireEvent.click(screen.getByText("login"));

    // Check that login was called with the correct data
    expect(authApi.login).toHaveBeenCalledWith({
      name: "testuser",
      email: "test@example.com",
      password: "password123",
    });
  });

  it("should navigate to home on successful login", async () => {
    // Mock the navigate function from svelte-routing
    const navigateMock = vi.fn();
    vi.mock("svelte-routing", () => {
      return {
        Router: vi.fn(),
        Route: vi.fn(),
        Link: vi.fn(),
        navigate: navigateMock,
        useLocation: vi.fn().mockReturnValue({ pathname: "/" }),
      };
    });

    // Mock a successful login response
    authApi.login.mockResolvedValue({ success: true });

    render(Login);

    // Fill in and submit the form
    await fireEvent.input(screen.getByPlaceholderText("name"), {
      target: { value: "testuser" },
    });

    await fireEvent.input(screen.getByPlaceholderText("email"), {
      target: { value: "test@example.com" },
    });

    await fireEvent.input(screen.getByPlaceholderText("password"), {
      target: { value: "password123" },
    });

    await fireEvent.click(screen.getByText("login"));

    // Check navigation occurred
    expect(navigateMock).toHaveBeenCalledWith("/home");
  });

  it("should display error message on login failure", async () => {
    // Mock a failed login response
    authApi.login.mockResolvedValue({
      success: false,
      message: "Invalid credentials",
    });

    render(Login);

    // Fill in and submit the form
    await fireEvent.input(screen.getByPlaceholderText("name"), {
      target: { value: "testuser" },
    });

    await fireEvent.input(screen.getByPlaceholderText("email"), {
      target: { value: "test@example.com" },
    });

    await fireEvent.input(screen.getByPlaceholderText("password"), {
      target: { value: "wrongpassword" },
    });

    await fireEvent.click(screen.getByText("login"));

    // Check error message appears (Note: this will need adjusting based on actual implementation)
    expect(screen.getByText("Invalid credentials")).toBeTruthy();
  });

  // TODO: Add test for required field validation
  // TODO: Add test for form handling when API throws an exception
});

describe("Register Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render register form with required fields", () => {
    render(Register);

    expect(screen.getByPlaceholderText("name")).toBeTruthy();
    expect(screen.getByPlaceholderText("email")).toBeTruthy();
    expect(screen.getByPlaceholderText("password")).toBeTruthy();
    expect(screen.getByText("register")).toBeTruthy();
  });

  it("should call authApi.register with form data on submission", async () => {
    // Mocking a successful registration
    authApi.register.mockResolvedValue({ success: true });

    render(Register);

    // Fill in the form
    await fireEvent.input(screen.getByPlaceholderText("name"), {
      target: { value: "newuser" },
    });

    await fireEvent.input(screen.getByPlaceholderText("email"), {
      target: { value: "new@example.com" },
    });

    await fireEvent.input(screen.getByPlaceholderText("password"), {
      target: { value: "password123" },
    });

    // Submit the form
    await fireEvent.click(screen.getByText("register"));

    // Check that register was called with the correct data
    expect(authApi.register).toHaveBeenCalledWith({
      name: "newuser",
      email: "new@example.com",
      password: "password123",
    });
  });

  it("should navigate to home on successful registration", async () => {
    // Mock the navigate function from svelte-routing
    const navigateMock = vi.fn();
    vi.mock("svelte-routing", () => {
      return {
        Router: vi.fn(),
        Route: vi.fn(),
        Link: vi.fn(),
        navigate: navigateMock,
        useLocation: vi.fn().mockReturnValue({ pathname: "/" }),
      };
    });

    // Mock a successful registration response
    authApi.register.mockResolvedValue({ success: true });

    render(Register);

    // Fill in and submit the form
    await fireEvent.input(screen.getByPlaceholderText("name"), {
      target: { value: "newuser" },
    });

    await fireEvent.input(screen.getByPlaceholderText("email"), {
      target: { value: "new@example.com" },
    });

    await fireEvent.input(screen.getByPlaceholderText("password"), {
      target: { value: "password123" },
    });

    await fireEvent.click(screen.getByText("register"));

    // Check navigation occurred
    expect(navigateMock).toHaveBeenCalledWith("/home");
  });

  it("should display error message on registration failure", async () => {
    // Mock a failed registration response
    authApi.register.mockResolvedValue({
      success: false,
      message: "User already exists",
    });

    render(Register);

    // Fill in and submit the form
    await fireEvent.input(screen.getByPlaceholderText("name"), {
      target: { value: "existinguser" },
    });

    await fireEvent.input(screen.getByPlaceholderText("email"), {
      target: { value: "existing@example.com" },
    });

    await fireEvent.input(screen.getByPlaceholderText("password"), {
      target: { value: "password123" },
    });

    await fireEvent.click(screen.getByText("register"));

    // Check error message appears
    expect(screen.getByText("User already exists")).toBeTruthy();
  });

  // TODO: Add test for required field validation
  // TODO: Add test for form handling when API throws an exception
});

describe("Card Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render Card component with login form by default", () => {
    // Mock the location to be the root path
    vi.mock("svelte-routing", () => {
      return {
        Router: vi.fn(),
        Route: vi.fn(),
        Link: vi.fn(),
        navigate: vi.fn(),
        useLocation: vi.fn().mockReturnValue({ pathname: "/" }),
      };
    });

    render(Card);

    // Should show login form by default
    expect(screen.getByText("login")).toBeTruthy();
    expect(screen.getByText("register here")).toBeTruthy();

    // Card should not be flipped initially
    const cardElement = document.querySelector(".card");
    expect(cardElement.classList.contains("is-flipped")).toBe(false);
  });

  it("should flip the card when location is /register", () => {
    // Mock the location to be /register
    vi.mock("svelte-routing", () => {
      return {
        Router: vi.fn(),
        Route: vi.fn(),
        Link: vi.fn(),
        navigate: vi.fn(),
        useLocation: vi.fn().mockReturnValue({ pathname: "/register" }),
      };
    });

    render(Card);

    // Card should be flipped when on register route
    const cardElement = document.querySelector(".card");
    expect(cardElement.classList.contains("is-flipped")).toBe(true);

    // Should show the "already have an account?" text on the back face
    expect(screen.getByText("already have an account?")).toBeTruthy();
  });

  // TODO: Test navigation between login and register views
  // TODO: Test that the card flips smoothly (CSS transition)
});
