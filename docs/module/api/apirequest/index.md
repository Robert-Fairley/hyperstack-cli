---
title: apiRequest
kind: function
longname: module:api.apiRequest
description: Make a request to the HyperStack REST API. Automatically attaches the API key header and parses JSON responses. Throws on non-2xx status codes or invalid JSON payloads.
---

# apiRequest

<Signature
  code="apiRequest(
	path: string,
	method: string,
	body?: Record<string, unknown>,
): Promise<unknown>"
/>

<SourceLink href="/source/api-ts/#L41" label="api.ts:41" />

**Modifiers:** `async`

Make a request to the HyperStack REST API. Automatically attaches the API key header and parses JSON responses. Throws on non-2xx status codes or invalid JSON payloads.

**Parameters**

- `path` (string) — — API endpoint path (e.g., `/core/virtual-machines`).
- `method` (string, default: `"GET"`) — — HTTP method. Defaults to `"GET"`.
- `body` (Record\<string, unknown>, optional) — — Optional request body for POST/PUT requests.

**Returns**

- `Promise<unknown>` — Parsed JSON response as `unknown`.

* **See:**
  - [https://docs.hyperstack.cloud/docs/api-reference/introduction/ — API overview](<https://docs.hyperstack.cloud/docs/api-reference/introduction/ — API overview>)
