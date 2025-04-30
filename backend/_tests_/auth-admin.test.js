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

describe("Auth Admin Endpoint Integration Tests", () => {
  // Create agents to maintain cookies between requests
  const adminAgent = request.agent(app);
  const userAgent = request.agent(app);

  const adminUser = {
    id: 1,
    name: "admin",
    email: "admin@example.com",
    role: "admin",
  };

  const regularUser = {
    id: 2,
    name: "user",
    email: "user@example.com",
    role: "user",
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should return the current admin user data when authenticated as admin", async () => {
    // Mock getUser to return admin user
    db.getUser.mockResolvedValue(adminUser);

    // Login as admin
    await adminAgent.post("/api/auth/login").send({
      email: adminUser.email,
      password: "Password123!",
    });

    const response = await adminAgent.get("/api/auth/admin");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user.id).toBe(adminUser.id);
    expect(response.body.user.name).toBe(adminUser.name);
    expect(response.body.user.email).toBe(adminUser.email);
    expect(response.body.user.role).toBe("admin");
    expect(response.body.user).not.toHaveProperty("password");
  });

  it("should reject access when not authenticated", async () => {
    // Use a new request without session
    const response = await request(app).get("/api/auth/admin");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Unauthorized");
  });

  it("should reject access for regular users", async () => {
    // Mock getUser to return regular user
    db.getUser.mockResolvedValue(regularUser);

    // Login as regular user
    await userAgent.post("/api/auth/login").send({
      email: regularUser.email,
      password: "Password123!",
    });

    const response = await userAgent.get("/api/auth/admin");

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Forbidden");
  });

  it("should handle case when user in session no longer exists", async () => {
    // First login as admin
    db.getUser.mockResolvedValue(adminUser);
    await adminAgent.post("/api/auth/login").send({
      email: adminUser.email,
      password: "Password123!",
    });

    // Then mock getUser to return null (user deleted)
    db.getUser.mockResolvedValue(null);

    const response = await adminAgent.get("/api/auth/admin");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("not found");
  });

  it("should handle database errors gracefully", async () => {
    // First login as admin
    db.getUser.mockResolvedValue(adminUser);
    await adminAgent.post("/api/auth/login").send({
      email: adminUser.email,
      password: "Password123!",
    });

    // Then mock getUser to throw error
    db.getUser.mockRejectedValue(new Error("Database error"));

    const response = await adminAgent.get("/api/auth/admin");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("error");
  });
});
