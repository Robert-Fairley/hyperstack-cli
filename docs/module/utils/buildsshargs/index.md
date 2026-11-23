---
title: buildSshArgs
kind: function
longname: module:utils.buildSshArgs
description: Build an SSH arguments array with optional key file and extra flags.
---

# buildSshArgs

<Signature code="buildSshArgs(extraArgs: string[], target: string): string[]" />

<SourceLink href="/hyperstack-cli/source/utils-ts/#L26" label="utils.ts:26" />

Build an SSH arguments array with optional key file and extra flags.

**Parameters**

- `extraArgs` (string\[]) — — Additional SSH flags (e.g., `["-N", "-L", "..."]`).
- `target` (string) — — The SSH target string (e.g., `"ubuntu@192.0.2.1"`).

**Returns**

- `string[]` — Complete arguments array for `child_process.spawn`.

* **See:**
  - [https://docs.hyperstack.cloud/docs/network/ssh/ — SSH access guide](<https://docs.hyperstack.cloud/docs/network/ssh/ — SSH access guide>)
