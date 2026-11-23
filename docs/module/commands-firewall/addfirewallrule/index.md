---
title: addFirewallRule
kind: function
longname: module:commands/firewall.addFirewallRule
description: Add a firewall rule to a VM.
---

# addFirewallRule

<Signature
  code="addFirewallRule(
	vmId: string,
	opts: { description?: string; port?: number; protocol?: string; source?: string },
): Promise<void>"
/>

<SourceLink href="/hyperstack-cli/source/commands/firewall-ts/#L60" label="firewall.ts:60" />

**Modifiers:** `async`

Add a firewall rule to a VM.

**Parameters**

- `vmId` (string) — — The target VM ID.
- `opts` ({ description?: string; [port](/hyperstack-cli/module/types/firewallrule#port)?: number; [protocol](/hyperstack-cli/module/types/firewallrule#protocol)?: string; [source](/hyperstack-cli/module/types/firewallrule#source)?: string }) — — Rule configuration options.

**Properties**

- `description` (string, optional) — — Optional human-readable description.
- `port` (number, optional) — — Port number to open (e.g., `443`).
- `protocol` (string, optional) — — Protocol: `"tcp"` or `"udp"`. Defaults to `"tcp"`.
- `source` (string, optional) — — CIDR source range. Defaults to `"0.0.0.0/0"`.

**Returns**

- `Promise<void>`

* **See:**
  - \- https\://docs.hyperstack.cloud/docs/network/firewalls/ — Firewalls guide
    &#x20;\- https\://docs.hyperstack.cloud/docs/api-reference/firewalls/#create-firewall-rule — Create firewall rule endpoint
