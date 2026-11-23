---
title: sshToVm
kind: function
longname: module:commands/ssh.sshToVm
description: SSH into a VM by ID or name, forwarding the terminal directly.
---

# sshToVm

<Signature code="sshToVm(vmId: string, user: string): Promise<void>" />

<SourceLink href="/source/commands/ssh-ts/#L18" label="ssh.ts:18" />

**Modifiers:** `async`

SSH into a VM by ID or name, forwarding the terminal directly.

**Parameters**

- `vmId` (string) — — The VM ID or name to connect to.
- `user` (string, default: `"ubuntu"`) — — SSH username. Defaults to `"ubuntu"`.

**Returns**

- `Promise<void>`

* **See:**
  - [https://docs.hyperstack.cloud/docs/network/ssh/ — SSH access guide](<https://docs.hyperstack.cloud/docs/network/ssh/ — SSH access guide>)
