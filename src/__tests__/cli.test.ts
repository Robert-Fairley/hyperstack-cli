import { describe, it, expect, vi, beforeEach } from "vitest";

describe("CLI command routing", () => {
  const originalArgv = process.argv;
  const originalEnv = process.env.HYPERSTACK_API_KEY;

  beforeEach(() => {
    // Reset modules between tests
    vi.resetModules();
    // Set up test environment
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

  it("shows help when no command is given", async () => {
    // Reset argv to have no command
    process.argv = ["node", "hs"];
    
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    // Import and run CLI
    const { default: cli } = await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("routes 'status' command to listVms", async () => {
    process.argv = ["node", "hs", "status"];
    
    const mockData = { instances: [] };
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData)),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "table").mockImplementation(() => {});
    
    // Import and run CLI
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("routes 'list' command to listVms", async () => {
    process.argv = ["node", "hs", "list"];
    
    const mockData = { instances: [] };
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData)),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "table").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("routes 'hibernate' command with retain-ip flag", async () => {
    process.argv = ["node", "hs", "hibernate", "vm-123", "--retain-ip"];
    
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ status: "hibernating" })),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("routes 'restore' command", async () => {
    process.argv = ["node", "hs", "restore", "vm-123"];
    
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ status: "restoring" })),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("routes 'stock' command with filters", async () => {
    process.argv = ["node", "hs", "stock", "-g", "h100", "-a"];
    
    const mockData = { stocks: [] };
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData)),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "table").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("shows error for unknown command", async () => {
    process.argv = ["node", "hs", "unknown-cmd"];
    
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    consoleErrorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it("requires API key", async () => {
    delete process.env.HYPERSTACK_API_KEY;
    process.argv = ["node", "hs", "status"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });
});
