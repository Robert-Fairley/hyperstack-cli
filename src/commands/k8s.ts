/**
 * Kubernetes cluster commands.
 * List, create, and manage K8s clusters via the API.
 *
 * @see https://docs.hyperstack.cloud/docs/api-reference/clusters/ — Clusters API reference
 * @see https://docs.hyperstack.cloud/docs/kubernetes/kubernetes-guide/ — Kubernetes guide
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
 * List Kubernetes clusters in a table format.
 * Displays id, name, status, region, K8s version, and node count for each cluster.
 * @param isJsonOutput — If true, output as JSON instead of table.
 * @see https://docs.hyperstack.cloud/docs/api-reference/clusters/#get-clusters — GET /core/clusters
 */
export async function listClusters(isJsonOutput?: boolean): Promise<void> {
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

  if (isJsonOutput) {
    console.log(JSON.stringify(rows, null, 2));
  } else {
    console.table(rows);
  }
}

/**
 * Create a new Kubernetes cluster.
 * @param opts — Optional cluster configuration.
 * @param opts.name — Cluster display name.
 * @param opts.region — Target region.
 * @param opts.nodeCount — Number of worker nodes.
 * @param opts.k8sVersion — Kubernetes version (e.g., `"1.31"`).
 * @param isJsonOutput — If true, output as JSON instead of default format.
 * @see https://docs.hyperstack.cloud/docs/kubernetes/kubernetes-guide/ — Kubernetes guide
 * @see https://docs.hyperstack.cloud/docs/api-reference/clusters/#create-cluster — POST /core/clusters
 */
export async function createCluster(opts?: {
  name?: string;
  region?: string;
  nodeCount?: number;
  k8sVersion?: string;
}, isJsonOutput?: boolean): Promise<void> {
  const body: Record<string, unknown> = {};

  if (opts?.name) body.name = opts.name;
  if (opts?.region) body.region = opts.region;
  if (opts?.nodeCount) body.node_count = opts.nodeCount;
  if (opts?.k8sVersion) body.kubernetes_version = opts.k8sVersion;

  const result = await apiRequest("/core/clusters", "POST", body);
  if (isJsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log("Cluster created successfully");
  }
}

/**
 * Delete a Kubernetes cluster.
 * @param clusterId — The cluster ID to delete.
 * @param isJsonOutput — If true, output as JSON instead of default format.
 * @see https://docs.hyperstack.cloud/docs/api-reference/clusters/#delete-cluster — DELETE /core/clusters/{id}
 */
export async function deleteCluster(clusterId: string, isJsonOutput?: boolean): Promise<void> {
  const result = await apiRequest(`/core/clusters/${clusterId}`, "DELETE");
  if (isJsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log("Cluster deleted successfully");
  }
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
