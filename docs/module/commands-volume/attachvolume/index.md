---
title: attachVolume
kind: function
longname: module:commands/volume.attachVolume
description: Attach a volume to a VM.
---

# attachVolume

<Signature code="attachVolume(volumeId: string, vmId: string): Promise<void>" />

<SourceLink href="/source/commands/volume-ts/#L74" label="volume.ts:74" />

**Modifiers:** `async`

Attach a volume to a VM.

**Parameters**

- `volumeId` (string) — — The volume ID to attach.
- `vmId` (string) — — The target VM ID or name.

**Returns**

- `Promise<void>`

* **See:**
  - \- https\://docs.hyperstack.cloud/docs/storage/volumes/mounting-volume/ — Mounting volumes
    &#x20;\- https\://docs.hyperstack.cloud/docs/api-reference/volume-attachment/#attach-volume — Attach volume endpoint
