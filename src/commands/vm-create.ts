/**
 * VM creation command.
 * Deploy new GPU/CPU virtual machines via the API.
 *
 * @see https://docs.hyperstack.cloud/docs/api-reference/flavor/ — Flavors API reference
 * @see https://docs.hyperstack.cloud/docs/api-reference/image/ — Image API reference
 * @see https://docs.hyperstack.cloud/docs/api-reference/region/ — Region API reference
 * @see https://docs.hyperstack.cloud/docs/api-reference/virtual-machine/ — Virtual Machine API reference
 */

import { apiRequest } from "../api.js";

interface FlavorInfo {
  id?: string;
  name?: string;
  description?: string;
  gpu_count?: number;
  vcpu_count?: number;
  ram_gb?: number;
  spot_price?: number;
  regular_price?: number;
}

interface ImageInfo {
  id?: string;
  name?: string;
  os_type?: string;
  is_public?: boolean;
}

/**
 * List available flavors (hardware configurations).
 * Displays id, name, GPU count, vCPU, RAM, and pricing for each flavor.
 * @see https://docs.hyperstack.cloud/docs/api-reference/flavor/#get-flavors — GET /core/flavors
 */
export async function listFlavors(): Promise<void> {
  const data = await apiRequest("/core/flavors");
  const flavors = extractFlavorList(data);

  const rows: Record<string, string | number>[] = flavors.map((f) => ({
    id: f.id ?? "-",
    name: f.name ?? "-",
    gpu: f.gpu_count ?? 0,
    vcpu: f.vcpu_count ?? 0,
    ram_gb: f.ram_gb ?? 0,
    spot_price: f.spot_price ?? "-",
    regular_price: f.regular_price ?? "-",
  }));

  console.table(rows);
}

/**
 * List available OS images for VM provisioning.
 * Displays id, name, OS type, and public availability for each image.
 * @see https://docs.hyperstack.cloud/docs/api-reference/image/#get-images — GET /core/images
 */
export async function listImages(): Promise<void> {
  const data = await apiRequest("/core/images");
  const images = extractImageList(data);

  const rows: Record<string, string | boolean>[] = images.map((img) => ({
    id: img.id ?? "-",
    name: img.name ?? "-",
    os_type: img.os_type ?? "-",
    public: (img as any).is_public ?? false,
  }));

  console.table(rows);
}

/**
 * List available regions for VM deployment.
 * Displays id, name, and status for each region.
 * @see https://docs.hyperstack.cloud/docs/api-reference/region/#get-regions — GET /core/regions
 */
export async function listRegions(): Promise<void> {
  const data = await apiRequest("/core/regions");
  const regions = extractRegionList(data);

  const rows: Record<string, string>[] = regions.map((r) => ({
    id: r.id ?? "-",
    name: r.name ?? "-",
    status: r.status || "unknown",
  }));

  console.table(rows);
}

/**
 * Create a new virtual machine.
 * @param opts — VM creation options.
 * @param opts.flavorId — Hardware flavor ID (required).
 * @param opts.imageId — OS image ID (required).
 * @param opts.name — Display name for the VM.
 * @param opts.region — Target region.
 * @param opts.keyName — SSH key pair name.
 * @param opts.spot — Use spot/preemptible pricing.
 * @param opts.count — Number of VMs to create (default: 1).
 * @see https://docs.hyperstack.cloud/docs/virtual-machines/getting-started/ — Getting started with VMs
 * @see https://docs.hyperstack.cloud/docs/api-reference/virtual-machine/#create-vm — POST /core/virtual-machines
 */
export async function createVm(opts: {
  flavorId?: string;
  imageId?: string;
  name?: string;
  region?: string;
  keyName?: string;
  spot?: boolean;
  count?: number;
}): Promise<void> {
  const body: Record<string, unknown> = {};

  if (opts.flavorId) body.flavor_id = opts.flavorId;
  if (opts.imageId) body.image_id = opts.imageId;
  if (opts.name) body.name = opts.name;
  if (opts.region) body.region = opts.region;
  if (opts.keyName) body.key_name = opts.keyName;
  if (opts.spot) body.spot = true;
  if (opts.count && opts.count > 1) body.count = opts.count;

  const result = await apiRequest("/core/virtual-machines", "POST", body);
  console.log(JSON.stringify(result, null, 2));
}

function extractFlavorList(data: unknown): FlavorInfo[] {
  if (Array.isArray(data)) return data as FlavorInfo[];
  const obj = data as Record<string, unknown> | undefined;
  if (!obj) return [];
  return (
    (obj.data as FlavorInfo[]) ||
    (obj.flavors as FlavorInfo[]) ||
    []
  );
}

function extractImageList(data: unknown): ImageInfo[] {
  if (Array.isArray(data)) return data as ImageInfo[];
  const obj = data as Record<string, unknown> | undefined;
  if (!obj) return [];
  return (
    (obj.data as ImageInfo[]) ||
    (obj.images as ImageInfo[]) ||
    []
  );
}

function extractRegionList(data: unknown): { id?: string; name?: string; status?: string }[] {
  if (Array.isArray(data)) return data as any;
  const obj = data as Record<string, unknown> | undefined;
  if (!obj) return [];
  const regions = obj.regions as { id?: string; name?: string; status?: string }[] | undefined;
  if (regions && Array.isArray(regions)) return regions;
  const d = obj.data as { id?: string; name?: string; status?: string }[] | undefined;
  if (d && Array.isArray(d)) return d;
  return [];
}
