---
title: restoreVm
kind: function
longname: module:commands/vm.restoreVm
description: Restore a hibernated VM. Brings a previously hibernated VM back online.
---

# restoreVm

<Signature code="restoreVm(vmId: string): Promise<void>" />

<SourceLink href="/hyperstack-cli/source/commands/vm-ts/#L66" label="vm.ts:66" />

**Modifiers:** `async`

Restore a hibernated VM. Brings a previously hibernated VM back online.

**Parameters**

- `vmId` (string) — — The VM ID or name to restore.

**Returns**

- `Promise<void>`

* **See:**
  - \- https\://docs.hyperstack.cloud/docs/virtual-machines/hibernation/ — Hibernation guide
    &#x20;\- https\://docs.hyperstack.cloud/docs/api-reference/virtual-machine/#restore-hibernated-vm — Restore hibernated VM endpoint
