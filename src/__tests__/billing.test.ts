import { describe, it, expect, vi, beforeEach } from "vitest";
import * as billingCommands from "../commands/billing.js";
import * as apiModule from "../api.js";

describe("Billing commands", () => {
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

  describe("checkCredit", () => {
    it("displays credit balance from API response", async () => {
      const mockData = { balance: 150.75, currency: "USD" };
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "table").mockImplementation(() => {});
      await billingCommands.checkCredit();

      expect(logSpy).toHaveBeenCalledWith({ balance: "150.75", currency: "USD" });
    });

    it("handles missing balance gracefully", async () => {
      const mockData = {};
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "table").mockImplementation(() => {});
      await billingCommands.checkCredit();

      expect(logSpy).toHaveBeenCalledWith({ balance: "0", currency: "USD" });
    });
  });

  describe("billingStatus", () => {
    it("calls alive endpoint and logs result", async () => {
      const apiSpy = vi.spyOn(apiModule, "apiRequest").mockResolvedValue({ status: "active" });
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await billingCommands.billingStatus();

      expect(apiSpy).toHaveBeenCalledWith("/billing/alive");
      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe("listUsage", () => {
    it("displays usage history from API response", async () => {
      const mockData = [
        { resource_type: "vm", resource_id: "vm-123", amount: 5.50, currency: "USD", started_at: "2024-01-01" },
      ];
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "table").mockImplementation(() => {});
      await billingCommands.listUsage();

      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe("getDashboard", () => {
    it("displays dashboard summary from API response", async () => {
      const mockData = { active_vms: 3, hourly_cost: 12.50, total_volumes: 5, currency: "USD" };
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "table").mockImplementation(() => {});
      await billingCommands.getDashboard();

      expect(logSpy).toHaveBeenCalledWith(
        expect.objectContaining({ active_vms: 3, hourly_cost: 12.50 })
      );
    });

    it("handles missing dashboard data gracefully", async () => {
      const mockData = {};
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue(mockData);

      const logSpy = vi.spyOn(console, "table").mockImplementation(() => {});
      await billingCommands.getDashboard();

      expect(logSpy).toHaveBeenCalledWith(
        expect.objectContaining({ active_vms: 0, hourly_cost: 0 })
      );
    });
  });
});
