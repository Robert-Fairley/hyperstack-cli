import { describe, it, expect, vi, beforeEach } from "vitest";
import * as snapshotCommands from "../commands/snapshot.js";
import * as apiModule from "../api.js";

describe("Snapshot commands", () => {
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

  describe("listSnapshots", () => {
    it("extracts and displays snapshots from API response", async () => {
      const mockData = [
        { id: "snap-1", name: "pre-train", size: 50, status: "available", vm_id: "vm-123" },
      ];
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "table").mockImplementation(() => {});
      await snapshotCommands.listSnapshots();

      expect(logSpy).toHaveBeenCalled();
    });

    it("handles nested data wrapper", async () => {
      const mockData = { data: [{ id: "snap-1", name: "backup", size: 20, status: "available" }] };
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "table").mockImplementation(() => {});
      await snapshotCommands.listSnapshots();

      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe("createSnapshot", () => {
    it("calls API with correct body", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({ id: "snap-new" });
      await snapshotCommands.createSnapshot("vm-123", "my-snapshot");

      expect(apiSpy).toHaveBeenCalledWith(
        "/core/virtual-machines/vm-123/snapshots",
        "POST",
        expect.objectContaining({ name: "my-snapshot" })
      );
    });
  });

  describe("restoreFromSnapshot", () => {
    it("calls API with correct path", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({ id: "vm-restored" });
      await snapshotCommands.restoreFromSnapshot("snap-123");

      expect(apiSpy).toHaveBeenCalledWith("/core/snapshots/snap-123/restore", "POST");
    });
  });

  describe("deleteSnapshot", () => {
    it("calls API with DELETE method", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({});
      await snapshotCommands.deleteSnapshot("snap-123");

      expect(apiSpy).toHaveBeenCalledWith("/core/snapshots/snap-123", "DELETE");
    });
  });
});
