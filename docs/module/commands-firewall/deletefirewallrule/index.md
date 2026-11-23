---
title: deleteFirewallRule
kind: function
longname: module:commands/firewall.deleteFirewallRule
description: Delete a firewall rule from a VM.
---

# deleteFirewallRule

<Signature code="deleteFirewallRule(vmId: string, ruleId: string): Promise<void>" />

<SourceLink href="/source/commands/firewall-ts/#L81" label="firewall.ts:81" />

**Modifiers:** `async`

Delete a firewall rule from a VM.

**Parameters**

- `vmId` (string) — — The target VM ID.
- `ruleId` (string) — — The firewall rule ID to delete.

**Returns**

- `Promise<void>`

* **See:**
  - [https://docs.hyperstack.cloud/docs/api-reference/firewalls/#delete-firewall-rule — DELETE /core/firewalls/{id}](<https://docs.hyperstack.cloud/docs/api-reference/firewalls/#delete-firewall-rule — DELETE /core/firewalls/{id}>)
