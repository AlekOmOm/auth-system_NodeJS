import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isAuthenticated,
  isAdmin,
  isNotAdmin,
} from "../src/middleware/auth.js";
import db from "../src/db/repository.js";

// Mock the database operations
vi.mock("../src/db/repository.js", () => ({
  default: {
    getUser: vi.fn(),
  },
}));

describe("Auth Middleware Tests", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock request object
    req = {
      session: {},
    };

    // Mock response object with json method that returns the response for chaining
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    // Mock next function
    next = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("isAuthenticated Middleware", () => {
    it("should call next() if user is authenticated", () => {
      req.session.userId = 1;

      isAuthenticated(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 401 if user is not authenticated", () => {
      req.session = null;

      isAuthenticated(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Authentication required",
      });
    });

    it("should return 401 if session exists but userId is missing", () => {
      // Session exists but no userId
      req.session = {};

      isAuthenticated(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Authentication required",
      });
    });
  });

  describe("isAdmin Middleware", () => {
    it("should call next() if user has admin role", () => {
      req.session.userId = 1;
      req.session.role = "admin";

      isAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 401 if user does not have admin role", () => {
      req.session.userId = 1;
      req.session.role = "user";

      isAdmin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Insufficient permissions",
      });
    });
  });

  describe("isNotAdmin Middleware", () => {
    it("should call next() if user is not an admin", () => {
      req.session.userId = 1;
      req.session.role = "user";

      isNotAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 401 if user is an admin", () => {
      req.session.userId = 1;
      req.session.role = "admin";

      isNotAdmin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Only for current user. Data protected",
      });
    });
  });
});
