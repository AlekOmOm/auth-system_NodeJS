import authService from "./auth.js";
import userService from "../services/userService.js";
import hashing from "../utils/hashing.js";

// Mock dependencies
jest.mock("../services/userService.js");
jest.mock("../utils/hashing.js");

describe("Auth Controller - Login Flow", () => {
  let req, res, next;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock request, response, and next
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
      session: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test("should login successfully with correct credentials", () => {
    // Mock user in database
    const mockUser = {
      id: "123",
      name: "Test User",
      email: "test@example.com",
      password: "hashedPassword",
      role: "user",
    };

    // Set up mocks
    userService.getUserByEmail.mockReturnValue(mockUser);
    userService.isSamePwd.mockReturnValue(true);

    // Call login function
    authService.login(req, res, next);

    // Verify getUserByEmail was called
    expect(userService.getUserByEmail).toHaveBeenCalledWith("test@example.com");

    // Verify password was compared
    expect(userService.isSamePwd).toHaveBeenCalledWith(
      "password123",
      "hashedPassword"
    );

    // Verify session was set
    expect(req.session.userId).toBe("123");
    expect(req.session.role).toBe("user");

    // Verify response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Logged in successfully",
        user: expect.objectContaining({
          id: "123",
          name: "Test User",
          email: "test@example.com",
        }),
      })
    );

    // Check that password is not included in response
    const responseUser = res.json.mock.calls[0][0].user;
    expect(responseUser.password).toBeUndefined();
  });

  test("should fail when user is not found", () => {
    // Mock user not found
    userService.getUserByEmail.mockReturnValue(null);

    // Call login function
    authService.login(req, res, next);

    // Verify response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User not found",
      })
    );

    // Verify isSamePwd was not called
    expect(userService.isSamePwd).not.toHaveBeenCalled();
  });

  test("should fail when password is incorrect", () => {
    // Mock user found but password incorrect
    const mockUser = {
      id: "123",
      name: "Test User",
      email: "test@example.com",
      password: "hashedPassword",
      role: "user",
    };

    userService.getUserByEmail.mockReturnValue(mockUser);
    userService.isSamePwd.mockReturnValue(false);

    // Call login function
    authService.login(req, res, next);

    // Verify response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Password incorrect",
      })
    );

    // Verify session was not set
    expect(req.session.userId).toBeUndefined();
  });

  test("should handle case when password in database is undefined", () => {
    // Mock user with undefined password
    const mockUser = {
      id: "123",
      name: "Test User",
      email: "test@example.com",
      password: undefined,
      role: "user",
    };

    userService.getUserByEmail.mockReturnValue(mockUser);
    userService.isSamePwd.mockReturnValue(false); // isSamePwd should handle undefined and return false

    // Call login function
    authService.login(req, res, next);

    // Verify response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Password incorrect",
      })
    );
  });
});
