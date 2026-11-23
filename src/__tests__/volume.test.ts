import { describe, it, expect, vi, beforeEach } from "vitest";
import * as volumeCommands from "../commands/volume.js";
import * as apiModule from "../api.js";

describe("Volume commands", () => {
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

  describe("listVolumes", () => {
    it("extracts and displays volumes from API response", async () => {
      const mockData = [
        { id: "vol-1", name: "data-disk", size: 100, status: "available", vm_id: null },
        { id: "vol-2", name: "backup", size: 50, status: "in-use", vm_id: "vm-123" },
      ];
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "table").mockImplementation(() => {});
      await volumeCommands.listVolumes();

      expect(logSpy).toHaveBeenCalled();
    });

    it("handles nested data wrapper", async () => {
      const mockData = { data: [{ id: "vol-1", name: "disk", size: 10, status: "available" }] };
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "table").mockImplementation(() => {});
      await volumeCommands.listVolumes();

      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe("createVolume", () => {
    it("calls API with correct body", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({ id: "vol-new" });
      await volumeCommands.createVolume({ sizeGb: 100, name: "test-vol" });

      expect(apiSpy).toHaveBeenCalledWith(
        "/core/volumes",
        "POST",
        expect.objectContaining({ size_gb: 100, name: "test-vol" })
      );
    });
  });

  describe("attachVolume", () => {
    it("calls API with correct body", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({ status: "attached" });
      await volumeCommands.attachVolume("vol-123", "vm-456");

      expect(apiSpy).toHaveBeenCalledWith(
        "/core/volumes/vol-123/attach",
        "POST",
        expect.objectContaining({ virtual_machine_id: "vm-456" })
      );
    });
  });

  describe("detachVolume", () => {
    it("calls API with DELETE method", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({ status: "detached" });
      await volumeCommands.detachVolume("vol-123");

      expect(apiSpy).toHaveBeenCalledWith("/core/volumes/vol-123/detach", "POST");
    });
  });

  describe("deleteVolume", () => {
    it("calls API with DELETE method", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({});
      await volumeCommands.deleteVolume("vol-123");

      expect(apiSpy).toHaveBeenCalledWith("/core/volumes/vol-123", "DELETE");
    });
  });
});
