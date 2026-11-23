import { describe, it, expect, vi, beforeEach } from "vitest";
import * as vmCreate from "../commands/vm-create.js";
import * as apiModule from "../api.js";

describe("VM provisioning commands", () => {
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

  describe("listFlavors", () => {
    it("extracts and displays flavors from API response", async () => {
      const mockData = [
        { id: "flavor-1", name: "h100-1", gpu_count: 1, vcpu_count: 8, ram_gb: 64 },
      ];
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "table").mockImplementation(() => {});
      await vmCreate.listFlavors();

      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe("listImages", () => {
    it("extracts and displays images from API response", async () => {
      const mockData = [
        { id: "img-1", name: "ubuntu-22", os_type: "linux" },
      ];
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "table").mockImplementation(() => {});
      await vmCreate.listImages();

      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe("listRegions", () => {
    it("extracts and displays regions from API response", async () => {
      const mockData = [
        { id: "us-1", name: "US-1", status: "active" },
        { id: "ca-1", name: "CANADA-1", status: "active" },
      ];
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "table").mockImplementation(() => {});
      await vmCreate.listRegions();

      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe("createVm", () => {
    it("calls API with correct body for minimal create", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({ id: "vm-new" });
      await vmCreate.createVm({ flavorId: "flavor-1" });

      expect(apiSpy).toHaveBeenCalledWith(
        "/core/virtual-machines",
        "POST",
        expect.objectContaining({ flavor_id: "flavor-1" })
      );
    });

    it("includes all options when provided", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({ id: "vm-new" });
      await vmCreate.createVm({
        flavorId: "flavor-1",
        imageId: "img-1",
        name: "test-vm",
        region: "us-1",
        keyName: "my-key",
        spot: true,
        count: 2,
      });

      expect(apiSpy).toHaveBeenCalledWith(
        "/core/virtual-machines",
        "POST",
        expect.objectContaining({
          flavor_id: "flavor-1",
          image_id: "img-1",
          name: "test-vm",
          region: "us-1",
          key_name: "my-key",
          spot: true,
          count: 2,
        })
      );
    });
  });
});
