/**
 * Object storage commands.
 * List buckets and manage S3-compatible access keys.
 *
 * @see https://docs.hyperstack.cloud/docs/api-reference/section-object-storage/ — Object Storage API section
 * @see https://docs.hyperstack.cloud/docs/api-reference/buckets/ — Buckets endpoint
 * @see https://docs.hyperstack.cloud/docs/api-reference/access-keys/ — Access Keys endpoint
 * @see https://docs.hyperstack.cloud/docs/storage/object-storage/ — Object Storage guide
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
 * List object storage buckets in a table format.
 * Displays name, region, and creation date for each bucket.
 * @param isJsonOutput — If true, output as JSON instead of table.
 * @see https://docs.hyperstack.cloud/docs/api-reference/buckets/#get-buckets — GET /object-storage/buckets
 */
export async function listBuckets(isJsonOutput?: boolean): Promise<void> {
  const data = await apiRequest("/object-storage/buckets");
  const buckets = extractBucketList(data);

  const rows: BucketRow[] = buckets.map((b) => ({
    name: b.name ?? "-",
    region: b.region || "-",
    created_at: b.created_at || "-",
  }));

  if (isJsonOutput) {
    console.log(JSON.stringify(rows, null, 2));
  } else {
    console.table(rows);
  }
}

/**
 * Create a new object storage bucket.
 * @param name — Bucket name (must be globally unique).
 * @param region — Optional region for the bucket.
 * @param isJsonOutput — If true, output as JSON instead of default format.
 * @see https://docs.hyperstack.cloud/docs/api-reference/buckets/#create-bucket — POST /object-storage/buckets
 */
export async function createBucket(name: string, region?: string, isJsonOutput?: boolean): Promise<void> {
  const body: Record<string, unknown> = { name };
  if (region) body.region = region;

  const result = await apiRequest("/object-storage/buckets", "POST", body);
  if (isJsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log("Bucket created successfully");
  }
}

/**
 * Delete an object storage bucket.
 * @param name — Bucket name to delete.
 * @param isJsonOutput — If true, output as JSON instead of default format.
 * @see https://docs.hyperstack.cloud/docs/api-reference/buckets/#delete-bucket — DELETE /object-storage/buckets/{name}
 */
export async function deleteBucket(name: string, isJsonOutput?: boolean): Promise<void> {
  const result = await apiRequest(`/object-storage/buckets/${name}`, "DELETE");
  if (isJsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log("Bucket deleted successfully");
  }
}

/**
 * List S3-compatible access keys in a table format.
 * Displays id, access key ID, bucket name, and status for each key.
 * @param isJsonOutput — If true, output as JSON instead of table.
 * @see https://docs.hyperstack.cloud/docs/api-reference/access-keys/#get-access-keys — GET /object-storage/access-keys
 */
export async function listAccessKeys(isJsonOutput?: boolean): Promise<void> {
  const data = await apiRequest("/object-storage/access-keys");
  const keys = extractKeyList(data);

  const rows: KeyRow[] = keys.map((k) => ({
    id: k.id ?? "-",
    access_key_id: k.access_key_id ?? "-",
    bucket_name: k.bucket_name || "-",
    status: k.status || "unknown",
  }));

  if (isJsonOutput) {
    console.log(JSON.stringify(rows, null, 2));
  } else {
    console.table(rows);
  }
}

/**
 * Create a new S3-compatible access key.
 * @param opts — Optional key configuration.
 * @param opts.bucketName — Optional bucket to scope the key to.
 * @param isJsonOutput — If true, output as JSON instead of default format.
 * @see https://docs.hyperstack.cloud/docs/api-reference/access-keys/#create-access-key — POST /object-storage/access-keys
 */
export async function createAccessKey(opts?: { bucketName?: string }, isJsonOutput?: boolean): Promise<void> {
  const body: Record<string, unknown> = {};
  if (opts?.bucketName) body.bucket_name = opts.bucketName;

  const result = await apiRequest("/object-storage/access-keys", "POST", body);
  if (isJsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log("Access key created successfully");
  }
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
