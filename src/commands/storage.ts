/**
 * Object storage commands.
 * List buckets and manage S3-compatible access keys.
 */

import { apiRequest } from "../api.js";
import type { StorageBucket, AccessKey } from "../types.js";

interface BucketRow {
  name: string;
  region: string;
  created_at: string;
}

interface KeyRow {
  id: string;
  access_key_id: string;
  bucket_name: string;
  status: string;
}

/**
 * List object storage buckets.
 */
export async function listBuckets(): Promise<void> {
  const data = await apiRequest("/object-storage/buckets");
  const buckets = extractBucketList(data);

  const rows: BucketRow[] = buckets.map((b) => ({
    name: b.name ?? "-",
    region: b.region || "-",
    created_at: b.created_at || "-",
  }));

  console.table(rows);
}

/**
 * Create a new object storage bucket.
 */
export async function createBucket(name: string, region?: string): Promise<void> {
  const body: Record<string, unknown> = { name };
  if (region) body.region = region;

  const result = await apiRequest("/object-storage/buckets", "POST", body);
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Delete an object storage bucket.
 */
export async function deleteBucket(name: string): Promise<void> {
  const result = await apiRequest(`/object-storage/buckets/${name}`, "DELETE");
  console.log(JSON.stringify(result, null, 2));
}

/**
 * List S3-compatible access keys.
 */
export async function listAccessKeys(): Promise<void> {
  const data = await apiRequest("/object-storage/access-keys");
  const keys = extractKeyList(data);

  const rows: KeyRow[] = keys.map((k) => ({
    id: k.id ?? "-",
    access_key_id: k.access_key_id ?? "-",
    bucket_name: k.bucket_name || "-",
    status: k.status || "unknown",
  }));

  console.table(rows);
}

/**
 * Create a new S3-compatible access key.
 */
export async function createAccessKey(opts?: { bucketName?: string }): Promise<void> {
  const body: Record<string, unknown> = {};
  if (opts?.bucketName) body.bucket_name = opts.bucketName;

  const result = await apiRequest("/object-storage/access-keys", "POST", body);
  console.log(JSON.stringify(result, null, 2));
}

function extractBucketList(data: unknown): StorageBucket[] {
  if (Array.isArray(data)) return data as StorageBucket[];
  const obj = data as Record<string, unknown> | undefined;
  if (!obj) return [];
  return (
    (obj.data as StorageBucket[]) ||
    (obj.buckets as StorageBucket[]) ||
    []
  );
}

function extractKeyList(data: unknown): AccessKey[] {
  if (Array.isArray(data)) return data as AccessKey[];
  const obj = data as Record<string, unknown> | undefined;
  if (!obj) return [];
  return (
    (obj.data as AccessKey[]) ||
    (obj.access_keys as AccessKey[]) ||
    []
  );
}
