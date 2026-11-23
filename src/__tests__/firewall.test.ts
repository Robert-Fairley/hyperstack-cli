import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fwCommands from "../commands/firewall.js";
import * as apiModule from "../api.js";

describe("Firewall commands", () => {
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

  describe("listFirewalls", () => {
    it("displays firewalls for a specific VM", async () => {
      const mockData = [
        {
          id: "fw-1",
          name: "default",
          vm_id: "vm-123",
          rules: [
            { id: "rule-1", port: 22, protocol: "tcp", source: "0.0.0.0/0" },
            { id: "rule-2", port: 8000, protocol: "tcp", source: "0.0.0.0/0" },
          ],
        },
      ];
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await fwCommands.listFirewalls("vm-123");

      expect(apiSpy).toHaveBeenCalledWith("/core/virtual-machines/vm-123/firewalls");
    });

    it("handles VM with no rules", async () => {
      const mockData = [{ id: "fw-1", name: "empty", vm_id: "vm-123", rules: [] }];
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await fwCommands.listFirewalls("vm-123");

      expect(logSpy).toHaveBeenCalledWith("  No rules");
    });
  });

  describe("addFirewallRule", () => {
    it("calls API with correct body", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({ id: "rule-new" });
      await fwCommands.addFirewallRule("vm-123", { port: 8080, protocol: "tcp", source: "10.0.0.0/8" });

      expect(apiSpy).toHaveBeenCalledWith(
        "/core/virtual-machines/vm-123/firewalls",
        "POST",
        expect.objectContaining({ port: 8080, protocol: "tcp", source: "10.0.0.0/8" })
      );
    });
  });

  describe("deleteFirewallRule", () => {
    it("calls API with DELETE method", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({});
      await fwCommands.deleteFirewallRule("vm-123", "rule-456");

      expect(apiSpy).toHaveBeenCalledWith("/core/virtual-machines/vm-123/firewalls/rule-456", "DELETE");
    });
  });
});
