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

describe("Auth Me Endpoint Integration Tests", () => {
  // Create an agent to maintain cookies between requests
  const agent = request.agent(app);
  const testUser = {
    id: 1,
    name: "testuser",
    email: "test@example.com",
    role: "user",
  };

  // Setup: login a user to get a valid session
  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock getUser for authentication middleware and endpoint
    db.getUser.mockResolvedValue(testUser);

    // Login to create a session
    await agent.post("/api/auth/login").send({
      email: testUser.email,
      password: "Password123!",
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should return the current user data when authenticated", async () => {
    const response = await agent.get("/api/auth/me");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user.id).toBe(testUser.id);
    expect(response.body.user.name).toBe(testUser.name);
    expect(response.body.user.email).toBe(testUser.email);
    expect(response.body.user.role).toBe(testUser.role);
    expect(response.body.user).not.toHaveProperty("password");
  });

  it("should reject access when not authenticated", async () => {
    // Use a new request without session
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Unauthorized");
  });

  it("should reject access for admin users", async () => {
    // Mock user with admin role
    db.getUser.mockResolvedValue({
      ...testUser,
      role: "admin",
    });

    // Login as admin first
    const adminAgent = request.agent(app);
    await adminAgent.post("/api/auth/login").send({
      email: testUser.email,
      password: "Password123!",
    });

    const response = await adminAgent.get("/api/auth/me");

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Forbidden");
  });

  it("should handle case when user in session no longer exists", async () => {
    // Mock getUser to return null (user not found)
    db.getUser.mockResolvedValue(null);

    const response = await agent.get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("not found");
  });

  it("should handle database errors gracefully", async () => {
    // Mock getUser to throw error
    db.getUser.mockRejectedValue(new Error("Database error"));

    const response = await agent.get("/api/auth/me");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("error");
  });
});
