import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import {
  isAuthenticated,
  isAdmin,
  isNotAdmin,
  hasRole,
} from "../../middleware/auth.js";

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    // Mock request, response, and next function
    req = {
      session: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("isAuthenticated", () => {
    test("should call next when session and userId exist", () => {
      // Arrange
      req.session.userId = "123";

      // Act
      isAuthenticated(req, res, next);

      // Assert
      // This test will fail because there's a bug in the isAuthenticated middleware
      // It calls next() regardless of the checkSession result
      // TODO: Fix isAuthenticated to properly await checkSession result and not call next() if authentication fails
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test("should return 401 when session does not exist", () => {
      // Arrange
      req.session = null;

      // Act
      isAuthenticated(req, res, next);

      // Assert
      // This test will fail because isAuthenticated calls next() regardless
      // TODO: Fix isAuthenticated to not call next() when authentication fails
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Authentication required",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 401 when userId does not exist", () => {
      // Arrange
      req.session = { userId: null };

      // Act
      isAuthenticated(req, res, next);

      // Assert
      // This test will fail due to the bug in isAuthenticated
      // TODO: Fix isAuthenticated to not call next() when authentication fails
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Authentication required",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("isAdmin", () => {
    test("should call next when user is admin", () => {
      // Arrange
      req.session.role = "admin";

      // Act
      isAdmin(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test("should return 401 when user is not admin", () => {
      // Arrange
      req.session.role = "user";

      // Act
      isAdmin(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Insufficient permissions",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("isNotAdmin", () => {
    test("should call next when user is not admin", () => {
      // Arrange
      req.session.role = "user";

      // Act
      isNotAdmin(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test("should return 401 when user is admin", () => {
      // Arrange
      req.session.role = "admin";

      // Act
      isNotAdmin(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Only for current user. Data protected",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("hasRole", () => {
    test("should call next when user has the required role", () => {
      // Arrange
      req.session.userId = "123";
      req.session.role = "editor";
      const middleware = hasRole("editor");

      // Act
      middleware(req, res, next);

      // Assert
      // This will fail due to isAuthenticated bug and how hasRole is implemented
      // TODO: Fix hasRole to handle isAuthenticated properly
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test("should call next when user is admin", () => {
      // Arrange
      req.session.userId = "123";
      req.session.role = "admin";
      const middleware = hasRole("editor");

      // Act
      middleware(req, res, next);

      // Assert
      // This will fail due to isAuthenticated bug
      // TODO: Fix hasRole to handle isAuthenticated properly
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test("should return 401 when user does not have the required role", () => {
      // Arrange
      req.session.userId = "123";
      req.session.role = "user";
      const middleware = hasRole("editor");

      // Act
      middleware(req, res, next);

      // Assert
      // This will fail due to isAuthenticated bug and how hasRole is implemented
      // TODO: Fix hasRole to handle isAuthenticated properly
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Insufficient permissions",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
