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
    
    // Import and run CLI (cli.ts is a script, not a module with exports)
    await import("../cli.js");
    
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

  // ── New command routing tests ───────────────────────

  it("routes 'volumes' command", async () => {
    process.argv = ["node", "hs", "volumes"];
    
    const mockData = [];
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

  it("routes 'snapshots' command", async () => {
    process.argv = ["node", "hs", "snapshots"];
    
    const mockData = [];
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

  it("routes 'flavors' command", async () => {
    process.argv = ["node", "hs", "flavors"];
    
    const mockData = [];
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

  it("routes 'images' command", async () => {
    process.argv = ["node", "hs", "images"];
    
    const mockData = [];
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

  it("routes 'regions' command", async () => {
    process.argv = ["node", "hs", "regions"];
    
    const mockData = [];
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

  it("routes 'billing credits' command", async () => {
    process.argv = ["node", "hs", "billing", "credits"];
    
    const mockData = { balance: 100, currency: "USD" };
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

  it("routes 'billing usage' command", async () => {
    process.argv = ["node", "hs", "billing", "usage"];
    
    const mockData = [];
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

  it("routes 'billing status' command", async () => {
    process.argv = ["node", "hs", "billing", "status"];
    
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ status: "active" })),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("routes 'dashboard' command", async () => {
    process.argv = ["node", "hs", "dashboard"];
    
    const mockData = { active_vms: 2, hourly_cost: 5.0 };
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

  it("routes 'firewalls' command", async () => {
    process.argv = ["node", "hs", "firewalls"];
    
    const mockData = [
      { name: "default", id: "fw-1", vm_id: "i-abc", rules: [{ id: "r1", port: "443", protocol: "tcp", source: "0.0.0.0/0" }] },
    ];
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData)),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const tableSpy = vi.spyOn(console, "table").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(tableSpy).toHaveBeenCalled();
    tableSpy.mockRestore();
  });

  it("routes 'buckets' command", async () => {
    process.argv = ["node", "hs", "buckets"];
    
    const mockData = [];
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

  it("routes 'keys' command", async () => {
    process.argv = ["node", "hs", "keys"];
    
    const mockData = [];
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

  it("routes 'k8s list' command", async () => {
    process.argv = ["node", "hs", "k8s", "list"];
    
    const mockData = [];
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

  it("routes 'vm create' command", async () => {
    process.argv = ["node", "hs", "vm", "create", "--flavor", "h100-1", "--name", "test-vm"];
    
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ id: "vm-new" })),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("routes 'volume create' command", async () => {
    process.argv = ["node", "hs", "volume", "create", "--size", "100"];
    
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ id: "vol-new" })),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("routes 'snapshot create' command", async () => {
    process.argv = ["node", "hs", "snapshot", "create", "vm-123"];
    
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ id: "snap-new" })),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("routes 'k8s create' command", async () => {
    process.argv = ["node", "hs", "k8s", "create", "--nodes", "3"];
    
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ id: "k8s-new" })),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("routes 'bucket create' command", async () => {
    process.argv = ["node", "hs", "bucket", "create", "my-bucket"];
    
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ id: "b-new" })),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("routes 'key create' command", async () => {
    process.argv = ["node", "hs", "key", "create"];
    
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ id: "k-new" })),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("routes 'firewall add' command", async () => {
    process.argv = ["node", "hs", "firewall", "add", "vm-123", "--port", "8080"];
    
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ id: "rule-new" })),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("shows error for missing 'vm' subcommand", async () => {
    process.argv = ["node", "hs", "vm"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for missing 'volume' subcommand", async () => {
    process.argv = ["node", "hs", "volume"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for missing 'snapshot' subcommand", async () => {
    process.argv = ["node", "hs", "snapshot"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for missing 'billing' subcommand", async () => {
    process.argv = ["node", "hs", "billing"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for missing 'k8s' subcommand", async () => {
    process.argv = ["node", "hs", "k8s"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for missing 'bucket' subcommand", async () => {
    process.argv = ["node", "hs", "bucket"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for missing 'key' subcommand", async () => {
    process.argv = ["node", "hs", "key"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for missing 'firewall' subcommand", async () => {
    process.argv = ["node", "hs", "firewall"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for missing 'volume create' --size", async () => {
    process.argv = ["node", "hs", "volume", "create"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for missing 'snapshot create' VM ID", async () => {
    process.argv = ["node", "hs", "snapshot", "create"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for missing 'volume attach' args", async () => {
    process.argv = ["node", "hs", "volume", "attach"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for missing 'firewall delete' args", async () => {
    process.argv = ["node", "hs", "firewall", "delete"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for unknown 'vm' subcommand", async () => {
    process.argv = ["node", "hs", "vm", "bogus"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for unknown 'volume' subcommand", async () => {
    process.argv = ["node", "hs", "volume", "bogus"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for unknown 'snapshot' subcommand", async () => {
    process.argv = ["node", "hs", "snapshot", "bogus"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for unknown 'billing' subcommand", async () => {
    process.argv = ["node", "hs", "billing", "bogus"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for unknown 'k8s' subcommand", async () => {
    process.argv = ["node", "hs", "k8s", "bogus"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for unknown 'bucket' subcommand", async () => {
    process.argv = ["node", "hs", "bucket", "bogus"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for unknown 'key' subcommand", async () => {
    process.argv = ["node", "hs", "key", "bogus"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it("shows error for unknown 'firewall' subcommand", async () => {
    process.argv = ["node", "hs", "firewall", "bogus"];
    
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    
    await import("../cli.js");
    
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  // ── --json global option tests ──────────────────────

  it("routes 'status' command with --json flag", async () => {
    process.argv = ["node", "hs", "status", "--json"];
    
    const mockData = { instances: [] };
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData)),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    // Should output JSON, not a table
    expect(consoleSpy).toHaveBeenCalledWith(
      JSON.stringify(mockData.instances, null, 2)
    );
    consoleSpy.mockRestore();
  });

  it("routes 'status' command with -j short flag", async () => {
    process.argv = ["node", "hs", "status", "-j"];
    
    const mockData = { instances: [] };
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData)),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalledWith(
      JSON.stringify(mockData.instances, null, 2)
    );
    consoleSpy.mockRestore();
  });

  it("routes 'hibernate' command with --json flag", async () => {
    process.argv = ["node", "hs", "hibernate", "vm-123", "--json"];
    
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ status: "hibernating" })),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalledWith(
      JSON.stringify({ status: "hibernating" }, null, 2)
    );
    consoleSpy.mockRestore();
  });

  it("routes 'restore' command with --json flag", async () => {
    process.argv = ["node", "hs", "restore", "vm-123", "--json"];
    
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ status: "restoring" })),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalledWith(
      JSON.stringify({ status: "restoring" }, null, 2)
    );
    consoleSpy.mockRestore();
  });

  // ── --public-ip flag tests ──────────────────────────

  it("routes 'restore' command with --public-ip flag", async () => {
    process.argv = ["node", "hs", "restore", "vm-123", "--public-ip"];
    
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ status: "restoring" })),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    // Verify the API call includes public_ip=true query parameter
    const callUrl = (fetchSpy.mock.calls[0] as [URL])[0].toString();
    expect(callUrl).toContain("public_ip=true");
    consoleSpy.mockRestore();
  });

  it("routes 'restore' command with --public-ip and --json flags", async () => {
    process.argv = ["node", "hs", "restore", "vm-123", "--public-ip", "--json"];
    
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ status: "restoring" })),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    // Verify both the query parameter and JSON output
    const callUrl = (fetchSpy.mock.calls[0] as [URL])[0].toString();
    expect(callUrl).toContain("public_ip=true");
    expect(consoleSpy).toHaveBeenCalledWith(
      JSON.stringify({ status: "restoring" }, null, 2)
    );
    consoleSpy.mockRestore();
  });

  it("routes 'hibernate' command with --retain-ip and --json flags", async () => {
    process.argv = ["node", "hs", "hibernate", "vm-123", "--retain-ip", "--json"];
    
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ status: "hibernating" })),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    const callUrl = (fetchSpy.mock.calls[0] as [URL])[0].toString();
    expect(callUrl).toContain("retain_ip=true");
    expect(consoleSpy).toHaveBeenCalledWith(
      JSON.stringify({ status: "hibernating" }, null, 2)
    );
    consoleSpy.mockRestore();
  });

  it("routes 'stock' command with --json flag", async () => {
    process.argv = ["node", "hs", "stock", "--json"];
    
    const mockData = [];
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData)),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await import("../cli.js");
    
    expect(consoleSpy).toHaveBeenCalledWith(
      JSON.stringify(mockData, null, 2)
    );
    consoleSpy.mockRestore();
  });
});
