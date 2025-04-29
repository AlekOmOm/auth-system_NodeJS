import request from "supertest";
import express from "express";
import session from "express-session";
import cors from "cors";

// Import routes
import authRoutes from "../../routes/auth.js";
import userRoutes from "../../routes/user.js";
import accountRoutes from "../../routes/account.js";

// Mock controllers and services
jest.mock("../../controllers/auth.js");
jest.mock("../../controllers/account.js");
jest.mock("../../services/userService.js");

// Mock the auth middleware
jest.mock("../../middleware/auth.js", () => ({
  isAuthenticated: jest.fn((req, res, next) => {
    if (!req.session || !req.session.userId) {
      req.session = { userId: "1", role: "user" };
    }
    next();
  }),
  isNotAdmin: jest.fn((req, res, next) => next()),
  isAdmin: jest.fn((req, res, next) => next()),
  hasRole: jest.fn(() => (req, res, next) => next()),
  default: {
    isAuthenticated: jest.fn((req, res, next) => {
      if (!req.session || !req.session.userId) {
        req.session = { userId: "1", role: "user" };
      }
      next();
    }),
    isNotAdmin: jest.fn((req, res, next) => next()),
    isAdmin: jest.fn((req, res, next) => next()),
    hasRole: jest.fn(() => (req, res, next) => next()),
  },
}));

// Mock validation
jest.mock("../../utils/validation.js", () => ({
  register: jest.fn((req, res, next) => next()),
  login: jest.fn((req, res, next) => next()),
  logout: jest.fn((req, res, next) => next()),
}));

// Create a test app
const createTestApp = () => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // Session configuration
  app.use(
    session({
      secret: "test-secret",
      resave: false,
      saveUninitialized: false,
    })
  );

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/account", accountRoutes);

  return app;
};

describe("API Integration Tests", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = createTestApp();
  });

  describe("API Health Check", () => {
    test("API routes should be defined", async () => {
      // Auth routes
      await request(app)
        .post("/api/auth/register")
        .expect(function (res) {
          expect(res.status).not.toBe(404);
        });

      await request(app)
        .post("/api/auth/login")
        .expect(function (res) {
          expect(res.status).not.toBe(404);
        });

      await request(app)
        .post("/api/auth/logout")
        .expect(function (res) {
          expect(res.status).not.toBe(404);
        });

      // User routes
      await request(app)
        .get("/api/users")
        .expect(function (res) {
          expect(res.status).not.toBe(404);
        });

      await request(app)
        .get("/api/users/1")
        .expect(function (res) {
          expect(res.status).not.toBe(404);
        });

      // Account routes
      await request(app)
        .get("/api/account")
        .expect(function (res) {
          expect(res.status).not.toBe(404);
        });

      await request(app)
        .put("/api/account")
        .expect(function (res) {
          expect(res.status).not.toBe(404);
        });

      await request(app)
        .delete("/api/account")
        .expect(function (res) {
          expect(res.status).not.toBe(404);
        });
    });
  });

  describe("Authentication Flow", () => {
    test("should handle register -> login -> get account -> logout flow", async () => {
      // Mock controllers to simulate a complete auth flow
      const authController = require("../../controllers/auth.js").default;
      const accountController = require("../../controllers/account.js").default;

      // Register mock
      authController.register.mockImplementation((req, res) => {
        res.status(201).json({ message: "User registered successfully" });
      });

      // Login mock
      authController.login.mockImplementation((req, res) => {
        req.session.userId = "1";
        req.session.role = "user";
        res.status(200).json({
          message: "Logged in successfully",
          user: {
            id: "1",
            name: "Test User",
            email: "test@example.com",
            role: "user",
          },
        });
      });

      // Get account mock
      accountController.getAccount.mockImplementation((req, res) => {
        if (!req.session || !req.session.userId) {
          return res.status(401).json({ message: "Not authenticated" });
        }
        res.status(200).json({
          message: "Account retrieved successfully",
          account: {
            id: req.session.userId,
            name: "Test User",
            email: "test@example.com",
            role: req.session.role,
          },
        });
      });

      // Logout mock
      authController.logout.mockImplementation((req, res) => {
        req.session.destroy = jest.fn((callback) => callback());
        res.status(200).json({ message: "Logged out successfully" });
      });

      // Register
      const registerResponse = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        });

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body).toHaveProperty(
        "message",
        "User registered successfully"
      );

      // Login
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty(
        "message",
        "Logged in successfully"
      );

      // Get account (should be authenticated)
      const accountResponse = await request(app).get("/api/account");

      expect(accountResponse.status).toBe(200);
      expect(accountResponse.body).toHaveProperty(
        "message",
        "Account retrieved successfully"
      );

      // Logout
      const logoutResponse = await request(app).post("/api/auth/logout");

      expect(logoutResponse.status).toBe(200);
      expect(logoutResponse.body).toHaveProperty(
        "message",
        "Logged out successfully"
      );
    });
  });
});
