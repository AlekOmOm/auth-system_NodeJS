import request from "supertest";
import app from "../server.js";
import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import db from "../src/db/repository.js";

// Mock the database operations
vi.mock("../src/db/repository.js", () => ({
  default: {
    getUser: vi.fn(),
  },
}));

describe("User GetById Endpoint Integration Tests", () => {
  // Sample user for testing
  const mockUser = {
    id: 1,
    name: "testuser",
    role: "user",
    email: "test@example.com",
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should return a user by ID successfully", async () => {
    // Mock getUser to return the sample user
    db.getUser.mockResolvedValue(mockUser);

    const response = await request(app).get("/api/users/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("role");
    expect(response.body).toHaveProperty("email");
    expect(response.body.id).toBe(mockUser.id);
    expect(response.body.name).toBe(mockUser.name);
    expect(response.body.email).toBe(mockUser.email);

    // Verify password is not returned
    expect(response.body).not.toHaveProperty("password");
  });

  it("should return 404 when user does not exist", async () => {
    // Mock getUser to return null (user not found)
    db.getUser.mockResolvedValue(null);

    const response = await request(app).get("/api/users/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("not found");
  });

  it("should handle invalid ID format", async () => {
    const response = await request(app).get("/api/users/invalid-id");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("invalid");
  });

  it("should handle database errors gracefully", async () => {
    // Mock getUser to throw error
    db.getUser.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/api/users/1");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("error");
  });

  it("should not expose sensitive user data", async () => {
    // Mock getUser to return user with sensitive data
    const userWithSensitiveData = {
      ...mockUser,
      password: "hashedPassword123",
      secretQuestion: "What is your pet name?",
      secretAnswer: "Fluffy",
    };

    db.getUser.mockResolvedValue(userWithSensitiveData);

    const response = await request(app).get("/api/users/1");

    // Verify sensitive data is not returned
    expect(response.body).not.toHaveProperty("password");
    expect(response.body).not.toHaveProperty("secretQuestion");
    expect(response.body).not.toHaveProperty("secretAnswer");
  });
});
