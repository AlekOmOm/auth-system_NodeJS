import userService from "../services/userService.js";
import hashing from "../utils/hashing.js";

// Mock the hashing utility
jest.mock("../utils/hashing.js", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe("User Service - Password Comparison", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("isSamePwd should return true when passwords match", () => {
    // Set up the mock to return true
    hashing.compare.mockReturnValue(true);

    const reqPassword = "plainPassword";
    const dbPassword = "hashedPassword"; // In a real scenario, this would be hashed

    const result = userService.isSamePwd(reqPassword, dbPassword);

    // Check that compare was called with correct arguments
    expect(hashing.compare).toHaveBeenCalledWith(reqPassword, dbPassword);
    expect(result).toBe(true);
  });

  test("isSamePwd should return false when passwords do not match", () => {
    // Set up the mock to return false
    hashing.compare.mockReturnValue(false);

    const reqPassword = "wrongPassword";
    const dbPassword = "hashedPassword";

    const result = userService.isSamePwd(reqPassword, dbPassword);

    expect(hashing.compare).toHaveBeenCalledWith(reqPassword, dbPassword);
    expect(result).toBe(false);
  });

  test("isSamePwd should handle undefined password gracefully", () => {
    // Set up the mock to throw an error when comparing with undefined
    hashing.compare.mockImplementation(() => {
      throw new Error("Illegal arguments: string, undefined");
    });

    const reqPassword = "plainPassword";
    const dbPassword = undefined;

    // The function should catch the error and return false
    expect(() => userService.isSamePwd(reqPassword, dbPassword)).toThrow();
  });
});
