/**
 * HyperStack CLI utility functions.
 * SSH helpers, VM data extraction, and formatting utilities.
 *
 * @see https://docs.hyperstack.cloud/docs/network/ssh/ — SSH access guide
 */

import type { VmInstance, VmListResponse, StockRegion } from "./types.js";

/**
 * Retrieve the SSH key path from environment variables.
 * @returns The SSH key path, or `undefined` if not set.
 * @see https://docs.hyperstack.cloud/docs/api-reference/keypair/ — Keypair API reference
 */
export function getSshKey(): string | undefined {
  return process.env.HYPERSTACK_SSH_KEY?.trim() || undefined;
}

/**
 * Build an SSH arguments array with optional key file and extra flags.
 * @param extraArgs — Additional SSH flags (e.g., `["-N", "-L", "..."]`).
 * @param target — The SSH target string (e.g., `"ubuntu@192.0.2.1"`).
 * @returns Complete arguments array for `child_process.spawn`.
 * @see https://docs.hyperstack.cloud/docs/network/ssh/ — SSH access guide
 */
export function buildSshArgs(extraArgs: string[], target: string): string[] {
  const sshKey = getSshKey();
  return [...(sshKey ? ["-i", sshKey] : []), ...extraArgs, target];
}

/**
 * Extract a list of VM instances from various API response shapes.
 * Handles direct arrays, `{ instances }`, `{ virtual_machines }`, and `{ data }` wrappers.
 * @param data — Raw API response (parsed JSON).
 * @returns Array of {@link VmInstance} objects.
 * @see https://docs.hyperstack.cloud/docs/api-reference/virtual-machine/ — Virtual Machine API reference
 */
export function extractVmList(data: unknown): VmInstance[] {
  if (Array.isArray(data)) return data as VmInstance[];
  const obj = data as VmListResponse | undefined;
  if (!obj) return [];
  return obj.instances || obj.virtual_machines || ([] as VmInstance[]);
}

/**
 * Extract the public IP address from a VM object.
 * Checks `floating_ip`, `public_ip`, and `ip_address` in order.
 * @param vm — A VM instance object.
 * @returns The first available public IP, or `undefined`.
 * @see https://docs.hyperstack.cloud/docs/network/public-ip/ — Public IP addresses
 */
export function extractVmIp(vm: VmInstance): string | undefined {
  return vm.floating_ip ?? vm.public_ip ?? vm.ip_address;
}

/**
 * Format GPU configuration entries into a display string.
 * Filters out zero-count configurations and joins remaining as `size:count`.
 * @param configs — GPU size-to-count mapping, or null/undefined.
 * @returns Formatted string like `"8GB:2, 16GB:1"`, or `"-"` if empty.
 * @see https://docs.hyperstack.cloud/docs/hardware/flavors/ — Flavors documentation
 */
export function formatConfigs(configs: Record<string, number> | null | undefined): string {
  if (!configs || typeof configs !== "object") return "-";
  const parts = Object.entries(configs)
    .filter(([, count]) => Number(count) > 0)
    .map(([size, count]) => `${size}:${count}`);
  return parts.length > 0 ? parts.join(", ") : "-";
}
