import request from "supertest";
import app from "../server.js";
import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import db from "../src/db/repository.js";

// Mock the database operations
vi.mock("../src/db/repository.js", () => ({
  default: {
    updateUser: vi.fn(),
    getUser: vi.fn(),
  },
}));

describe("User Update Endpoint Integration Tests", () => {
  // Create an agent to maintain cookies between requests
  const agent = request.agent(app);

  // Sample users for testing
  const existingUser = {
    id: 1,
    name: "oldname",
    role: "user",
    email: "old@example.com",
    password: "hashedOldPassword",
  };

  const adminUser = {
    id: 2,
    name: "admin",
    role: "admin",
    email: "admin@example.com",
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Default mock for getUser
    db.getUser.mockImplementation((id) => {
      if (id === 1) return Promise.resolve(existingUser);
      if (id === 2) return Promise.resolve(adminUser);
      return Promise.resolve(null);
    });

    // Default mock for updateUser
    db.updateUser.mockResolvedValue({
      id: existingUser.id,
      name: "newname",
      role: "user",
      email: "new@example.com",
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should update a user successfully", async () => {
    // Setup: login as admin
    await agent.post("/api/auth/login").send({
      email: adminUser.email,
      password: "password123",
    });

    const updateData = {
      name: "newname",
      role: "user",
      email: "new@example.com",
      password: "newPassword123",
    };

    const response = await agent.put("/api/users/1").send(updateData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("role");
    expect(response.body).toHaveProperty("email");
    expect(response.body.id).toBe(existingUser.id);
    expect(response.body.name).toBe(updateData.name);
    expect(response.body.email).toBe(updateData.email);

    // Verify updateUser was called with correct parameters
    expect(db.updateUser).toHaveBeenCalledWith([
      updateData.name,
      updateData.role,
      updateData.email,
      expect.any(String), // Hashed password
      existingUser.id.toString(),
    ]);

    // Verify password is not returned
    expect(response.body).not.toHaveProperty("password");
  });

  it("should require authentication to update a user", async () => {
    const updateData = {
      name: "newname",
      email: "new@example.com",
    };

    const response = await request(app).put("/api/users/1").send(updateData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Unauthorized");
  });

  it("should only allow admins to update other users", async () => {
    // Setup: login as regular user
    const regularUserAgent = request.agent(app);
    await regularUserAgent.post("/api/auth/login").send({
      email: existingUser.email,
      password: "password123",
    });

    const updateData = {
      name: "newname",
      email: "new@example.com",
    };

    // Try to update admin user
    const response = await regularUserAgent
      .put("/api/users/2")
      .send(updateData);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Forbidden");
  });

  it("should return 404 when updating non-existent user", async () => {
    // Setup: login as admin
    await agent.post("/api/auth/login").send({
      email: adminUser.email,
      password: "password123",
    });

    const updateData = {
      name: "newname",
      email: "new@example.com",
    };

    const response = await agent.put("/api/users/999").send(updateData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("not found");
  });

  it("should validate email format", async () => {
    // Setup: login as admin
    await agent.post("/api/auth/login").send({
      email: adminUser.email,
      password: "password123",
    });

    const updateData = {
      name: "newname",
      email: "invalid-email",
    };

    const response = await agent.put("/api/users/1").send(updateData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("invalid");
  });

  it("should handle database errors gracefully", async () => {
    // Setup: login as admin
    await agent.post("/api/auth/login").send({
      email: adminUser.email,
      password: "password123",
    });

    // Mock updateUser to throw error
    db.updateUser.mockRejectedValue(new Error("Database error"));

    const updateData = {
      name: "newname",
      email: "new@example.com",
    };

    const response = await agent.put("/api/users/1").send(updateData);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("error");
  });
});
