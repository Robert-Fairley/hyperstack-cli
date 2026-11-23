import { spawn } from "node:child_process";
import { parseArgs } from "node:util";

const BASE_URL = "https://infrahub-api.nexgencloud.com/v1";
const API_KEY = process.env.HYPERSTACK_API_KEY;
const SSH_KEY = process.env.HYPERSTACK_SSH_KEY?.trim();

if (!API_KEY) {
  console.error("Missing HYPERSTACK_API_KEY");
  process.exit(1);
}

function buildSshArgs(extraArgs: string[], target: string): string[] {
  return [...(SSH_KEY ? ["-i", SSH_KEY] : []), ...extraArgs, target];
}

async function request(path: string): Promise<any> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      api_key: API_KEY!,
    },
  });

  const rawText = await res.text();
  let data: any;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    const preview = rawText.slice(0, 300).replace(/\s+/g, " ").trim();
    throw new Error(
      `${res.status} ${path} returned non-JSON (${res.headers.get("content-type") || "unknown"}): ${preview}`
    );
  }

  if (!res.ok) {
    throw new Error(`${res.status} ${path}: ${JSON.stringify(data)}`);
  }

  return data;
}

function extractVmList(data: any): any[] {
  if (Array.isArray(data)) return data;
  return data?.instances || data?.virtual_machines || data?.data || [];
}

function extractVmIp(vm: any): string | undefined {
  return vm?.floating_ip || vm?.public_ip || vm?.ip_address;
}

async function listVms() {
  const data = await request("/core/virtual-machines");
  const vms = extractVmList(data);
  console.table(
    vms.map((vm: any) => ({
      id: vm.id,
      name: vm.name,
      status: vm.status || vm.vm_state,
      region: vm.region?.name || vm.region,
      ip: extractVmIp(vm) || "-",
    }))
  );
}

async function hibernateVm(vmId: string, retainIp = false) {
  const url = retainIp
    ? `/core/virtual-machines/${vmId}/hibernate?retain_ip=true`
    : `/core/virtual-machines/${vmId}/hibernate`;
  console.log(await request(url));
}

async function restoreVm(vmId: string) {
  console.log(await request(`/core/virtual-machines/${vmId}/hibernate-restore`));
}

function formatConfigs(configs: any): string {
  if (!configs || typeof configs !== "object") return "-";
  const parts = Object.entries(configs)
    .filter(([, count]) => Number(count) > 0)
    .map(([size, count]) => `${size}:${count}`);
  return parts.length > 0 ? parts.join(", ") : "-";
}

async function queryStock(opts: {
  region?: string;
  gpu?: string;
  availableOnly?: boolean;
}) {
  const data = await request("/core/stocks");
  const list = Array.isArray(data)
    ? data
    : data.stocks || data.data?.stocks || data.data || [];

  const regionQuery = opts.region?.trim().toLowerCase() ?? "";
  const gpuQuery = opts.gpu?.trim().toLowerCase() ?? "";

  const rows: Array<{
    region: string;
    model: string;
    available: string;
    configs: string;
  }> = [];

  for (const item of list) {
    const region = String(item.region?.name ?? item.region ?? "").trim();
    if (regionQuery && !region.toLowerCase().includes(regionQuery)) continue;

    for (const m of item.models || []) {
      const model = String(m.model ?? m.name ?? "").trim();
      if (gpuQuery && !model.toLowerCase().includes(gpuQuery)) continue;

      const available = String(m.available ?? "0").trim();
      if (opts.availableOnly && (available === "0" || available === "")) {
        continue;
      }

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

async function getVmIp(vmIdOrName: string): Promise<string> {
  if (/^\d+$/.test(vmIdOrName)) {
    const data = await request(`/core/virtual-machines/${vmIdOrName}`);
    const vm = data?.instance || data?.virtual_machine || data?.data || data;
    const ip = extractVmIp(vm);
    if (!ip) throw new Error(`No IP for VM ${vmIdOrName}`);
    return ip;
  }

  const listData = await request("/core/virtual-machines");
  const vms = extractVmList(listData);
  const match = vms.find(
    (vm: any) =>
      String(vm.id) === vmIdOrName ||
      String(vm.name ?? "").toLowerCase() === vmIdOrName.toLowerCase()
  );

  if (!match) {
    throw new Error(`No VM found matching "${vmIdOrName}"`);
  }

  const ip = extractVmIp(match);
  if (!ip) {
    throw new Error(`No IP for VM "${vmIdOrName}" (id: ${match.id})`);
  }
  return ip;
}

async function sshToVm(vmId: string, user = "ubuntu") {
  const ip = await getVmIp(vmId);
  const child = spawn("ssh", buildSshArgs([], `${user}@${ip}`), {
    stdio: "inherit",
  });
  child.on("exit", (code) => process.exit(code ?? 0));
}

async function tunnelVm(
  vmId: string,
  localPort: string,
  remotePort: string,
  user = "ubuntu"
) {
  const ip = await getVmIp(vmId);
  const child = spawn(
    "ssh",
    buildSshArgs(["-N", "-L", `${localPort}:localhost:${remotePort}`], `${user}@${ip}`),
    { stdio: "inherit" }
  );
  child.on("exit", (code) => process.exit(code ?? 0));
}

function printUsage() {
  console.log(`Usage:
  list | status                           List virtual machines
  hibernate <id> [--retain-ip]            Hibernate a VM
  restore <id>                            Restore a hibernated VM
  stock [-r region] [-g gpu] [-a]         Query GPU stock (--available)
  ssh <id|name> [user]                    SSH into a VM (default: ubuntu)
  tunnel <id|name> [local] [remote] [user]  Forward local port to VM

Env:
  HYPERSTACK_API_KEY                      Required API key
  HYPERSTACK_SSH_KEY                      Optional path to SSH private key (-i)`);
}

async function main() {
  const argv = process.argv.slice(2);
  const cmd = argv[0];

  if (cmd === "status" || cmd === "list") {
    await listVms();
  } else if (cmd === "hibernate") {
    await hibernateVm(argv[1]!, argv.includes("--retain-ip"));
  } else if (cmd === "restore") {
    await restoreVm(argv[1]!);
  } else if (cmd === "stock") {
    const { values } = parseArgs({
      args: argv.slice(1),
      allowPositionals: true,
      strict: false,
      options: {
        region: { type: "string", short: "r" },
        gpu: { type: "string", short: "g" },
        card: { type: "string" },
        model: { type: "string" },
        available: { type: "boolean", short: "a" },
      },
    });

    const opts: { region?: string; gpu?: string; availableOnly?: boolean } = {};
    const regionVal = typeof values.region === "string" ? values.region : undefined;
    const gpuVal =
      typeof values.gpu === "string"
        ? values.gpu
        : typeof values.card === "string"
          ? values.card
          : typeof values.model === "string"
            ? values.model
            : undefined;

    if (regionVal !== undefined) opts.region = regionVal;
    if (gpuVal !== undefined) opts.gpu = gpuVal;
    if (values.available === true) opts.availableOnly = true;

    await queryStock(opts);
  } else if (cmd === "ssh") {
    await sshToVm(argv[1]!, argv[2] || "ubuntu");
  } else if (cmd === "tunnel") {
    await tunnelVm(argv[1]!, argv[2] || "8080", argv[3] || "8080", argv[4] || "ubuntu");
  } else {
    printUsage();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
