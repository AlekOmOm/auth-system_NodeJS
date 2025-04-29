import { jest, describe, beforeEach, test, expect } from "@jest/globals";
import request from "supertest";
import express from "express";
import userRoutes from "../../routes/user.js";
import userService from "../../services/userService.js";

// Mock dependencies
jest.mock("../../services/userService.js");

// Setup test app
const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

describe("User Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock service functions
    userService.getUsers.mockImplementation((req, res) => {
      res.status(200).json({
        message: "Users retrieved successfully",
        users: [
          { id: "1", name: "User 1", email: "user1@example.com", role: "user" },
          {
            id: "2",
            name: "User 2",
            email: "user2@example.com",
            role: "admin",
          },
        ],
      });
    });

    userService.getUserById.mockImplementation((req, res) => {
      res.status(200).json({
        message: "User retrieved successfully",
        user: {
          id: req.params.id,
          name: "Test User",
          email: "test@example.com",
          role: "user",
        },
      });
    });

    userService.getUserByNameAndEmail.mockImplementation((req, res) => {
      res.status(200).json({
        message: "User retrieved successfully",
        user: {
          id: "1",
          name: req.params.name,
          email: req.params.email,
          role: "user",
        },
      });
    });

    userService.updateUser.mockImplementation((req, res) => {
      res.status(200).json({
        message: "User updated successfully",
        user: { id: req.params.id, ...req.body, role: "user" },
      });
    });
  });

  describe("GET /api/users", () => {
    test("should get all users", async () => {
      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Users retrieved successfully"
      );
      expect(response.body).toHaveProperty("users");
      expect(response.body.users).toBeInstanceOf(Array);
      expect(userService.getUsers).toHaveBeenCalled();
    });
  });

  describe("GET /api/users/:id", () => {
    test("should get user by id", async () => {
      const response = await request(app).get("/api/users/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "User retrieved successfully"
      );
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("id", "1");
      expect(userService.getUserById).toHaveBeenCalled();
    });
  });

  describe("GET /api/users/:name&email", () => {
    test("should get user by name and email", async () => {
      const response = await request(app).get("/api/users/testuser&email");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "User retrieved successfully"
      );
      expect(response.body).toHaveProperty("user");
      expect(userService.getUserByNameAndEmail).toHaveBeenCalled();
    });
  });

  describe("PUT /api/users/:id", () => {
    test("should update user by id", async () => {
      const userData = {
        name: "Updated User",
        email: "updated@example.com",
      };

      const response = await request(app).put("/api/users/1").send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "User updated successfully"
      );
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("id", "1");
      expect(response.body.user).toHaveProperty("name", "Updated User");
      expect(userService.updateUser).toHaveBeenCalled();
    });
  });
});
