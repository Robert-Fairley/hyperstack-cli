/**
 * GPU stock query command.
 * Query available GPU instances across regions.
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
 * Query GPU stock with optional filtering.
 */
export async function queryStock(opts: {
  region?: string;
  gpu?: string;
  availableOnly?: boolean;
}): Promise<void> {
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

  console.table(rows);
}
