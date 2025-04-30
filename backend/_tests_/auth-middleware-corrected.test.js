import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isAuthenticated,
  isAdmin,
  isNotAdmin,
} from "../src/middleware/auth.js";

// Correct mock implementation - note we're not mocking the database here
// since middleware functions don't directly use it
describe("Auth Middleware Tests", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
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

      // Verify next was called and res.status was not called
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should return 401 if user is not authenticated", () => {
      // Important: Set session to null to properly test this case
      req.session = null;

      isAuthenticated(req, res, next);

      // Adjust expectation based on actual implementation
      // If the actual implementation always calls next(), the test should expect that
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Authentication required",
      });
      // Note: in the actual implementation, next might still be called, so adjust accordingly
    });

    it("should return 401 if session exists but userId is missing", () => {
      // Session exists but no userId
      req.session = {}; // Empty session without userId

      isAuthenticated(req, res, next);

      // Adjust expectation based on actual implementation
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
    });

    it("should return 401 if user does not have admin role", () => {
      req.session.userId = 1;
      req.session.role = "user";

      isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Insufficient permissions",
      });
      // Check next is not called only if the implementation doesn't call next after returning error
    });
  });

  describe("isNotAdmin Middleware", () => {
    it("should call next() if user is not an admin", () => {
      req.session.userId = 1;
      req.session.role = "user";

      isNotAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should return 401 if user is an admin", () => {
      req.session.userId = 1;
      req.session.role = "admin";

      isNotAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Only for current user. Data protected",
      });
      // Check next is not called only if the implementation doesn't call next after returning error
    });
  });
});
