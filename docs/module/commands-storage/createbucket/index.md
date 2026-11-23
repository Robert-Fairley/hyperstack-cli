---
title: createBucket
kind: function
longname: module:commands/storage.createBucket
description: Create a new object storage bucket.
---

# createBucket

<Signature code="createBucket(name: string, region?: string): Promise<void>" />

<SourceLink href="/hyperstack-cli/source/commands/storage-ts/#L51" label="storage.ts:51" />

**Modifiers:** `async`

Create a new object storage bucket.

**Parameters**

- `name` (string) — — Bucket name (must be globally unique).
- `region` (string, optional) — — Optional region for the bucket.

**Returns**

- `Promise<void>`

* **See:**
  - [https://docs.hyperstack.cloud/docs/api-reference/buckets/#create-bucket — POST /object-storage/buckets](<https://docs.hyperstack.cloud/docs/api-reference/buckets/#create-bucket — POST /object-storage/buckets>)
