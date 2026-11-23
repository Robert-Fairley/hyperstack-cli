/**
 * Virtual machine management commands.
 * List, hibernate, restore, and IP lookup operations.
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
 */
export async function listVms(): Promise<void> {
  const data = await apiRequest("/core/virtual-machines");
  const vms = extractVmList(data);

  const rows: VmInfo[] = vms.map((vm) => ({
    id: vm.id ?? "-",
    name: vm.name ?? "-",
    status: vm.status || vm.vm_state || "unknown",
    region: typeof vm.region === "string" ? vm.region : vm.region?.name || "-",
    ip: extractVmIp(vm) || "-",
  }));

  console.table(rows);
}

/**
 * Hibernate a VM (shut down with state preserved).
 */
export async function hibernateVm(vmId: string, retainIp = false): Promise<void> {
  const url = retainIp
    ? `/core/virtual-machines/${vmId}/hibernate?retain_ip=true`
    : `/core/virtual-machines/${vmId}/hibernate`;

  const result = await apiRequest(url);
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Restore a hibernated VM.
 */
export async function restoreVm(vmId: string): Promise<void> {
  const result = await apiRequest(`/core/virtual-machines/${vmId}/hibernate-restore`);
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Get the public IP address for a VM by ID or name.
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
