import { describe, test, expect } from "@jest/globals";
import hashing from "../utils/hashing.js";

describe("Authentication Utilities", () => {
  // Test password hashing
  test("should hash passwords securely", () => {
    const password = "secure-password123";
    const hashedPassword = hashing.hash(password);

    // Hash should be different from the original password
    expect(hashedPassword).not.toBe(password);

    // Hash should be a string with significant length (bcrypt hashes are long)
    expect(typeof hashedPassword).toBe("string");
    expect(hashedPassword.length).toBeGreaterThan(20);
  });

  // Test password verification with correct password
  test("should verify correct passwords", () => {
    const password = "secure-password123";
    const hashedPassword = hashing.hash(password);

    const isMatch = hashing.compare(password, hashedPassword);
    expect(isMatch).toBe(true);
  });

  // Test password verification with incorrect password
  test("should reject incorrect passwords", () => {
    const password = "secure-password123";
    const wrongPassword = "wrong-password123";
    const hashedPassword = hashing.hash(password);

    const isMatch = hashing.compare(wrongPassword, hashedPassword);
    expect(isMatch).toBe(false);
  });

  // Test handling of undefined passwords
  test("should handle undefined passwords gracefully", () => {
    const password = "secure-password123";
    const hashedPassword = hashing.hash(password);

    // Testing against undefined should throw or return false, not crash
    expect(() => hashing.compare(undefined, hashedPassword)).toThrow();
  });
});
