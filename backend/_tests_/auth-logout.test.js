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

describe("Auth Logout Integration Tests", () => {
  // Create an agent to maintain cookies between requests
  const agent = request.agent(app);
  let authCookie;

  // Setup: login a user to get a valid session
  beforeEach(async () => {
    // Mock getUser for the isAuthenticated middleware
    db.getUser.mockResolvedValue({
      id: 1,
      name: "testuser",
      email: "test@example.com",
      role: "user",
    });

    // Create test session
    const loginResponse = await agent.post("/api/auth/login").send({
      email: "test@example.com",
      password: "Password123!",
    });

    // Store the auth cookie for later use in direct request tests
    authCookie = loginResponse.headers["set-cookie"];
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should logout a user successfully using agent", async () => {
    const response = await agent.post("/api/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("success");

    // Verify session was destroyed by trying to access protected route
    const protectedResponse = await agent.get("/api/auth/me");

    expect(protectedResponse.status).toBe(401);
  });

  it("should logout a user successfully using cookie", async () => {
    const response = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("success");
  });

  it("should fail to logout if not authenticated", async () => {
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Unauthorized");
  });

  it("should handle server errors during logout gracefully", async () => {
    // Mock a server error during logout
    const originalDestroy = (req) => {
      if (req && req.session && req.session.destroy) {
        return req.session.destroy;
      }
      return null;
    };

    // Temporarily override session.destroy to throw an error
    app.request.session = {
      destroy: (callback) => callback(new Error("Server error")),
    };

    const response = await agent.post("/api/auth/logout");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("error");

    // Restore original session functionality
    app.request.session = { destroy: originalDestroy };
  });
});
