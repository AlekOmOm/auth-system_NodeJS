import request from "supertest";
import app from "../server.js";
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import db from "../src/db/repository.js";

// Mock the database operations
vi.mock("../src/db/repository.js", () => ({
  default: {
    createUser: vi.fn(),
    getUsers: vi.fn(),
    getUserByEmail: vi.fn(),
  },
}));

describe("Auth Register Integration Tests", () => {
  const testUser = {
    name: "testuser",
    email: "test@example.com",
    password: "Password123!",
  };

  beforeAll(() => {
    // Reset mocks
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should register a new user successfully", async () => {
    // Mock DB to return a new user
    db.createUser.mockResolvedValue({
      id: 1,
      name: testUser.name,
      email: testUser.email,
      role: "user",
    });

    // Mock getUserByEmail to return null (no existing user)
    db.getUserByEmail.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user.name).toBe(testUser.name);
    expect(response.body.user.email).toBe(testUser.email);
    expect(response.body.user).not.toHaveProperty("password");
  });

  it("should reject registration with missing fields", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ name: "testuser" }); // Missing email and password

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should reject registration with invalid email format", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "testuser",
      email: "invalid-email",
      password: "Password123!",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should reject registration with weak password", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "testuser",
      email: "test@example.com",
      password: "weak", // Too short, no uppercase, no number
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should reject registration with existing email", async () => {
    // Mock getUserByEmail to return an existing user
    db.getUserByEmail.mockResolvedValue({
      id: 2,
      name: "existinguser",
      email: testUser.email,
    });

    const response = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("exists");
  });
});
