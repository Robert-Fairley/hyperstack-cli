---
title: createVolume
kind: function
longname: module:commands/volume.createVolume
description: Create a new block storage volume.
---

# createVolume

<Signature
  code="createVolume(
	opts: { name?: string; region?: string; sizeGb: number },
): Promise<void>"
/>

<SourceLink href="/hyperstack-cli/source/commands/volume-ts/#L51" label="volume.ts:51" />

**Modifiers:** `async`

Create a new block storage volume.

**Parameters**

- `opts` ({ name?: string; region?: string; sizeGb: number }) — — Volume creation options.

**Properties**

- `name` (string, optional) — — Optional display name for the volume.
- `region` (string, optional) — — Optional region override.
- `sizeGb` (number) — — Size of the volume in gigabytes (required).

**Returns**

- `Promise<void>`

* **See:**
  - \- https\://docs.hyperstack.cloud/docs/storage/volumes/creating-a-volume/ — Creating a volume guide
    &#x20;\- https\://docs.hyperstack.cloud/docs/api-reference/volume/#create-volume — POST /core/volumes
