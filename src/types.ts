/**
 * Shared type definitions for HyperStack API responses.
 */

// ── VM ──────────────────────────────────────────────────────────────

export interface VmRegion {
  name?: string;
}

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

export interface VmListResponse {
  instances?: VmInstance[];
  virtual_machines?: VmInstance[];
  data?: VmInstance[] | VmDataWrapper;
}

export interface VmDataWrapper {
  instance?: VmInstance;
  virtual_machine?: VmInstance;
  data?: VmInstance | VmListResponse;
}

export interface SingleVmResponse {
  instance?: VmInstance;
  virtual_machine?: VmInstance;
  data?: VmInstance | VmListResponse;
}

// ── GPU Stock ───────────────────────────────────────────────────────

export interface GpuModel {
  model?: string;
  name?: string;
  available?: string | number;
  configurations?: Record<string, number>;
}

export interface StockRegion {
  region?: VmRegion | string;
  models?: GpuModel[];
}

export interface StockResponse {
  stocks?: StockRegion[];
  data?: StockDataWrapper;
}

export interface StockDataWrapper {
  stocks?: StockRegion[];
  data?: StockRegion[];
}

// ── Volume ──────────────────────────────────────────────────────────

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

export interface Image {
  id?: string;
  name?: string;
  description?: string;
  os_type?: string;
  is_public?: boolean;
  public?: boolean;
}

// ── Region ──────────────────────────────────────────────────────────

export interface RegionInfo {
  id?: string;
  name?: string;
  status?: string;
}

// ── Firewall ────────────────────────────────────────────────────────

export interface FirewallRule {
  id?: string;
  port?: number;
  protocol?: string;
  source?: string;
  description?: string;
}

export interface Firewall {
  id?: string;
  name?: string;
  vm_id?: string | number;
  rules?: FirewallRule[];
}

// ── Billing ─────────────────────────────────────────────────────────

export interface CreditBalance {
  balance?: number;
  currency?: string;
}

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

export interface StorageBucket {
  id?: string;
  name?: string;
  region?: string;
  created_at?: string;
}

export interface AccessKey {
  id?: string;
  access_key_id?: string;
  secret_access_key?: string;
  bucket_name?: string;
  status?: string;
}

// ── Kubernetes Cluster ──────────────────────────────────────────────

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

export interface DashboardSummary {
  active_vms?: number;
  hourly_cost?: number;
  total_volumes?: number;
  currency?: string;
}
