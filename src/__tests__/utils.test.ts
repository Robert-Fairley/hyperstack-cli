import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getSshKey, buildSshArgs, extractVmList, extractVmIp, formatConfigs } from "../utils.js";

describe("getSshKey", () => {
  const originalEnv = process.env.HYPERSTACK_SSH_KEY;

  beforeEach(() => {
    delete process.env.HYPERSTACK_SSH_KEY;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.HYPERSTACK_SSH_KEY = originalEnv;
    } else {
      delete process.env.HYPERSTACK_SSH_KEY;
    }
  });

  it("returns undefined when env var is not set", () => {
    expect(getSshKey()).toBeUndefined();
  });

  it("returns trimmed value when env var is set", () => {
    process.env.HYPERSTACK_SSH_KEY = "  /path/to/key  ";
    expect(getSshKey()).toBe("/path/to/key");
  });

  it("returns undefined for empty string", () => {
    process.env.HYPERSTACK_SSH_KEY = "";
    expect(getSshKey()).toBeUndefined();
  });
});

describe("buildSshArgs", () => {
  const originalEnv = process.env.HYPERSTACK_SSH_KEY;

  beforeEach(() => {
    delete process.env.HYPERSTACK_SSH_KEY;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.HYPERSTACK_SSH_KEY = originalEnv;
    } else {
      delete process.env.HYPERSTACK_SSH_KEY;
    }
  });

  it("includes SSH key when set", () => {
    process.env.HYPERSTACK_SSH_KEY = "/path/to/key";
    const args = buildSshArgs(["-N"], "ubuntu@1.2.3.4");
    expect(args).toContain("-i");
    expect(args).toContain("/path/to/key");
    expect(args).toContain("-N");
    expect(args).toContain("ubuntu@1.2.3.4");
  });

  it("omits SSH key when not set", () => {
    expect(buildSshArgs(["-N"], "ubuntu@1.2.3.4")).toEqual(["-N", "ubuntu@1.2.3.4"]);
  });

  it("appends target as last argument", () => {
    const args = buildSshArgs([], "user@host");
    expect(args[args.length - 1]).toBe("user@host");
  });
});

describe("extractVmList", () => {
  it("returns array when data is already an array", () => {
    const vms = [{ id: 1, name: "vm1" }];
    expect(extractVmList(vms)).toEqual(vms);
  });

  it("extracts from instances key", () => {
    const data = { instances: [{ id: 1 }] };
    expect(extractVmList(data as any)).toEqual([{ id: 1 }]);
  });

  it("extracts from virtual_machines key", () => {
    const data = { virtual_machines: [{ id: 2 }] };
    expect(extractVmList(data as any)).toEqual([{ id: 2 }]);
  });

  it("returns empty array for null/undefined", () => {
    expect(extractVmList(null as any)).toEqual([]);
    expect(extractVmList(undefined as any)).toEqual([]);
  });
});

describe("extractVmIp", () => {
  it("returns floating_ip when available", () => {
    const vm = { floating_ip: "1.2.3.4" };
    expect(extractVmIp(vm as any)).toBe("1.2.3.4");
  });

  it("returns public_ip when floating_ip is not set", () => {
    const vm = { public_ip: "5.6.7.8" };
    expect(extractVmIp(vm as any)).toBe("5.6.7.8");
  });

  it("returns ip_address when others are not set", () => {
    const vm = { ip_address: "9.10.11.12" };
    expect(extractVmIp(vm as any)).toBe("9.10.11.12");
  });

  it("returns undefined when no IP fields are set", () => {
    const vm = { id: 1, name: "test" };
    expect(extractVmIp(vm as any)).toBeUndefined();
  });
});

describe("formatConfigs", () => {
  it("returns '-' for null/undefined", () => {
    expect(formatConfigs(null)).toBe("-");
    expect(formatConfigs(undefined)).toBe("-");
  });

  it("returns '-' for empty object", () => {
    expect(formatConfigs({})).toBe("-");
  });

  it("formats config entries correctly", () => {
    const configs = { "8gb": 2, "16gb": 3 };
    expect(formatConfigs(configs)).toBe("8gb:2, 16gb:3");
  });

  it("filters out zero-count entries", () => {
    const configs = { "8gb": 0, "16gb": 1 };
    expect(formatConfigs(configs)).toBe("16gb:1");
  });
});
