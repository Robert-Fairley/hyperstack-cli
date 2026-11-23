/**
 * Shared type definitions for HyperStack API responses.
 */

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
