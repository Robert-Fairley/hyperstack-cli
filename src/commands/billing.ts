/**
 * Billing commands.
 * Check credit balance, usage history, and account status.
 *
 * @see https://docs.hyperstack.cloud/docs/api-reference/section-billing/ — Billing API section
 * @see https://docs.hyperstack.cloud/docs/api-reference/credit/ — Credit balance endpoint
 * @see https://docs.hyperstack.cloud/docs/api-reference/billing/ — Usage history endpoint
 * @see https://docs.hyperstack.cloud/docs/api-reference/billing-ai-studio/ — AI Studio billing
 * @see https://docs.hyperstack.cloud/docs/api-reference/payment/ — Payment management
 * @see https://docs.hyperstack.cloud/docs/api-reference/vouchers/ — Voucher redemption
 * @see https://docs.hyperstack.cloud/docs/api-reference/billing/#get-billing-details — Billing details endpoint
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
 * Displays current balance and currency in a table format.
 * @see https://docs.hyperstack.cloud/docs/api-reference/credit/#get-credit-balance — GET /billing/credit
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
 * Returns raw API response confirming the account is active.
 * @see https://docs.hyperstack.cloud/docs/api-reference/alive/ — Billing alive endpoint
 */
export async function billingStatus(): Promise<void> {
  const data = await apiRequest("/billing/alive");
  console.log(JSON.stringify(data, null, 2));
}

/**
 * List usage history with optional date range.
 * Displays date, resource type/ID, amount, and description for each billing record.
 * @param opts — Optional filters.
 * @param opts.days — Number of days to look back (not enforced by API).
 * @see https://docs.hyperstack.cloud/docs/api-reference/billing/#get-billing-records — GET /billing/billing
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
 * Displays a single-row table with account overview metrics.
 * @see https://docs.hyperstack.cloud/docs/api-reference/dashboard/ — Dashboard endpoint
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
