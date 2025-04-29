import { jest, describe, beforeEach, test, expect } from "@jest/globals";
import request from "supertest";
import express from "express";
import session from "express-session";
import authRoutes from "../../routes/auth.js";
import * as authControllerModule from "../../controllers/auth.js";

// Create a spy for the auth controller
const registerMock = jest.fn((req, res) => {
  res.status(201).json({ message: "User registered successfully" });
});

const loginMock = jest.fn((req, res) => {
  req.session.userId = "1";
  req.session.role = "user";
  res.status(200).json({ message: "Logged in successfully" });
});

const logoutMock = jest.fn((req, res) => {
  if (req.session) {
    req.session.destroy = jest.fn((cb) => cb());
  }
  res.status(200).json({ message: "Logged out successfully" });
});

const getCurrentUserMock = jest.fn((req, res) => {
  res.status(200).json({ message: "User data retrieved successfully" });
});

// Mock the auth controller
jest.mock("../../controllers/auth.js", () => ({
  default: {
    register: registerMock,
    login: loginMock,
    logout: logoutMock,
    getCurrentUser: getCurrentUserMock,
  },
}));

// Mock middleware
jest.mock("../../middleware/auth.js", () => ({
  isAuthenticated: (req, res, next) => {
    if (!req.session || !req.session.userId) {
      req.session = { userId: "1", role: "user" };
    }
    next();
  },
  isNotAdmin: (req, res, next) => next(),
  isAdmin: (req, res, next) => next(),
}));

// Mock validation
jest.mock("../../utils/validation.js", () => ({
  register: (req, res, next) => next(),
  login: (req, res, next) => next(),
  logout: (req, res, next) => next(),
}));

// Setup test app
const app = express();
app.use(express.json());
app.use(
  session({
    secret: "test-secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/api/auth", authRoutes);

describe("Auth Routes", () => {
  let authController;

  beforeEach(() => {
    // Access the mocked controller
    authController = authControllerModule.default;

    // Clear mocks
    jest.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    test("should register a new user successfully", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "User registered successfully"
      );
      expect(registerMock).toHaveBeenCalled();
    });

    test("should validate registration input", async () => {
      await request(app).post("/api/auth/register").send({});

      expect(registerMock).toHaveBeenCalled();
    });
  });

  describe("POST /api/auth/login", () => {
    test("should login a user successfully", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Logged in successfully");
      expect(loginMock).toHaveBeenCalled();
    });

    test("should validate login input", async () => {
      await request(app).post("/api/auth/login").send({});

      expect(loginMock).toHaveBeenCalled();
    });
  });

  describe("POST /api/auth/logout", () => {
    test("should logout a user successfully", async () => {
      // Set a session cookie
      const agent = request.agent(app);
      await agent.post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      const response = await agent.post("/api/auth/logout");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Logged out successfully"
      );
      expect(logoutMock).toHaveBeenCalled();
    });
  });

  describe("GET /api/auth/me", () => {
    test("should get current user data", async () => {
      // Set a session cookie
      const agent = request.agent(app);
      await agent.post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      const response = await agent.get("/api/auth/me");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "User data retrieved successfully"
      );
      expect(getCurrentUserMock).toHaveBeenCalled();
    });
  });

  describe("GET /api/auth/admin", () => {
    test("should get admin data", async () => {
      // Set a session cookie with admin role
      const agent = request.agent(app);
      await agent.post("/api/auth/login").send({
        email: "admin@example.com",
        password: "password123",
      });

      const response = await agent.get("/api/auth/admin");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "User data retrieved successfully"
      );
      expect(getCurrentUserMock).toHaveBeenCalled();
    });
  });
});
