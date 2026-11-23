/**
 * HyperStack CLI utility functions.
 * SSH helpers, VM data extraction, and formatting utilities.
 */

import type { VmInstance, VmListResponse, StockRegion } from "./types.js";

export function getSshKey(): string | undefined {
  return process.env.HYPERSTACK_SSH_KEY?.trim() || undefined;
}

/**
 * Build SSH arguments array with optional key file.
 */
export function buildSshArgs(extraArgs: string[], target: string): string[] {
  const sshKey = getSshKey();
  return [...(sshKey ? ["-i", sshKey] : []), ...extraArgs, target];
}

/**
 * Extract VM list from various API response shapes.
 */
export function extractVmList(data: unknown): VmInstance[] {
  if (Array.isArray(data)) return data as VmInstance[];
  const obj = data as VmListResponse | undefined;
  if (!obj) return [];
  return obj.instances || obj.virtual_machines || ([] as VmInstance[]);
}

/**
 * Extract public IP from a VM object.
 */
export function extractVmIp(vm: VmInstance): string | undefined {
  return vm.floating_ip ?? vm.public_ip ?? vm.ip_address;
}

/**
 * Format GPU configuration entries into a display string.
 */
export function formatConfigs(configs: Record<string, number> | null | undefined): string {
  if (!configs || typeof configs !== "object") return "-";
  const parts = Object.entries(configs)
    .filter(([, count]) => Number(count) > 0)
    .map(([size, count]) => `${size}:${count}`);
  return parts.length > 0 ? parts.join(", ") : "-";
}
