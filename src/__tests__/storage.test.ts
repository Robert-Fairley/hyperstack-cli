import { describe, it, expect, vi, beforeEach } from "vitest";
import * as storageCommands from "../commands/storage.js";
import * as apiModule from "../api.js";

describe("Object storage commands", () => {
  const originalEnv = process.env.HYPERSTACK_API_KEY;

  beforeEach(() => {
    delete process.env.HYPERSTACK_API_KEY;
    process.env.HYPERSTACK_API_KEY = "test-key";
    vi.restoreAllMocks();
  });

  afterAll(() => {
    if (originalEnv !== undefined) {
      process.env.HYPERSTACK_API_KEY = originalEnv;
    } else {
      delete process.env.HYPERSTACK_API_KEY;
    }
  });

  describe("listBuckets", () => {
    it("displays buckets from API response", async () => {
      const mockData = [
        { id: "b1", name: "my-bucket", region: "us-1", created_at: "2024-01-01" },
      ];
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "table").mockImplementation(() => {});
      await storageCommands.listBuckets();

      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe("createBucket", () => {
    it("calls API with correct body", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({ id: "b-new" });
      await storageCommands.createBucket("new-bucket", "us-1");

      expect(apiSpy).toHaveBeenCalledWith(
        "/object-storage/buckets",
        "POST",
        expect.objectContaining({ name: "new-bucket", region: "us-1" })
      );
    });
  });

  describe("deleteBucket", () => {
    it("calls API with DELETE method", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({});
      await storageCommands.deleteBucket("my-bucket");

      expect(apiSpy).toHaveBeenCalledWith("/object-storage/buckets/my-bucket", "DELETE");
    });
  });

  describe("listAccessKeys", () => {
    it("displays access keys from API response", async () => {
      const mockData = [
        { id: "k1", access_key_id: "AKIA...", bucket_name: "my-bucket", status: "active" },
      ];
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "table").mockImplementation(() => {});
      await storageCommands.listAccessKeys();

      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe("createAccessKey", () => {
    it("calls API with correct body", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({ id: "k-new" });
      await storageCommands.createAccessKey({ bucketName: "my-bucket" });

      expect(apiSpy).toHaveBeenCalledWith(
        "/object-storage/access-keys",
        "POST",
        expect.objectContaining({ bucket_name: "my-bucket" })
      );
    });
  });
});
