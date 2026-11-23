---
title: createAccessKey
kind: function
longname: module:commands/storage.createAccessKey
description: Create a new S3-compatible access key.
---

# createAccessKey

<Signature code="createAccessKey(opts?: { bucketName?: string }): Promise<void>" />

<SourceLink href="/source/commands/storage-ts/#L94" label="storage.ts:94" />

**Modifiers:** `async`

Create a new S3-compatible access key.

**Parameters**

- `opts` ({ bucketName?: string }, optional) — — Optional key configuration.

**Properties**

- `bucketName` (string, optional) — — Optional bucket to scope the key to.

**Returns**

- `Promise<void>`

* **See:**
  - [https://docs.hyperstack.cloud/docs/api-reference/access-keys/#create-access-key — POST /object-storage/access-keys](<https://docs.hyperstack.cloud/docs/api-reference/access-keys/#create-access-key — POST /object-storage/access-keys>)
