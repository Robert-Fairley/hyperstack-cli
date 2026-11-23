---
title: extractVmList
kind: function
longname: module:utils.extractVmList
description: Extract a list of VM instances from various API response shapes. Handles direct arrays, { instances } , { virtual_machines } , and { data } wrappers.
---

# extractVmList

<Signature code="extractVmList(data: unknown): VmInstance[]" />

<SourceLink href="/hyperstack-cli/source/utils-ts/#L38" label="utils.ts:38" />

Extract a list of VM instances from various API response shapes. Handles direct arrays, `{ instances }`, `{ virtual_machines }`, and `{ data }` wrappers.

**Parameters**

- `data` (unknown) — — Raw API response (parsed JSON).

**Returns**

- [`VmInstance`](/hyperstack-cli/module/types/vminstance)`[]` — Array of [VmInstance](/hyperstack-cli/module/types/vminstance) objects.

* **See:**
  - [https://docs.hyperstack.cloud/docs/api-reference/virtual-machine/ — Virtual Machine API reference](<https://docs.hyperstack.cloud/docs/api-reference/virtual-machine/ — Virtual Machine API reference>)
