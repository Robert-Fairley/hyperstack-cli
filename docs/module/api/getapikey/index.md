---
title: getApiKey
kind: function
longname: module:api.getApiKey
description: Retrieve the API key from environment variables. Exits with code 1 if HYPERSTACK_API_KEY is not set.
---

# getApiKey

<Signature code="getApiKey(): string" />

<SourceLink href="/hyperstack-cli/source/api-ts/#L22" label="api.ts:22" />

Retrieve the API key from environment variables. Exits with code 1 if `HYPERSTACK_API_KEY` is not set.

**Returns**

- `string` — The API key string.

**Throws**

- Terminates process if key is missing.

* **See:**
  - [https://docs.hyperstack.cloud/docs/resource-management/api-keys/ — API keys management](<https://docs.hyperstack.cloud/docs/resource-management/api-keys/ — API keys management>)
