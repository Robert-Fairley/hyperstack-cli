---
title: createSnapshot
kind: function
longname: module:commands/snapshot.createSnapshot
description: Create a snapshot from a VM's disk.
---

# createSnapshot

<Signature code="createSnapshot(vmId: string, name?: string): Promise<void>" />

<SourceLink href="/hyperstack-cli/source/commands/snapshot-ts/#L47" label="snapshot.ts:47" />

**Modifiers:** `async`

Create a snapshot from a VM's disk.

**Parameters**

- `vmId` (string) — — The source VM ID or name.
- `name` (string, optional) — — Optional display name for the snapshot.

**Returns**

- `Promise<void>`

* **See:**
  - \- https\://docs.hyperstack.cloud/docs/virtual-machines/snapshots/ — Snapshots guide
    &#x20;\- https\://docs.hyperstack.cloud/docs/api-reference/snapshots/#create-snapshot — Create snapshot endpoint
