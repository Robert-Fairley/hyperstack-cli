---
title: hibernateVm
kind: function
longname: module:commands/vm.hibernateVm
description: Hibernate a VM (shut down with state preserved). Stops billing while preserving disk and memory state for fast restore.
---

# hibernateVm

<Signature code="hibernateVm(vmId: string, retainIp: boolean): Promise<void>" />

<SourceLink href="/hyperstack-cli/source/commands/vm-ts/#L50" label="vm.ts:50" />

**Modifiers:** `async`

Hibernate a VM (shut down with state preserved). Stops billing while preserving disk and memory state for fast restore.

**Parameters**

- `vmId` (string) — — The VM ID or name to hibernate.
- `retainIp` (boolean, default: `false`) — — If true, keep the public IP attached after hibernation. Defaults to `false`.

**Returns**

- `Promise<void>`

* **See:**
  - \- https\://docs.hyperstack.cloud/docs/virtual-machines/hibernation/ — Hibernation guide
    &#x20;\- https\://docs.hyperstack.cloud/docs/api-reference/virtual-machine/#hibernate-vm — Hibernate VM endpoint
