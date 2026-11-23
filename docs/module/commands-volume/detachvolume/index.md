---
title: detachVolume
kind: function
longname: module:commands/volume.detachVolume
description: Detach a volume from its VM.
---

# detachVolume

<Signature code="detachVolume(volumeId: string): Promise<void>" />

<SourceLink href="/hyperstack-cli/source/commands/volume-ts/#L86" label="volume.ts:86" />

**Modifiers:** `async`

Detach a volume from its VM.

**Parameters**

- `volumeId` (string)

**Returns**

- `Promise<void>`

* **See:**
  - \- https\://docs.hyperstack.cloud/docs/storage/volumes/detaching-a-volume/ — Detaching volumes
    &#x20;\- https\://docs.hyperstack.cloud/docs/api-reference/volume-attachment/#detach-volume — Detach volume endpoint
