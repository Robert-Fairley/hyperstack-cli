/**
 * Kubernetes cluster commands.
 * List, create, and manage K8s clusters via the API.
 */

import { apiRequest } from "../api.js";
import type { K8sCluster } from "../types.js";

interface ClusterRow {
  id: string;
  name: string;
  status: string;
  region: string;
  k8s_version: string;
  nodes: number;
}

/**
 * List Kubernetes clusters.
 */
export async function listClusters(): Promise<void> {
  const data = await apiRequest("/core/clusters");
  const clusters = extractClusterList(data);

  const rows: ClusterRow[] = clusters.map((c) => ({
    id: c.id ?? "-",
    name: c.name ?? "-",
    status: c.status || "unknown",
    region: typeof c.region === "string" ? c.region : c.region?.name || "-",
    k8s_version: c.kubernetes_version || "-",
    nodes: c.node_count ?? 0,
  }));

  console.table(rows);
}

/**
 * Create a new Kubernetes cluster.
 */
export async function createCluster(opts?: {
  name?: string;
  region?: string;
  nodeCount?: number;
  k8sVersion?: string;
}): Promise<void> {
  const body: Record<string, unknown> = {};

  if (opts?.name) body.name = opts.name;
  if (opts?.region) body.region = opts.region;
  if (opts?.nodeCount) body.node_count = opts.nodeCount;
  if (opts?.k8sVersion) body.kubernetes_version = opts.k8sVersion;

  const result = await apiRequest("/core/clusters", "POST", body);
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Delete a Kubernetes cluster.
 */
export async function deleteCluster(clusterId: string): Promise<void> {
  const result = await apiRequest(`/core/clusters/${clusterId}`, "DELETE");
  console.log(JSON.stringify(result, null, 2));
}

function extractClusterList(data: unknown): K8sCluster[] {
  if (Array.isArray(data)) return data as K8sCluster[];
  const obj = data as Record<string, unknown> | undefined;
  if (!obj) return [];
  return (
    (obj.data as K8sCluster[]) ||
    (obj.clusters as K8sCluster[]) ||
    []
  );
}
