import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock child_process.spawn before any module loads
vi.mock("node:child_process", () => ({
  spawn: vi.fn(),
}));

// Mock vm.getVmIp so ssh commands don't hit the real API
vi.mock("../commands/vm.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../commands/vm.js")>();
  return {
    ...actual,
    getVmIp: vi.fn(),
  };
});

import * as sshCommands from "../commands/ssh.js";
import * as vmModule from "../commands/vm.js";
import { spawn } from "node:child_process";

describe("SSH commands", () => {
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

  describe("sshToVm", () => {
    it("spawns SSH with correct arguments", async () => {
      const mockIp = "10.20.30.40";
      (vmModule.getVmIp as any).mockResolvedValue(mockIp);

      const mockProcess = { on: vi.fn() };
      (spawn as any).mockReturnValue(mockProcess);

      await sshCommands.sshToVm("vm-123", "ubuntu");

      expect(spawn).toHaveBeenCalledWith(
        "ssh",
        expect.arrayContaining(["ubuntu@10.20.30.40"]),
        expect.objectContaining({ stdio: "inherit" })
      );
    });
  });

  describe("tunnelVm", () => {
    it("spawns SSH with tunnel arguments using 127.0.0.1", async () => {
      const mockIp = "10.20.30.40";
      (vmModule.getVmIp as any).mockResolvedValue(mockIp);

      const mockProcess = { on: vi.fn() };
      (spawn as any).mockReturnValue(mockProcess);

      await sshCommands.tunnelVm("vm-123", "8000", "8000");

      expect(spawn).toHaveBeenCalledWith(
        "ssh",
        expect.arrayContaining([
          "-N",
          "-L 127.0.0.1:8000:127.0.0.1:8000",
          "ubuntu@10.20.30.40",
        ]),
        expect.objectContaining({ stdio: "inherit" })
      );
    });

    it("uses default port 8000 when not specified", async () => {
      const mockIp = "10.20.30.40";
      (vmModule.getVmIp as any).mockResolvedValue(mockIp);

      const mockProcess = { on: vi.fn() };
      (spawn as any).mockReturnValue(mockProcess);

      await sshCommands.tunnelVm("vm-123");

      expect(spawn).toHaveBeenCalledWith(
        "ssh",
        expect.arrayContaining(["-L 127.0.0.1:8000:127.0.0.1:8000"]),
        expect.any(Object)
      );
    });

    it("uses custom ports when specified", async () => {
      const mockIp = "10.20.30.40";
      (vmModule.getVmIp as any).mockResolvedValue(mockIp);

      const mockProcess = { on: vi.fn() };
      (spawn as any).mockReturnValue(mockProcess);

      await sshCommands.tunnelVm("vm-123", "3000", "5000");

      expect(spawn).toHaveBeenCalledWith(
        "ssh",
        expect.arrayContaining(["-L 127.0.0.1:3000:127.0.0.1:5000"]),
        expect.any(Object)
      );
    });

    it("uses custom user when specified", async () => {
      const mockIp = "10.20.30.40";
      (vmModule.getVmIp as any).mockResolvedValue(mockIp);

      const mockProcess = { on: vi.fn() };
      (spawn as any).mockReturnValue(mockProcess);

      await sshCommands.tunnelVm("vm-123", "8000", "8000", "root");

      expect(spawn).toHaveBeenCalledWith(
        "ssh",
        expect.arrayContaining(["root@10.20.30.40"]),
        expect.any(Object)
      );
    });
  });
});
