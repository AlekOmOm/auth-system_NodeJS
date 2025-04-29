import { loadEnv } from "vite";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from the parent directory
const env = loadEnv("test", path.resolve(__dirname, ".."), "");

// Export the API URL from the environment variables
export const API_URL = env.BACKEND_URL || "http://localhost:3001/api";

// Test user credentials
export const TEST_USER = {
  name: "testuser",
  email: "test@example.com",
  password: "TestPassword123!",
};

// Admin credentials
export const ADMIN_USER = {
  name: "admin",
  email: "admin@admin.com",
  password: "GoodPassword!123",
};
