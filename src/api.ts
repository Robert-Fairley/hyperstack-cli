/**
 * HyperStack API client module.
 * Handles all communication with the HyperStack REST API.
 *
 * @see https://docs.hyperstack.cloud/docs/api-reference/introduction/ — API introduction and overview
 * @see https://docs.hyperstack.cloud/docs/api-reference/authentication/ — Authentication guide
 * @see https://docs.hyperstack.cloud/docs/api-reference/errors/ — Error envelope and status codes
 * @see https://docs.hyperstack.cloud/docs/api-reference/pagination/ — Pagination patterns
 * @see https://docs.hyperstack.cloud/docs/api-reference/rate-limits/ — Rate limits and backoff
 */

/** Base URL for the HyperStack REST API. */
export const BASE_URL = "https://infrahub-api.nexgencloud.com/v1";

/**
 * Retrieve the API key from environment variables.
 * Exits with code 1 if `HYPERSTACK_API_KEY` is not set.
 * @returns The API key string.
 * @throws Terminates process if key is missing.
 * @see https://docs.hyperstack.cloud/docs/resource-management/api-keys/ — API keys management
 */
export function getApiKey(): string {
  const key = process.env.HYPERSTACK_API_KEY;
  if (!key) {
    console.error("Error: HYPERSTACK_API_KEY environment variable is required.");
    process.exit(1);
  }
  return key;
}

/**
 * Make a request to the HyperStack REST API.
 * Automatically attaches the API key header and parses JSON responses.
 * Throws on non-2xx status codes or invalid JSON payloads.
 * @param path — API endpoint path (e.g., `/core/virtual-machines`).
 * @param method — HTTP method. Defaults to `"GET"`.
 * @param body — Optional request body for POST/PUT requests.
 * @returns Parsed JSON response as `unknown`.
 * @see https://docs.hyperstack.cloud/docs/api-reference/introduction/ — API overview
 */
export async function apiRequest(
  path: string,
  method = "GET",
  body?: Record<string, unknown>
): Promise<unknown> {
  const apiKey = getApiKey();

  const opts: RequestInit = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      api_key: apiKey,
    },
  };

  if (body && method !== "GET") {
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, opts);

  const rawText = await res.text();
  let data: unknown;

  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    const preview = rawText.slice(0, 300).replace(/\s+/g, " ").trim();
    throw new Error(
      `${res.status} ${path} returned non-JSON (${
        res.headers.get("content-type") || "unknown"
      }): ${preview}`
    );
  }

  if (!res.ok) {
    throw new Error(`${res.status} ${path}: ${JSON.stringify(data)}`);
  }

  return data;
}
