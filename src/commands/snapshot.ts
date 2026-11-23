/**
 * Snapshot management commands.
 * Create, list, restore, and delete VM disk snapshots.
 *
 * @see https://docs.hyperstack.cloud/docs/api-reference/snapshots/ — Snapshots API reference
 * @see https://docs.hyperstack.cloud/docs/virtual-machines/snapshots/ — Snapshots guide
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
 * List all disk snapshots in a table format.
 * Displays id, name, size, status, and source VM for each snapshot.
 * @see https://docs.hyperstack.cloud/docs/api-reference/snapshots/#get-snapshots — GET /core/snapshots
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
 * Create a snapshot from a VM's disk.
 * @param vmId — The source VM ID or name.
 * @param name — Optional display name for the snapshot.
 * @see https://docs.hyperstack.cloud/docs/virtual-machines/snapshots/ — Snapshots guide
 * @see https://docs.hyperstack.cloud/docs/api-reference/snapshots/#create-snapshot — Create snapshot endpoint
 */
export async function createSnapshot(vmId: string, name?: string): Promise<void> {
  const body: Record<string, unknown> = {};
  if (name) body.name = name;

  const result = await apiRequest(`/core/virtual-machines/${vmId}/snapshots`, "POST", body);
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Restore a VM from a snapshot.
 * @param snapshotId — The snapshot ID to restore from.
 * @see https://docs.hyperstack.cloud/docs/virtual-machines/snapshots/ — Snapshots guide
 * @see https://docs.hyperstack.cloud/docs/api-reference/snapshots/#restore-snapshot — Restore snapshot endpoint
 */
export async function restoreFromSnapshot(snapshotId: string): Promise<void> {
  const result = await apiRequest(`/core/snapshots/${snapshotId}/restore`, "POST");
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Delete a snapshot.
 * @param snapshotId — The snapshot ID to delete.
 * @see https://docs.hyperstack.cloud/docs/api-reference/snapshots/#delete-snapshot — DELETE /core/snapshots/{id}
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
