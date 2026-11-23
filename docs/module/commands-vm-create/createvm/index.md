---
title: createVm
kind: function
longname: module:commands/vm-create.createVm
description: Create a new virtual machine.
---

# createVm

<Signature
  code="createVm(
	opts: { count?: number; flavorId?: string; imageId?: string; keyName?: string; name?: string; region?: string; spot?: boolean },
): Promise<void>"
/>

<SourceLink href="/hyperstack-cli/source/commands/vm-create-ts/#L103" label="vm-create.ts:103" />

**Modifiers:** `async`

Create a new virtual machine.

**Parameters**

- `opts` ({ count?: number; flavorId?: string; imageId?: string; keyName?: string; name?: string; region?: string; spot?: boolean }) — — VM creation options.

**Properties**

- `count` (number, optional) — — Number of VMs to create (default: 1).
- `flavorId` (string, optional) — — Hardware flavor ID (required).
- `imageId` (string, optional) — — OS image ID (required).
- `keyName` (string, optional) — — SSH key pair name.
- `name` (string, optional) — — Display name for the VM.
- `region` (string, optional) — — Target region.
- `spot` (boolean, optional) — — Use spot/preemptible pricing.

**Returns**

- `Promise<void>`

* **See:**
  - \- https\://docs.hyperstack.cloud/docs/virtual-machines/getting-started/ — Getting started with VMs
    &#x20;\- https\://docs.hyperstack.cloud/docs/api-reference/virtual-machine/#create-vm — POST /core/virtual-machines
