/**
 * GPU stock query command.
 * Query available GPU instances across regions.
 *
 * @see https://docs.hyperstack.cloud/docs/api-reference/stock/ — Stock API reference
 * @see https://docs.hyperstack.cloud/docs/hardware/gpu-stock-information/ — GPU stock information guide
 */

import { apiRequest } from "../api.js";
import { formatConfigs } from "../utils.js";
import type { StockRegion, GpuModel } from "../types.js";

interface StockRow {
  region: string;
  model: string;
  available: string;
  configs: string;
}

/**
 * Query GPU stock with optional filtering by region, GPU model, and availability.
 * Returns a table of available GPU configurations across all regions.
 * @param opts — Filter options.
 * @param opts.region — Filter by region name (case-insensitive partial match).
 * @param opts.gpu — Filter by GPU model name (case-insensitive partial match).
 * @param opts.availableOnly — If true, only show GPUs with available instances.
 * @param isJsonOutput — If true, output as JSON instead of table.
 * @see https://docs.hyperstack.cloud/docs/api-reference/stock/#get-gpu-stock — GET /core/stocks
 */
export async function queryStock(opts: {
  region?: string;
  gpu?: string;
  availableOnly?: boolean;
}, isJsonOutput?: boolean): Promise<void> {
  const data = await apiRequest("/core/stocks");
  let list: StockRegion[];
  if (Array.isArray(data)) {
    list = data as unknown as StockRegion[];
  } else {
    const obj = data as Record<string, unknown> | undefined;
    const stocks = obj?.stocks;
    const nestedData = obj?.data;
    if (Array.isArray(stocks)) {
      list = stocks as StockRegion[];
    } else if (nestedData && typeof nestedData === "object" && "stocks" in (nestedData as object)) {
      const inner = (nestedData as Record<string, unknown>).stocks;
      list = Array.isArray(inner) ? (inner as StockRegion[]) : [];
    } else if (Array.isArray(nestedData)) {
      list = nestedData as StockRegion[];
    } else {
      list = [];
    }
  }

  const regionQuery = opts.region?.trim().toLowerCase() ?? "";
  const gpuQuery = opts.gpu?.trim().toLowerCase() ?? "";
  const rows: StockRow[] = [];

  for (const item of list) {
    let region = "";
    if (typeof item.region === "string") {
      region = item.region.trim();
    } else if (item.region) {
      region = (item.region.name ?? "").trim();
    }
    if (regionQuery && !region.toLowerCase().includes(regionQuery)) continue;

    const models = item.models || [];
    for (const m of models) {
      const modelVal = m.model ?? m.name;
      const model = typeof modelVal === "string" ? modelVal.trim() : "";
      if (gpuQuery && !model.toLowerCase().includes(gpuQuery)) continue;

      const availableVal = m.available ?? "0";
      const available = typeof availableVal === "string" ? availableVal.trim() : String(availableVal);
      if (opts.availableOnly && (available === "0" || available === "")) continue;

      rows.push({
        region,
        model,
        available,
        configs: formatConfigs(m.configurations),
      });
    }
  }

  if (isJsonOutput) {
    console.log(JSON.stringify(rows, null, 2));
  } else {
    console.table(rows);
  }
}
