---
title: deleteVolume
kind: function
longname: module:commands/volume.deleteVolume
description: Delete a volume.
---

# deleteVolume

<Signature code="deleteVolume(volumeId: string): Promise<void>" />

<SourceLink href="/source/commands/volume-ts/#L97" label="volume.ts:97" />

**Modifiers:** `async`

Delete a volume.

**Parameters**

- `volumeId` (string) — — The volume ID to delete.

**Returns**

- `Promise<void>`

* **See:**
  - \- https\://docs.hyperstack.cloud/docs/storage/volumes/creating-a-volume/ — Volume lifecycle
    &#x20;\- https\://docs.hyperstack.cloud/docs/api-reference/volume/#delete-volume — DELETE /core/volumes/{id}
