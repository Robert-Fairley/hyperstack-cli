/**
 * HyperStack API client module.
 * Handles all communication with the HyperStack REST API.
 */

export const BASE_URL = "https://infrahub-api.nexgencloud.com/v1";

export function getApiKey(): string {
  const key = process.env.HYPERSTACK_API_KEY;
  if (!key) {
    console.error("Error: HYPERSTACK_API_KEY environment variable is required.");
    process.exit(1);
  }
  return key;
}

/**
 * Make a request to the HyperStack API.
 * Returns parsed JSON response or throws on error.
 */
export async function apiRequest(path: string): Promise<unknown> {
  const apiKey = getApiKey();

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      api_key: apiKey,
    },
  });

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
