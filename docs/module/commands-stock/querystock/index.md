---
title: queryStock
kind: function
longname: module:commands/stock.queryStock
description: Query GPU stock with optional filtering by region, GPU model, and availability. Returns a table of available GPU configurations across all regions.
---

# queryStock

<Signature
  code="queryStock(
	opts: { availableOnly?: boolean; gpu?: string; region?: string },
): Promise<void>"
/>

<SourceLink href="/hyperstack-cli/source/commands/stock-ts/#L29" label="stock.ts:29" />

**Modifiers:** `async`

Query GPU stock with optional filtering by region, GPU model, and availability. Returns a table of available GPU configurations across all regions.

**Parameters**

- `opts` ({ availableOnly?: boolean; gpu?: string; region?: string }) — — Filter options.

**Properties**

- `availableOnly` (boolean, optional) — — If true, only show GPUs with available instances.
- `gpu` (string, optional) — — Filter by GPU model name (case-insensitive partial match).
- `region` (string, optional) — — Filter by region name (case-insensitive partial match).

**Returns**

- `Promise<void>`

* **See:**
  - [https://docs.hyperstack.cloud/docs/api-reference/stock/#get-gpu-stock — GET /core/stocks](<https://docs.hyperstack.cloud/docs/api-reference/stock/#get-gpu-stock — GET /core/stocks>)
