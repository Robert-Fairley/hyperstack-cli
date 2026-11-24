/**
 * Virtual machine management commands.
 * List, hibernate, restore, and IP lookup operations.
 *
 * @see https://docs.hyperstack.cloud/docs/api-reference/virtual-machine/ — Virtual Machine API reference
 * @see https://docs.hyperstack.cloud/docs/virtual-machines/hibernation/ — Hibernation guide
 * @see https://docs.hyperstack.cloud/docs/network/public-ip/ — Public IP addresses
 */

import { apiRequest } from "../api.js";
import { extractVmList, extractVmIp } from "../utils.js";
import type { VmInstance, SingleVmResponse } from "../types.js";

interface VmInfo {
  id: string | number;
  name: string;
  status: string;
  region: string;
  ip: string;
}

/**
 * List all virtual machines in a table format.
 * Displays id, name, status, region, and public IP for each VM.
 * @param isJsonOutput — If true, output as JSON instead of table.
 * @see https://docs.hyperstack.cloud/docs/api-reference/virtual-machine/#get-virtual-machines — GET /core/virtual-machines
 */
export async function listVms(isJsonOutput?: boolean): Promise<void> {
  const data = await apiRequest("/core/virtual-machines");
  const vms = extractVmList(data);

  const rows: VmInfo[] = vms.map((vm) => ({
    id: vm.id ?? "-",
    name: vm.name ?? "-",
    status: vm.status || vm.vm_state || "unknown",
    region: typeof vm.region === "string" ? vm.region : vm.region?.name || "-",
    ip: extractVmIp(vm) || "-",
  }));

  if (isJsonOutput) {
    console.log(JSON.stringify(rows, null, 2));
  } else {
    console.table(rows);
  }
}

/**
 * Hibernate a VM (shut down with state preserved).
 * Stops billing while preserving disk and memory state for fast restore.
 * @param vmId — The VM ID or name to hibernate.
 * @param retainIp — If true, keep the public IP attached after hibernation. Defaults to `false`.
 * @param isJsonOutput — If true, output as JSON instead of default format.
 * @see https://docs.hyperstack.cloud/docs/virtual-machines/hibernation/ — Hibernation guide
 * @see https://docs.hyperstack.cloud/docs/api-reference/virtual-machine/#hibernate-vm — Hibernate VM endpoint
 */
export async function hibernateVm(vmId: string, retainIp = false, isJsonOutput?: boolean): Promise<void> {
  const url = retainIp
    ? `/core/virtual-machines/${vmId}/hibernate?retain_ip=true`
    : `/core/virtual-machines/${vmId}/hibernate`;

  const result = await apiRequest(url);
  if (isJsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log("VM hibernated successfully");
  }
}

/**
 * Restore a hibernated VM.
 * Brings a previously hibernated VM back online.
 * @param vmId — The VM ID or name to restore.
 * @param publicIp — If true, assign a public IP on restore. Defaults to `false`.
 * @param isJsonOutput — If true, output as JSON instead of default format.
 * @see https://docs.hyperstack.cloud/docs/virtual-machines/hibernation/ — Hibernation guide
 * @see https://docs.hyperstack.cloud/docs/api-reference/virtual-machine/#restore-hibernated-vm — Restore hibernated VM endpoint
 */
export async function restoreVm(vmId: string, publicIp = false, isJsonOutput?: boolean): Promise<void> {
  const params = new URLSearchParams();
  if (publicIp) params.set("public_ip", "true");
  const query = params.toString();
  const result = await apiRequest(`/core/virtual-machines/${vmId}/hibernate-restore${query ? "?" + query : ""}`);
  if (isJsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log("VM restored successfully");
  }
}

/**
 * Get the public IP address for a VM by ID or name.
 * Tries numeric ID lookup first, then falls back to name-based search across all VMs.
 * @param vmIdOrName — The VM ID (numeric) or name to look up.
 * @returns The public IP address string.
 * @throws Error if no VM is found or no IP is available.
 * @see https://docs.hyperstack.cloud/docs/network/public-ip/ — Public IP addresses
 * @see https://docs.hyperstack.cloud/docs/api-reference/virtual-machine/#get-virtual-machine — Get VM endpoint
 */
export async function getVmIp(vmIdOrName: string): Promise<string> {
  // Try numeric ID first
  if (/^\d+$/.test(vmIdOrName)) {
    const data = await apiRequest(`/core/virtual-machines/${vmIdOrName}`);
    const resp = data as SingleVmResponse | undefined;
    const vm: VmInstance | undefined = resp?.instance || resp?.virtual_machine || (resp?.data as VmInstance) || (data as VmInstance);
    const ip = extractVmIp(vm);
    if (!ip) throw new Error(`No IP for VM ${vmIdOrName}`);
    return ip;
  }

  // Fall back to name lookup
  const listData = await apiRequest("/core/virtual-machines");
  const vms = extractVmList(listData);

  const match = vms.find(
    (vm) =>
      String(vm.id ?? "") === vmIdOrName ||
      (vm.name && vm.name.toLowerCase() === vmIdOrName.toLowerCase())
  );

  if (!match) {
    throw new Error(`No VM found matching "${vmIdOrName}"`);
  }

  const ip = extractVmIp(match);
  if (!ip) {
    throw new Error(`No IP for VM "${vmIdOrName}" (id: ${match.id})`);
  }

  return ip;
}
