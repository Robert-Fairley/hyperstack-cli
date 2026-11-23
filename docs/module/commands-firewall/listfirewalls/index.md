---
title: listFirewalls
kind: function
longname: module:commands/firewall.listFirewalls
description: List firewalls for a VM or all firewalls globally. Displays rules in table format per firewall.
---

# listFirewalls

<Signature code="listFirewalls(vmId?: string): Promise<void>" />

<SourceLink href="/source/commands/firewall-ts/#L26" label="firewall.ts:26" />

**Modifiers:** `async`

List firewalls for a VM or all firewalls globally. Displays rules in table format per firewall.

**Parameters**

- `vmId` (string, optional) — — Optional VM ID to list firewalls for a specific VM. Omit for global list.

**Returns**

- `Promise<void>`

* **See:**
  - [https://docs.hyperstack.cloud/docs/api-reference/firewalls/#get-firewalls — GET /core/firewalls](<https://docs.hyperstack.cloud/docs/api-reference/firewalls/#get-firewalls — GET /core/firewalls>)
