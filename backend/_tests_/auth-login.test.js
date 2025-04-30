import request from "supertest";
import app from "../server.js";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  vi,
  beforeEach,
} from "vitest";
import db from "../src/db/repository.js";
import hashing from "../src/utils/hashing.js";

// Mock the database and hashing operations
vi.mock("../src/db/repository.js", () => ({
  default: {
    getUsers: vi.fn(),
    getUserByEmail: vi.fn(),
  },
}));

vi.mock("../src/utils/hashing.js", () => ({
  default: {
    compare: vi.fn(),
  },
}));

describe("Auth Login Integration Tests", () => {
  const testUser = {
    id: 1,
    name: "testuser",
    email: "test@example.com",
    password: "hashedPassword123",
    role: "user",
  };

  const loginCredentials = {
    email: "test@example.com",
    password: "Password123!",
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should login a user successfully", async () => {
    // Mock getUserByEmail to return the test user
    db.getUserByEmail.mockResolvedValue(testUser);

    // Mock hashing.compare to return true (password matches)
    hashing.compare.mockReturnValue(true);

    const response = await request(app)
      .post("/api/auth/login")
      .send(loginCredentials);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user.id).toBe(testUser.id);
    expect(response.body.user.name).toBe(testUser.name);
    expect(response.body.user.email).toBe(testUser.email);
    expect(response.body.user).not.toHaveProperty("password");

    // Check if session was created
    expect(response.headers).toHaveProperty("set-cookie");
  });

  it("should reject login with non-existent email", async () => {
    // Mock getUserByEmail to return null (user not found)
    db.getUserByEmail.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/auth/login")
      .send(loginCredentials);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("not found");
  });

  it("should reject login with incorrect password", async () => {
    // Mock getUserByEmail to return the test user
    db.getUserByEmail.mockResolvedValue(testUser);

    // Mock hashing.compare to return false (password doesn't match)
    hashing.compare.mockReturnValue(false);

    const response = await request(app).post("/api/auth/login").send({
      email: loginCredentials.email,
      password: "WrongPassword123!",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("incorrect");
  });

  it("should reject login with missing email", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ password: loginCredentials.password });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should reject login with missing password", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: loginCredentials.email });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should reject login with invalid email format", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "invalid-email",
      password: loginCredentials.password,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
