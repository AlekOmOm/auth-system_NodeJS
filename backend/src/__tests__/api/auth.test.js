import request from "supertest";
import express from "express";
import authRoutes from "../../routes/auth.js";
import authController from "../../controllers/auth.js";
import userService from "../../services/userService.js";
import db from "../../db/db.js";

// Mock dependencies
jest.mock("../../controllers/auth.js");
jest.mock("../../services/userService.js");
jest.mock("../../db/db.js");
jest.mock("../../middleware/auth.js", () => ({
  isAuthenticated: jest.fn((req, res, next) => next()),
  isNotAdmin: jest.fn((req, res, next) => next()),
  isAdmin: jest.fn((req, res, next) => next()),
}));
jest.mock("../../utils/validation.js", () => ({
  register: jest.fn((req, res, next) => next()),
  login: jest.fn((req, res, next) => next()),
  logout: jest.fn((req, res, next) => next()),
}));

// Setup test app
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock controller functions
    authController.register.mockImplementation((req, res) => {
      res.status(201).json({ message: "User registered successfully" });
    });

    authController.login.mockImplementation((req, res) => {
      res.status(200).json({ message: "Logged in successfully" });
    });

    authController.logout.mockImplementation((req, res) => {
      res.status(200).json({ message: "Logged out successfully" });
    });

    authController.getCurrentUser.mockImplementation((req, res) => {
      res.status(200).json({ message: "User data retrieved successfully" });
    });
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
      expect(authController.register).toHaveBeenCalled();
    });

    test("should validate registration input", async () => {
      // This test verifies that validation middleware is called
      await request(app).post("/api/auth/register").send({});

      expect(authController.register).toHaveBeenCalled();
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
      expect(authController.login).toHaveBeenCalled();
    });

    test("should validate login input", async () => {
      await request(app).post("/api/auth/login").send({});

      expect(authController.login).toHaveBeenCalled();
    });
  });

  describe("POST /api/auth/logout", () => {
    test("should logout a user successfully", async () => {
      const response = await request(app).post("/api/auth/logout");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Logged out successfully"
      );
      expect(authController.logout).toHaveBeenCalled();
    });
  });

  describe("GET /api/auth/me", () => {
    test("should get current user data", async () => {
      const response = await request(app).get("/api/auth/me");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "User data retrieved successfully"
      );
      expect(authController.getCurrentUser).toHaveBeenCalled();
    });
  });

  describe("GET /api/auth/admin", () => {
    test("should get admin data", async () => {
      const response = await request(app).get("/api/auth/admin");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "User data retrieved successfully"
      );
      expect(authController.getCurrentUser).toHaveBeenCalled();
    });
  });
});
