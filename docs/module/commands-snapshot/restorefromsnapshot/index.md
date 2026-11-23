---
title: restoreFromSnapshot
kind: function
longname: module:commands/snapshot.restoreFromSnapshot
description: Restore a VM from a snapshot.
---

# restoreFromSnapshot

<Signature code="restoreFromSnapshot(snapshotId: string): Promise<void>" />

<SourceLink href="/hyperstack-cli/source/commands/snapshot-ts/#L61" label="snapshot.ts:61" />

**Modifiers:** `async`

Restore a VM from a snapshot.

**Parameters**

- `snapshotId` (string) — — The snapshot ID to restore from.

**Returns**

- `Promise<void>`

* **See:**
  - \- https\://docs.hyperstack.cloud/docs/virtual-machines/snapshots/ — Snapshots guide
    &#x20;\- https\://docs.hyperstack.cloud/docs/api-reference/snapshots/#restore-snapshot — Restore snapshot endpoint
