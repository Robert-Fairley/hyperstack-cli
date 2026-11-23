import { describe, it, expect, vi, beforeEach } from "vitest";
import * as vmCommands from "../commands/vm.js";

describe("vm commands", () => {
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

  describe("listVms", () => {
    it("calls the correct API endpoint", async () => {
      const mockData = {
        instances: [
          { id: "1", name: "vm1", status: "running", region: { name: "us-east" }, floating_ip: "1.2.3.4" },
          { id: "2", name: "vm2", vm_state: "stopped", region: "us-west", public_ip: "5.6.7.8" },
        ],
      };
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockData)),
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      await vmCommands.listVms();

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://infrahub-api.nexgencloud.com/v1/core/virtual-machines",
        expect.objectContaining({
          headers: expect.any(Object),
        })
      );
    });

    it("handles empty VM list", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify([])),
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      await vmCommands.listVms();

      expect(fetchSpy).toHaveBeenCalled();
    });
  });

  describe("hibernateVm", () => {
    it("calls hibernate endpoint without retain_ip", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ status: "hibernating" })),
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      await vmCommands.hibernateVm("vm-123");

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://infrahub-api.nexgencloud.com/v1/core/virtual-machines/vm-123/hibernate",
        expect.any(Object)
      );
    });

    it("calls hibernate endpoint with retain_ip when specified", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ status: "hibernating" })),
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      await vmCommands.hibernateVm("vm-123", true);

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://infrahub-api.nexgencloud.com/v1/core/virtual-machines/vm-123/hibernate?retain_ip=true",
        expect.any(Object)
      );
    });

    it("throws on API error", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: false,
        status: 404,
        text: () => Promise.resolve(JSON.stringify({ error: "not found" })),
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      await expect(vmCommands.hibernateVm("nonexistent")).rejects.toThrow("404");
    });
  });

  describe("restoreVm", () => {
    it("calls restore endpoint", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ status: "restoring" })),
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      await vmCommands.restoreVm("vm-123");

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://infrahub-api.nexgencloud.com/v1/core/virtual-machines/vm-123/hibernate-restore",
        expect.any(Object)
      );
    });
  });

  describe("getVmIp", () => {
    it("looks up by numeric ID first", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ instance: { floating_ip: "10.20.30.40" } })),
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      const ip = await vmCommands.getVmIp("123");
      expect(ip).toBe("10.20.30.40");
      // Should only call fetch once (ID lookup)
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it("looks up by name when ID is not numeric", async () => {
      const listData = {
        instances: [
          { id: "456", name: "my-vm", floating_ip: "99.99.99.99" },
        ],
      };
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(listData)),
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      const ip = await vmCommands.getVmIp("my-vm");
      expect(ip).toBe("99.99.99.99");
      // Should call fetch twice (list + no ID lookup)
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it("throws when VM not found by name", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ instances: [] })),
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      await expect(vmCommands.getVmIp("nonexistent")).rejects.toThrow('No VM found matching "nonexistent"');
    });

    it("throws when VM has no IP", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ instance: { id: 1, name: "no-ip-vm" } })),
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      await expect(vmCommands.getVmIp("1")).rejects.toThrow("No IP for VM 1");
    });
  });
});
