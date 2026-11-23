#!/usr/bin/env node
/**
 * HyperStack CLI - Main entry point.
 * Routes commands to their respective handlers.
 */

import { parseArgs } from "node:util";
import { listVms, hibernateVm, restoreVm, getVmIp } from "./commands/vm.js";
import { queryStock } from "./commands/stock.js";
import { sshToVm, tunnelVm } from "./commands/ssh.js";

function printUsage(): void {
  console.log(`HyperStack CLI - Manage your HyperStack GPU instances

Usage:
  hs status                          List virtual machines
  hs list                            Alias for 'status'
  hs hibernate <id> [--retain-ip]    Hibernate a VM (save state, stop billing)
  hs restore <id>                    Restore a hibernated VM
  hs stock [-r region] [-g gpu] [-a] Query GPU availability (--available)
  hs ssh <id|name> [user]            SSH into a VM (default user: ubuntu)
  hs tunnel <id|name> [local] [remote] [user]  Forward local port to VM

Examples:
  hs status                          # List all VMs
  hs hibernate i-abc123              # Hibernate a VM
  hs hibernate i-abc123 --retain-ip  # Hibernate but keep public IP
  hs restore i-abc123                # Restore a hibernated VM
  hs stock -g h100                   # Query H100 availability
  hs ssh my-vm                       # SSH into VM by name
  hs tunnel my-vm 8000 8000          # Tunnel localhost:8000 -> VM:8000

Environment:
  HYPERSTACK_API_KEY    Required API key for HyperStack API
  HYPERSTACK_SSH_KEY    Optional path to SSH private key (-i flag)

For development notes, see DEVELOPMENT.md`);
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const cmd = argv[0];

  if (!cmd) {
    printUsage();
    return;
  }

  switch (cmd) {
    case "status":
    case "list":
      await listVms();
      break;

    case "hibernate": {
      const vmId = argv[1];
      if (!vmId) {
        console.error("Error: VM ID is required");
        console.error("Usage: hs hibernate <id> [--retain-ip]");
        process.exit(1);
      }
      await hibernateVm(vmId, argv.includes("--retain-ip"));
      break;
    }

    case "restore": {
      const vmId = argv[1];
      if (!vmId) {
        console.error("Error: VM ID is required");
        console.error("Usage: hs restore <id>");
        process.exit(1);
      }
      await restoreVm(vmId);
      break;
    }

    case "stock": {
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

      const opts: Record<string, unknown> = {};
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

      await queryStock(opts as { region?: string; gpu?: string; availableOnly?: boolean });
      break;
    }

    case "ssh": {
      const vmId = argv[1];
      if (!vmId) {
        console.error("Error: VM ID or name is required");
        console.error("Usage: hs ssh <id|name> [user]");
        process.exit(1);
      }
      await sshToVm(vmId, argv[2] || "ubuntu");
      break;
    }

    case "tunnel": {
      const vmId = argv[1];
      if (!vmId) {
        console.error("Error: VM ID or name is required");
        console.error("Usage: hs tunnel <id|name> [local] [remote] [user]");
        process.exit(1);
      }
      await tunnelVm(
        vmId,
        argv[2] || "8000",
        argv[3] || "8000",
        argv[4] || "ubuntu"
      );
      break;
    }

    default:
      console.error(`Unknown command: ${cmd}`);
      console.error("");
      printUsage();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
