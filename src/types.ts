/**
 * Shared type definitions for HyperStack API responses.
 * These interfaces describe the shapes returned by the REST API endpoints.
 *
 * @see https://docs.hyperstack.cloud/docs/api-reference/section-core/ — Core API section
 * @see https://docs.hyperstack.cloud/docs/api-reference/section-billing/ — Billing API section
 * @see https://docs.hyperstack.cloud/docs/api-reference/section-object-storage/ — Object Storage API section
 */

// ── VM ──────────────────────────────────────────────────────────────

/** Represents a VM region reference from the API. */
export interface VmRegion {
  name?: string;
}

/** A virtual machine instance as returned by the API. */
export interface VmInstance {
  id?: string | number;
  name?: string;
  status?: string;
  vm_state?: string;
  floating_ip?: string;
  public_ip?: string;
  ip_address?: string;
  region?: VmRegion | string;
}

/** Wrapper for VM list API responses with various possible shapes. */
export interface VmListResponse {
  instances?: VmInstance[];
  virtual_machines?: VmInstance[];
  data?: VmInstance[] | VmDataWrapper;
}

/** Nested wrapper for single-VM API responses. */
export interface VmDataWrapper {
  instance?: VmInstance;
  virtual_machine?: VmInstance;
  data?: VmInstance | VmListResponse;
}

/** Response shape for a single VM lookup endpoint. */
export interface SingleVmResponse {
  instance?: VmInstance;
  virtual_machine?: VmInstance;
  data?: VmInstance | VmListResponse;
}

// ── GPU Stock ───────────────────────────────────────────────────────

/** A GPU model entry from the stock API. */
export interface GpuModel {
  model?: string;
  name?: string;
  available?: string | number;
  configurations?: Record<string, number>;
}

/** A region's GPU stock data from the stock API. */
export interface StockRegion {
  region?: VmRegion | string;
  models?: GpuModel[];
}

/** Top-level response shape for the stock API. */
export interface StockResponse {
  stocks?: StockRegion[];
  data?: StockDataWrapper;
}

/** Nested wrapper for stock API responses. */
export interface StockDataWrapper {
  stocks?: StockRegion[];
  data?: StockRegion[];
}

// ── Volume ──────────────────────────────────────────────────────────

/** A block storage volume as returned by the API. */
export interface Volume {
  id?: string;
  name?: string;
  size?: number;
  status?: string;
  vm_id?: string | number;
  region?: VmRegion | string;
  created_at?: string;
}

// ── Snapshot ────────────────────────────────────────────────────────

/** A disk snapshot as returned by the API. */
export interface Snapshot {
  id?: string;
  name?: string;
  size?: number;
  status?: string;
  vm_id?: string | number;
  region?: VmRegion | string;
  created_at?: string;
}

// ── Flavor ──────────────────────────────────────────────────────────

/** A hardware flavor (VM configuration) as returned by the API. */
export interface Flavor {
  id?: string;
  name?: string;
  description?: string;
  gpu_count?: number;
  vcpu_count?: number;
  ram_gb?: number;
  spot_price?: number;
  regular_price?: number;
}

// ── Image ───────────────────────────────────────────────────────────

/** An OS image available for VM provisioning. */
export interface Image {
  id?: string;
  name?: string;
  description?: string;
  os_type?: string;
  is_public?: boolean;
  public?: boolean;
}

// ── Region ──────────────────────────────────────────────────────────

/** A deployment region as returned by the API. */
export interface RegionInfo {
  id?: string;
  name?: string;
  status?: string;
}

// ── Firewall ────────────────────────────────────────────────────────

/** A single firewall rule entry. */
export interface FirewallRule {
  id?: string;
  port?: number;
  protocol?: string;
  source?: string;
  description?: string;
}

/** A firewall with its associated rules. */
export interface Firewall {
  id?: string;
  name?: string;
  vm_id?: string | number;
  rules?: FirewallRule[];
}

// ── Billing ─────────────────────────────────────────────────────────

/** Current credit balance response. */
export interface CreditBalance {
  balance?: number;
  currency?: string;
}

/** A billing/usage record from the API. */
export interface BillingRecord {
  id?: string;
  resource_type?: string;
  resource_id?: string;
  amount?: number;
  currency?: string;
  started_at?: string;
  ended_at?: string;
  description?: string;
}

// ── Object Storage ──────────────────────────────────────────────────

/** An object storage bucket. */
export interface StorageBucket {
  id?: string;
  name?: string;
  region?: string;
  created_at?: string;
}

/** An S3-compatible access key pair. */
export interface AccessKey {
  id?: string;
  access_key_id?: string;
  secret_access_key?: string;
  bucket_name?: string;
  status?: string;
}

// ── Kubernetes Cluster ──────────────────────────────────────────────

/** A managed Kubernetes cluster as returned by the API. */
export interface K8sCluster {
  id?: string;
  name?: string;
  status?: string;
  region?: VmRegion | string;
  kubernetes_version?: string;
  node_count?: number;
  created_at?: string;
}

// ── Dashboard ───────────────────────────────────────────────────────

/** Account dashboard summary response. */
export interface DashboardSummary {
  active_vms?: number;
  hourly_cost?: number;
  total_volumes?: number;
  currency?: string;
}
