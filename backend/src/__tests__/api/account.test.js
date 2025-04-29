import request from "supertest";
import express from "express";
import accountRoutes from "../../routes/account.js";
import accountController from "../../controllers/account.js";

// Mock dependencies
jest.mock("../../controllers/account.js");
jest.mock("../../middleware/auth.js", () => ({
  isAuthenticated: jest.fn((req, res, next) => {
    req.session = { userId: "1", role: "user" };
    next();
  }),
  default: {
    isAuthenticated: jest.fn((req, res, next) => {
      req.session = { userId: "1", role: "user" };
      next();
    }),
  },
}));

// Setup test app
const app = express();
app.use(express.json());
app.use("/api/account", accountRoutes);

describe("Account Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock controller functions
    accountController.getAccount.mockImplementation((req, res) => {
      res.status(200).json({
        message: "Account retrieved successfully",
        account: {
          id: req.session.userId,
          name: "Test User",
          email: "test@example.com",
          role: req.session.role,
        },
      });
    });

    accountController.updateAccount.mockImplementation((req, res) => {
      res.status(200).json({
        message: "Account updated successfully",
        account: {
          id: req.session.userId,
          ...req.body,
          role: req.session.role,
        },
      });
    });

    accountController.deleteAccount.mockImplementation((req, res) => {
      res.status(200).json({ message: "Account deleted successfully" });
    });
  });

  describe("GET /api/account", () => {
    test("should get account of the logged in user", async () => {
      const response = await request(app).get("/api/account");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Account retrieved successfully"
      );
      expect(response.body).toHaveProperty("account");
      expect(response.body.account).toHaveProperty("id", "1");
      expect(accountController.getAccount).toHaveBeenCalled();
    });
  });

  describe("PUT /api/account", () => {
    test("should update account of the logged in user", async () => {
      const accountData = {
        name: "Updated Name",
        email: "updated@example.com",
      };

      const response = await request(app).put("/api/account").send(accountData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Account updated successfully"
      );
      expect(response.body).toHaveProperty("account");
      expect(response.body.account).toHaveProperty("id", "1");
      expect(response.body.account).toHaveProperty("name", "Updated Name");
      expect(accountController.updateAccount).toHaveBeenCalled();
    });
  });

  describe("DELETE /api/account", () => {
    test("should delete account of the logged in user", async () => {
      const response = await request(app).delete("/api/account");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Account deleted successfully"
      );
      expect(accountController.deleteAccount).toHaveBeenCalled();
    });
  });
});
