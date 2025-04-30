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

describe("User GetByNameAndEmail Endpoint Integration Tests", () => {
  // Sample users for testing
  const mockUsers = [
    { id: 1, name: "admin", role: "admin", email: "admin@example.com" },
    { id: 2, name: "user1", role: "user", email: "user1@example.com" },
    { id: 3, name: "user2", role: "user", email: "user2@example.com" },
  ];

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Default mock for getUsers
    db.getUsers.mockResolvedValue(mockUsers);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should find a user by name and email successfully", async () => {
    const searchData = {
      name: "user1",
      email: "user1@example.com",
    };

    const response = await request(app)
      .get(`/api/users/${searchData.name}&email`)
      .send({ data: searchData });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("role");
    expect(response.body).toHaveProperty("email");
    expect(response.body.id).toBe(2);
    expect(response.body.name).toBe(searchData.name);
    expect(response.body.email).toBe(searchData.email);
    expect(response.body.role).toBe("user");

    // Verify password is not returned
    expect(response.body).not.toHaveProperty("password");
  });

  it("should return 404 when user with name and email does not exist", async () => {
    const searchData = {
      name: "nonexistent",
      email: "nonexistent@example.com",
    };

    const response = await request(app)
      .get(`/api/users/${searchData.name}&email`)
      .send({ data: searchData });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("not found");
  });

  it("should handle missing name parameter", async () => {
    const searchData = {
      email: "user1@example.com",
    };

    const response = await request(app)
      .get(`/api/users/&email`)
      .send({ data: searchData });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("required");
  });

  it("should handle missing email parameter", async () => {
    const searchData = {
      name: "user1",
    };

    const response = await request(app)
      .get(`/api/users/${searchData.name}&email`)
      .send({ data: {} });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("required");
  });

  it("should handle invalid email format", async () => {
    const searchData = {
      name: "user1",
      email: "invalid-email",
    };

    const response = await request(app)
      .get(`/api/users/${searchData.name}&email`)
      .send({ data: searchData });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("invalid");
  });

  it("should handle database errors gracefully", async () => {
    // Mock getUsers to throw error
    db.getUsers.mockRejectedValue(new Error("Database error"));

    const searchData = {
      name: "user1",
      email: "user1@example.com",
    };

    const response = await request(app)
      .get(`/api/users/${searchData.name}&email`)
      .send({ data: searchData });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("error");
  });
});
