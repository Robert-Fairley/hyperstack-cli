---
title: extractVmIp
kind: function
longname: module:utils.extractVmIp
description: Extract the public IP address from a VM object. Checks floating_ip , public_ip , and ip_address in order.
---

# extractVmIp

<Signature code="extractVmIp(vm: VmInstance): string | undefined" />

<SourceLink href="/hyperstack-cli/source/utils-ts/#L52" label="utils.ts:52" />

Extract the public IP address from a VM object. Checks `floating_ip`, `public_ip`, and `ip_address` in order.

**Parameters**

- `vm` ([VmInstance](/hyperstack-cli/module/types/vminstance)) — — A VM instance object.

**Returns**

- `string | undefined` — The first available public IP, or `undefined`.

* **See:**
  - [https://docs.hyperstack.cloud/docs/network/public-ip/ — Public IP addresses](<https://docs.hyperstack.cloud/docs/network/public-ip/ — Public IP addresses>)
