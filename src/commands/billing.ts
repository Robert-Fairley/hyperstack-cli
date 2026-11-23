/**
 * Billing commands.
 * Check credit balance, usage history, and account status.
 */

import { apiRequest } from "../api.js";
import type { CreditBalance, BillingRecord, DashboardSummary } from "../types.js";

interface CreditRow {
  balance: string;
  currency: string;
}

interface UsageRow {
  date: string;
  resource: string;
  amount: string;
  description: string;
}

/**
 * Check account credit balance.
 */
export async function checkCredit(): Promise<void> {
  const data = await apiRequest("/billing/credit");
  const balance = data as CreditBalance | undefined;

  const row: CreditRow = {
    balance: String(balance?.balance ?? "0"),
    currency: balance?.currency ?? "USD",
  };

  console.table(row);
}

/**
 * Get account billing status (alive check).
 */
export async function billingStatus(): Promise<void> {
  const data = await apiRequest("/billing/alive");
  console.log(JSON.stringify(data, null, 2));
}

/**
 * List usage history with optional date range.
 */
export async function listUsage(opts?: { days?: number }): Promise<void> {
  const data = await apiRequest("/billing/billing");
  const records = extractBillingList(data);

  const rows: UsageRow[] = records.map((r) => ({
    date: r.started_at || r.id || "-",
    resource: `${r.resource_type ?? "?"}/${String(r.resource_id ?? "?")}`,
    amount: `${r.amount ?? 0} ${r.currency ?? ""}`,
    description: r.description || "-",
  }));

  console.table(rows);
}

/**
 * Get dashboard summary (active VMs, hourly cost).
 */
export async function getDashboard(): Promise<void> {
  const data = await apiRequest("/dashboard");
  const summary = data as DashboardSummary | undefined;

  const row: Record<string, string | number> = {
    active_vms: summary?.active_vms ?? 0,
    hourly_cost: summary?.hourly_cost ?? 0,
    total_volumes: summary?.total_volumes ?? 0,
    currency: summary?.currency ?? "USD",
  };

  console.table(row);
}

function extractBillingList(data: unknown): BillingRecord[] {
  if (Array.isArray(data)) return data as BillingRecord[];
  const obj = data as Record<string, unknown> | undefined;
  if (!obj) return [];
  return (
    (obj.data as BillingRecord[]) ||
    (obj.billing as BillingRecord[]) ||
    []
  );
}
