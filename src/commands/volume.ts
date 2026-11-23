/**
 * Volume management commands.
 * List, create, attach, detach, and delete block storage volumes.
 */

import { apiRequest } from "../api.js";
import type { Volume } from "../types.js";

interface VolumeRow {
  id: string;
  name: string;
  size_gb: string;
  status: string;
  vm_id: string;
}

/**
 * List all volumes in a table format.
 */
export async function listVolumes(): Promise<void> {
  const data = await apiRequest("/core/volumes");
  const volumes = extractVolumeList(data);

  const rows: VolumeRow[] = volumes.map((v) => ({
    id: v.id ?? "-",
    name: v.name ?? "-",
    size_gb: String(v.size ?? 0),
    status: v.status || "unknown",
    vm_id: String(v.vm_id ?? "-"),
  }));

  console.table(rows);
}

/**
 * Create a new block storage volume.
 */
export async function createVolume(opts: {
  sizeGb: number;
  name?: string;
  region?: string;
}): Promise<void> {
  const body: Record<string, unknown> = {
    size_gb: opts.sizeGb,
  };

  if (opts.name) body.name = opts.name;
  if (opts.region) body.region = opts.region;

  const result = await apiRequest("/core/volumes", "POST", body);
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Attach a volume to a VM.
 */
export async function attachVolume(volumeId: string, vmId: string): Promise<void> {
  const result = await apiRequest(`/core/volumes/${volumeId}/attach`, "POST", {
    virtual_machine_id: vmId,
  });
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Detach a volume from its VM.
 */
export async function detachVolume(volumeId: string): Promise<void> {
  const result = await apiRequest(`/core/volumes/${volumeId}/detach`, "POST");
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Delete a volume.
 */
export async function deleteVolume(volumeId: string): Promise<void> {
  const result = await apiRequest(`/core/volumes/${volumeId}`, "DELETE");
  console.log(JSON.stringify(result, null, 2));
}

function extractVolumeList(data: unknown): Volume[] {
  if (Array.isArray(data)) return data as Volume[];
  const obj = data as Record<string, unknown> | undefined;
  if (!obj) return [];
  return (
    (obj.data as Volume[]) ||
    (obj.volumes as Volume[]) ||
    []
  );
}
