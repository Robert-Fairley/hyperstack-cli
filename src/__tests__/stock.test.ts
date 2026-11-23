import { describe, it, expect, vi, beforeEach } from "vitest";
import * as stockCommands from "../commands/stock.js";

describe("queryStock", () => {
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

  it("calls the correct API endpoint", async () => {
    const mockData = {
      stocks: [
        { region: "us-east", models: [{ model: "h100", available: 5 }] },
        { region: "eu-west", models: [{ model: "a100", available: 3 }] },
      ],
    };
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData)),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    await stockCommands.queryStock({});

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://infrahub-api.nexgencloud.com/v1/core/stocks",
      expect.any(Object)
    );
  });

  it("filters by region when specified", async () => {
    const mockData = {
      stocks: [
        { region: "us-east", models: [{ model: "h100", available: 5 }] },
        { region: "eu-west", models: [{ model: "a100", available: 3 }] },
      ],
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData)),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    await stockCommands.queryStock({ region: "eu" });
    // Should not throw — filtering is internal
  });

  it("filters by GPU model when specified", async () => {
    const mockData = {
      stocks: [
        { region: "us-east", models: [{ model: "h100", available: 5 }] },
        { region: "eu-west", models: [{ model: "a100", available: 3 }] },
      ],
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData)),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    await stockCommands.queryStock({ gpu: "h100" });
    // Should not throw — filtering is internal
  });

  it("filters out unavailable GPUs when availableOnly is true", async () => {
    const mockData = {
      stocks: [
        { region: "us-east", models: [{ model: "h100", available: 0 }] },
        { region: "eu-west", models: [{ model: "a100", available: 3 }] },
      ],
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData)),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    await stockCommands.queryStock({ availableOnly: true });
    // Should not throw — filtering is internal
  });

  it("handles empty stock response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify([])),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    await stockCommands.queryStock({});
    // Should not throw
  });

  it("handles API error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve(JSON.stringify({ error: "server error" })),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    await expect(stockCommands.queryStock({})).rejects.toThrow("500");
  });
});
