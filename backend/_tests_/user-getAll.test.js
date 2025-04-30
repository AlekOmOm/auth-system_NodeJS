import request from "supertest";
import app from "../server.js";
import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import db from "../src/db/repository.js";

// Mock the database operations
vi.mock("../src/db/repository.js", () => ({
  default: {
    getUsers: vi.fn(),
  },
}));

describe("User GetAll Endpoint Integration Tests", () => {
  // Sample users for testing
  const mockUsers = [
    { id: 1, name: "admin", role: "admin", email: "admin@example.com" },
    { id: 2, name: "user1", role: "user", email: "user1@example.com" },
    { id: 3, name: "user2", role: "user", email: "user2@example.com" },
  ];

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should return all users successfully", async () => {
    // Mock getUsers to return sample users
    db.getUsers.mockResolvedValue(mockUsers);

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("users");
    expect(response.body.users).toHaveLength(3);

    // Verify user data structure
    expect(response.body.users[0]).toHaveProperty("id");
    expect(response.body.users[0]).toHaveProperty("name");
    expect(response.body.users[0]).toHaveProperty("role");
    expect(response.body.users[0]).toHaveProperty("email");

    // Verify password is not returned
    expect(response.body.users[0]).not.toHaveProperty("password");
  });

  it("should return empty array when no users exist", async () => {
    // Mock getUsers to return empty array
    db.getUsers.mockResolvedValue([]);

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("users");
    expect(response.body.users).toHaveLength(0);
    expect(Array.isArray(response.body.users)).toBe(true);
  });

  it("should handle database errors gracefully", async () => {
    // Mock getUsers to throw error
    db.getUsers.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("error");
  });

  it("should not expose sensitive user data", async () => {
    // Mock getUsers to return users with sensitive data
    const usersWithSensitiveData = mockUsers.map((user) => ({
      ...user,
      password: "hashedPassword123",
      secretQuestion: "What is your pet name?",
      secretAnswer: "Fluffy",
    }));

    db.getUsers.mockResolvedValue(usersWithSensitiveData);

    const response = await request(app).get("/api/users");

    // Verify sensitive data is not returned
    expect(response.body.users[0]).not.toHaveProperty("password");
    expect(response.body.users[0]).not.toHaveProperty("secretQuestion");
    expect(response.body.users[0]).not.toHaveProperty("secretAnswer");
  });
});
