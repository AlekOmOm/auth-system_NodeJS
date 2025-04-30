import { vi, describe, it, expect, beforeEach } from "vitest";
import { fetchGet, fetchPost } from "../src/util/fetch";

// Mock global fetch
global.fetch = vi.fn();

describe("Fetch Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console.error to avoid test pollution
    console.error = vi.fn();
  });

  describe("fetchGet", () => {
    it("should handle successful JSON responses", async () => {
      const mockData = { data: "test" };
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue("application/json"),
        },
        json: vi.fn().mockResolvedValue(mockData),
      };
      global.fetch.mockResolvedValue(mockResponse);

      const result = await fetchGet("http://test.com/api");
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith("http://test.com/api", {
        credentials: "include",
      });
    });

    it("should throw error for non-OK responses", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        text: vi.fn().mockResolvedValue("Not Found"),
      };
      global.fetch.mockResolvedValue(mockResponse);

      await expect(fetchGet("http://test.com/api")).rejects.toThrow(
        "API error (404): Not Found"
      );
    });

    it("should throw error for non-JSON responses", async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue("text/html"),
        },
        text: vi.fn().mockResolvedValue("<!doctype html><html></html>"),
      };
      global.fetch.mockResolvedValue(mockResponse);

      await expect(fetchGet("http://test.com/api")).rejects.toThrow(
        "API returned non-JSON response"
      );
    });

    it("should handle network errors", async () => {
      global.fetch.mockRejectedValue(new Error("Network failure"));

      await expect(fetchGet("http://test.com/api")).rejects.toThrow(
        "Network failure"
      );
    });
  });

  describe("fetchPost", () => {
    it("should handle successful JSON responses", async () => {
      const mockData = { success: true };
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue("application/json"),
        },
        json: vi.fn().mockResolvedValue(mockData),
      };
      global.fetch.mockResolvedValue(mockResponse);

      const result = await fetchPost("http://test.com/api", { test: "data" });
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith("http://test.com/api", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: "data" }),
      });
    });

    it("should throw error for non-OK responses", async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        text: vi.fn().mockResolvedValue("Bad Request"),
      };
      global.fetch.mockResolvedValue(mockResponse);

      await expect(
        fetchPost("http://test.com/api", { test: "data" })
      ).rejects.toThrow("API error (400): Bad Request");
    });

    it("should throw error for non-JSON responses", async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue("text/html"),
        },
        text: vi.fn().mockResolvedValue("<!doctype html><html></html>"),
      };
      global.fetch.mockResolvedValue(mockResponse);

      await expect(
        fetchPost("http://test.com/api", { test: "data" })
      ).rejects.toThrow("API returned non-JSON response");
    });
  });
});
