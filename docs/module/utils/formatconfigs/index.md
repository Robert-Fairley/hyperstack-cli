---
title: formatConfigs
kind: function
longname: module:utils.formatConfigs
description: Format GPU configuration entries into a display string. Filters out zero-count configurations and joins remaining as size:count .
---

# formatConfigs

<Signature
  code="formatConfigs(
	configs: Record<string, number> | null | undefined,
): string"
/>

<SourceLink href="/hyperstack-cli/source/utils-ts/#L63" label="utils.ts:63" />

Format GPU configuration entries into a display string. Filters out zero-count configurations and joins remaining as `size:count`.

**Parameters**

- `configs` (Record\<string, number> | null | undefined) — — GPU size-to-count mapping, or null/undefined.

**Returns**

- `string` — Formatted string like `"8GB:2, 16GB:1"`, or `"-"` if empty.

* **See:**
  - [https://docs.hyperstack.cloud/docs/hardware/flavors/ — Flavors documentation](<https://docs.hyperstack.cloud/docs/hardware/flavors/ — Flavors documentation>)
