import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getApiKey, BASE_URL } from "../api.js";

describe("BASE_URL", () => {
  it("has the correct base URL", () => {
    expect(BASE_URL).toBe("https://infrahub-api.nexgencloud.com/v1");
  });
});

describe("getApiKey", () => {
  const originalEnv = process.env.HYPERSTACK_API_KEY;

  beforeEach(() => {
    delete process.env.HYPERSTACK_API_KEY;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.HYPERSTACK_API_KEY = originalEnv;
    } else {
      delete process.env.HYPERSTACK_API_KEY;
    }
  });

  it("returns the API key when set", () => {
    process.env.HYPERSTACK_API_KEY = "test-key-123";
    expect(getApiKey()).toBe("test-key-123");
  });

  it("exits with error when key is not set", () => {
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    getApiKey();
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });
});
