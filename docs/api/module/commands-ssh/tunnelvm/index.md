---
title: tunnelVm
kind: function
longname: module:commands/ssh.tunnelVm
description: Create an SSH tunnel from a local port to a remote port on a VM. Prints a status message before connecting. Uses 127.0.0.1 instead of localhost to avoid IPv6 resolution issues on some systems.
---

# tunnelVm

<Signature
  code="tunnelVm(
	vmId: string,
	localPort: string,
	remotePort: string,
	user: string,
): Promise<void>"
/>

<SourceLink href="/source/commands/ssh-ts/#L36" label="ssh.ts:36" />

**Modifiers:** `async`

Create an SSH tunnel from a local port to a remote port on a VM. Prints a status message before connecting. Uses `127.0.0.1` instead of `localhost` to avoid IPv6 resolution issues on some systems.

**Parameters**

- `vmId` (string) — — The VM ID or name to tunnel through.
- `localPort` (string, default: `"8000"`) — — Local port to bind. Defaults to `"8000"`.
- `remotePort` (string, default: `"8000"`) — — Remote port on the VM. Defaults to `"8000"`.
- `user` (string, default: `"ubuntu"`) — — SSH username. Defaults to `"ubuntu"`.

**Returns**

- `Promise<void>`
