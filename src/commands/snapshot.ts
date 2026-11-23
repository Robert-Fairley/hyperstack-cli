/**
 * Snapshot management commands.
 * Create, list, restore, and delete VM disk snapshots.
 */

import { apiRequest } from "../api.js";
import type { Snapshot } from "../types.js";

interface SnapshotRow {
  id: string;
  name: string;
  size_gb: string;
  status: string;
  vm_id: string;
}

/**
 * List all snapshots in a table format.
 */
export async function listSnapshots(): Promise<void> {
  const data = await apiRequest("/core/snapshots");
  const snapshots = extractSnapshotList(data);

  const rows: SnapshotRow[] = snapshots.map((s) => ({
    id: s.id ?? "-",
    name: s.name ?? "-",
    size_gb: String(s.size ?? 0),
    status: s.status || "unknown",
    vm_id: String(s.vm_id ?? "-"),
  }));

  console.table(rows);
}

/**
 * Create a snapshot from a VM.
 */
export async function createSnapshot(vmId: string, name?: string): Promise<void> {
  const body: Record<string, unknown> = {};
  if (name) body.name = name;

  const result = await apiRequest(`/core/virtual-machines/${vmId}/snapshots`, "POST", body);
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Restore a VM from a snapshot.
 */
export async function restoreFromSnapshot(snapshotId: string): Promise<void> {
  const result = await apiRequest(`/core/snapshots/${snapshotId}/restore`, "POST");
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Delete a snapshot.
 */
export async function deleteSnapshot(snapshotId: string): Promise<void> {
  const result = await apiRequest(`/core/snapshots/${snapshotId}`, "DELETE");
  console.log(JSON.stringify(result, null, 2));
}

function extractSnapshotList(data: unknown): Snapshot[] {
  if (Array.isArray(data)) return data as Snapshot[];
  const obj = data as Record<string, unknown> | undefined;
  if (!obj) return [];
  return (
    (obj.data as Snapshot[]) ||
    (obj.snapshots as Snapshot[]) ||
    []
  );
}
