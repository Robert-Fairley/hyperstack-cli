---
title: deleteBucket
kind: function
longname: module:commands/storage.deleteBucket
description: Delete an object storage bucket.
---

# deleteBucket

<Signature code="deleteBucket(name: string): Promise<void>" />

<SourceLink href="/hyperstack-cli/source/commands/storage-ts/#L64" label="storage.ts:64" />

**Modifiers:** `async`

Delete an object storage bucket.

**Parameters**

- `name` (string) — — Bucket name to delete.

**Returns**

- `Promise<void>`

* **See:**
  - [https://docs.hyperstack.cloud/docs/api-reference/buckets/#delete-bucket — DELETE /object-storage/buckets/{name}](<https://docs.hyperstack.cloud/docs/api-reference/buckets/#delete-bucket — DELETE /object-storage/buckets/{name}>)
