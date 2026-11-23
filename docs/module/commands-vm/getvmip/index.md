---
title: getVmIp
kind: function
longname: module:commands/vm.getVmIp
description: Get the public IP address for a VM by ID or name. Tries numeric ID lookup first, then falls back to name-based search across all VMs.
---

# getVmIp

<Signature code="getVmIp(vmIdOrName: string): Promise<string>" />

<SourceLink href="/source/commands/vm-ts/#L80" label="vm.ts:80" />

**Modifiers:** `async`

Get the public IP address for a VM by ID or name. Tries numeric ID lookup first, then falls back to name-based search across all VMs.

**Parameters**

- `vmIdOrName` (string) — — The VM ID (numeric) or name to look up.

**Returns**

- `Promise<string>` — The public IP address string.

**Throws**

- Error if no VM is found or no IP is available.

* **See:**
  - \- https\://docs.hyperstack.cloud/docs/network/public-ip/ — Public IP addresses
    &#x20;\- https\://docs.hyperstack.cloud/docs/api-reference/virtual-machine/#get-virtual-machine — Get VM endpoint
