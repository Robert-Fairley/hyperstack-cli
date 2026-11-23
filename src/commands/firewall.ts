/**
 * Firewall management commands.
 * Create, list, and manage firewall rules on VMs.
 *
 * @see https://docs.hyperstack.cloud/docs/api-reference/firewalls/ — Firewalls API reference
 * @see https://docs.hyperstack.cloud/docs/network/firewalls/ — Firewalls guide
 */

import { apiRequest } from "../api.js";
import type { Firewall, FirewallRule } from "../types.js";

interface RuleRow {
  id: string;
  port: string;
  protocol: string;
  source: string;
  description: string;
}

/**
 * List firewalls for a VM or all firewalls globally.
 * Displays rules in table format per firewall.
 * @param vmId — Optional VM ID to list firewalls for a specific VM. Omit for global list.
 * @see https://docs.hyperstack.cloud/docs/api-reference/firewalls/#get-firewalls — GET /core/firewalls
 */
export async function listFirewalls(vmId?: string): Promise<void> {
  const path = vmId ? `/core/virtual-machines/${vmId}/firewalls` : "/core/firewalls";
  const data = await apiRequest(path);
  const firewalls = extractFirewallList(data);

  for (const fw of firewalls) {
    console.log(`\nFirewall: ${fw.name ?? fw.id ?? "unnamed"} (VM: ${fw.vm_id ?? "-"})`);
    const rules = fw.rules || [];
    if (rules.length === 0) {
      console.log("  No rules");
      continue;
    }
    const rows: RuleRow[] = rules.map((r) => ({
      id: r.id ?? "-",
      port: String(r.port ?? "*"),
      protocol: r.protocol || "tcp",
      source: r.source || "0.0.0.0/0",
      description: r.description || "-",
    }));
    console.table(rows);
  }
}

/**
 * Add a firewall rule to a VM.
 * @param vmId — The target VM ID.
 * @param opts — Rule configuration options.
 * @param opts.port — Port number to open (e.g., `443`).
 * @param opts.protocol — Protocol: `"tcp"` or `"udp"`. Defaults to `"tcp"`.
 * @param opts.source — CIDR source range. Defaults to `"0.0.0.0/0"`.
 * @param opts.description — Optional human-readable description.
 * @see https://docs.hyperstack.cloud/docs/network/firewalls/ — Firewalls guide
 * @see https://docs.hyperstack.cloud/docs/api-reference/firewalls/#create-firewall-rule — Create firewall rule endpoint
 */
export async function addFirewallRule(
  vmId: string,
  opts: { port?: number; protocol?: string; source?: string; description?: string }
): Promise<void> {
  const body: Record<string, unknown> = {};

  if (opts.port) body.port = opts.port;
  if (opts.protocol) body.protocol = opts.protocol;
  if (opts.source) body.source = opts.source;
  if (opts.description) body.description = opts.description;

  const result = await apiRequest(`/core/virtual-machines/${vmId}/firewalls`, "POST", body);
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Delete a firewall rule from a VM.
 * @param vmId — The target VM ID.
 * @param ruleId — The firewall rule ID to delete.
 * @see https://docs.hyperstack.cloud/docs/api-reference/firewalls/#delete-firewall-rule — DELETE /core/firewalls/{id}
 */
export async function deleteFirewallRule(vmId: string, ruleId: string): Promise<void> {
  const result = await apiRequest(`/core/virtual-machines/${vmId}/firewalls/${ruleId}`, "DELETE");
  console.log(JSON.stringify(result, null, 2));
}

function extractFirewallList(data: unknown): Firewall[] {
  if (Array.isArray(data)) return data as Firewall[];
  const obj = data as Record<string, unknown> | undefined;
  if (!obj) return [];
  return (
    (obj.data as Firewall[]) ||
    (obj.firewalls as Firewall[]) ||
    []
  );
}
