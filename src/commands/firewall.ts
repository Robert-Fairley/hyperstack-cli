/**
 * Firewall management commands.
 * Create, list, and manage firewall rules on VMs.
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
 * List firewalls for a VM.
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
 * Delete a firewall rule.
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
