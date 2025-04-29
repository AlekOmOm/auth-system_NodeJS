import hashing from "../utils/hashing.js";

// Test suite for hashing utility
describe("Hashing Utility", () => {
  // Test hash function
  test("should hash a password correctly", () => {
    const password = "testPassword123";
    const hashedPassword = hashing.hash(password);

    // Hashed password should be a string and different from original
    expect(typeof hashedPassword).toBe("string");
    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword.length).toBeGreaterThan(0);
  });

  // Test compare function with matching passwords
  test("should correctly verify matching passwords", () => {
    const password = "testPassword123";
    const hashedPassword = hashing.hash(password);

    const result = hashing.compare(password, hashedPassword);
    expect(result).toBe(true);
  });

  // Test compare function with non-matching passwords
  test("should correctly reject non-matching passwords", () => {
    const password = "testPassword123";
    const wrongPassword = "wrongPassword123";
    const hashedPassword = hashing.hash(password);

    const result = hashing.compare(wrongPassword, hashedPassword);
    expect(result).toBe(false);
  });

  // Test handling of undefined/null values
  test("should handle undefined or null password gracefully", () => {
    const password = "testPassword123";
    const hashedPassword = hashing.hash(password);

    // These should throw errors or return false, not crash the application
    expect(() => hashing.compare(undefined, hashedPassword)).toThrow();
    expect(() => hashing.compare(null, hashedPassword)).toThrow();
    expect(() => hashing.compare(password, undefined)).toThrow();
    expect(() => hashing.compare(password, null)).toThrow();
  });
});
