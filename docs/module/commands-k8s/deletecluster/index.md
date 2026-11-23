---
title: deleteCluster
kind: function
longname: module:commands/k8s.deleteCluster
description: Delete a Kubernetes cluster.
---

# deleteCluster

<Signature code="deleteCluster(clusterId: string): Promise<void>" />

<SourceLink href="/hyperstack-cli/source/commands/k8s-ts/#L74" label="k8s.ts:74" />

**Modifiers:** `async`

Delete a Kubernetes cluster.

**Parameters**

- `clusterId` (string) — — The cluster ID to delete.

**Returns**

- `Promise<void>`

* **See:**
  - [https://docs.hyperstack.cloud/docs/api-reference/clusters/#delete-cluster — DELETE /core/clusters/{id}](<https://docs.hyperstack.cloud/docs/api-reference/clusters/#delete-cluster — DELETE /core/clusters/{id}>)
