---
title: createCluster
kind: function
longname: module:commands/k8s.createCluster
description: Create a new Kubernetes cluster.
---

# createCluster

<Signature
  code="createCluster(
	opts?: { k8sVersion?: string; name?: string; nodeCount?: number; region?: string },
): Promise<void>"
/>

<SourceLink href="/source/commands/k8s-ts/#L52" label="k8s.ts:52" />

**Modifiers:** `async`

Create a new Kubernetes cluster.

**Parameters**

- `opts` ({ k8sVersion?: string; name?: string; nodeCount?: number; region?: string }, optional) — — Optional cluster configuration.

**Properties**

- `k8sVersion` (string, optional) — — Kubernetes version (e.g., `"1.31"`).
- `name` (string, optional) — — Cluster display name.
- `nodeCount` (number, optional) — — Number of worker nodes.
- `region` (string, optional) — — Target region.

**Returns**

- `Promise<void>`

* **See:**
  - \- https\://docs.hyperstack.cloud/docs/kubernetes/kubernetes-guide/ — Kubernetes guide
    &#x20;\- https\://docs.hyperstack.cloud/docs/api-reference/clusters/#create-cluster — POST /core/clusters
