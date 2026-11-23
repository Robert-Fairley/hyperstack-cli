#!/usr/bin/env node
/**
 * HyperStack CLI - Main entry point.
 * Routes commands to their respective handlers.
 */

import { parseArgs } from "node:util";
import { listVms, hibernateVm, restoreVm, getVmIp } from "./commands/vm.js";
import { queryStock } from "./commands/stock.js";
import { sshToVm, tunnelVm } from "./commands/ssh.js";
import { listVolumes, createVolume, attachVolume, detachVolume, deleteVolume } from "./commands/volume.js";
import { listSnapshots, createSnapshot, restoreFromSnapshot, deleteSnapshot } from "./commands/snapshot.js";
import { listFlavors, listImages, listRegions, createVm } from "./commands/vm-create.js";
import { checkCredit, billingStatus, listUsage, getDashboard } from "./commands/billing.js";
import { listFirewalls, addFirewallRule, deleteFirewallRule } from "./commands/firewall.js";
import { listBuckets, createBucket, deleteBucket, listAccessKeys, createAccessKey } from "./commands/storage.js";
import { listClusters, createCluster, deleteCluster } from "./commands/k8s.js";

function printUsage(): void {
  console.log(`HyperStack CLI - Manage your HyperStack GPU instances

Usage:
  ── VM Management ───────────────────────────────
  hs status                          List virtual machines
  hs list                            Alias for 'status'
  hs hibernate <id> [--retain-ip]    Hibernate a VM (save state, stop billing)
  hs restore <id>                    Restore a hibernated VM

  ── VM Provisioning ─────────────────────────────
  hs flavors                         List available GPU/CPU flavors
  hs images                          List available OS images
  hs regions                         List available regions
  hs vm create --flavor <id>         Create a new VM (see 'hs help vm create')

  ── Storage ─────────────────────────────────────
  hs volumes                         List block storage volumes
  hs volume create --size <gb>       Create a new volume
  hs volume attach <vol> <vm>        Attach volume to VM
  hs volume detach <vol>             Detach volume from VM
  hs volume delete <vol>             Delete a volume

  ── Snapshots ───────────────────────────────────
  hs snapshots                       List VM snapshots
  hs snapshot create <vm> [--name n] Create snapshot from VM
  hs snapshot restore <snap>         Restore VM from snapshot
  hs snapshot delete <snap>          Delete a snapshot

  ── GPU Stock ───────────────────────────────────
  hs stock [-r region] [-g gpu] [-a] Query GPU availability (--available)

  ── Billing ─────────────────────────────────────
  hs billing credits                 Check credit balance
  hs billing usage [--days <n>]      List usage history
  hs billing status                  Check account status
  hs dashboard                       Resource overview (active VMs, hourly cost)

  ── Networking ──────────────────────────────────
  hs ssh <id|name> [user]            SSH into a VM (default user: ubuntu)
  hs tunnel <id|name> [local] [remote] [user]  Forward local port to VM
  hs firewalls [--vm <id>]           List firewall rules
  hs firewall add <vm> --port <n>    Add firewall rule

  ── Object Storage ──────────────────────────────
  hs buckets                         List object storage buckets
  hs bucket create <name>            Create a bucket
  hs bucket delete <name>            Delete a bucket
  hs keys                            List S3-compatible access keys
  hs key create                      Create an access key

  ── Kubernetes ──────────────────────────────────
  hs k8s list                        List Kubernetes clusters
  hs k8s create [--nodes <n>]        Create a new cluster
  hs k8s delete <id>                 Delete a cluster

Examples:
  hs status                          # List all VMs
  hs hibernate i-abc123              # Hibernate a VM
  hs hibernate i-abc123 --retain-ip  # Hibernate but keep public IP
  hs restore i-abc123                # Restore a hibernated VM
  hs stock -g h100                   # Query H100 availability
  hs ssh my-vm                       # SSH into VM by name
  hs tunnel my-vm 8000 8000          # Tunnel localhost:8000 -> VM:8000
  hs volumes                         # List all volumes
  hs snapshots                       # List all snapshots
  hs billing credits                 # Check credit balance
  hs dashboard                       # View resource overview

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
    // ── VM Management ───────────────────────────────
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

    // ── VM Provisioning ─────────────────────────────
    case "flavors":
      await listFlavors();
      break;

    case "images":
      await listImages();
      break;

    case "regions":
      await listRegions();
      break;

    case "vm": {
      const sub = argv[1];
      if (!sub) {
        console.error("Error: 'vm' requires a subcommand");
        console.error("Usage: hs vm create --flavor <id> [--image <id>] [--name <n>] [--region <r>] [--spot]");
        process.exit(1);
      }
      switch (sub) {
        case "create": {
          const { values } = parseArgs({
            args: argv.slice(2),
            allowPositionals: true,
            strict: false,
            options: {
              flavor: { type: "string" },
              image: { type: "string" },
              name: { type: "string" },
              region: { type: "string" },
              key: { type: "string" },
              spot: { type: "boolean", default: false },
              count: { type: "string", default: "1" },
            },
          });

          const flavorId = typeof values.flavor === "string" ? values.flavor : undefined;
          const imageId = typeof values.image === "string" ? values.image : undefined;
          const name = typeof values.name === "string" ? values.name : undefined;
          const region = typeof values.region === "string" ? values.region : undefined;
          const keyName = typeof values.key === "string" ? values.key : undefined;
          const spot = values.spot === true;
          const count = parseInt(String(values.count), 10) || 1;

          await createVm({ flavorId, imageId, name, region, keyName, spot, count });
          break;
        }
        default:
          console.error(`Unknown 'vm' subcommand: ${sub}`);
          process.exit(1);
      }
      break;
    }

    // ── Storage ─────────────────────────────────────
    case "volumes":
      await listVolumes();
      break;

    case "volume": {
      const sub = argv[1];
      if (!sub) {
        console.error("Error: 'volume' requires a subcommand");
        process.exit(1);
      }
      switch (sub) {
        case "create": {
          const { values } = parseArgs({
            args: argv.slice(2),
            allowPositionals: true,
            strict: false,
            options: {
              size: { type: "string" },
              name: { type: "string" },
              region: { type: "string" },
            },
          });

          const sizeStr = typeof values.size === "string" ? values.size : undefined;
          if (!sizeStr) {
            console.error("Error: --size is required");
            process.exit(1);
          }
          await createVolume({
            sizeGb: parseInt(sizeStr, 10),
            name: typeof values.name === "string" ? values.name : undefined,
            region: typeof values.region === "string" ? values.region : undefined,
          });
          break;
        }
        case "attach": {
          const volId = argv[2];
          const vmId = argv[3];
          if (!volId || !vmId) {
            console.error("Error: volume ID and VM ID are required");
            process.exit(1);
          }
          await attachVolume(volId, vmId);
          break;
        }
        case "detach":
          await detachVolume(argv[2] ?? "");
          break;
        case "delete":
          await deleteVolume(argv[2] ?? "");
          break;
        default:
          console.error(`Unknown 'volume' subcommand: ${sub}`);
          process.exit(1);
      }
      break;
    }

    // ── Snapshots ───────────────────────────────────
    case "snapshots":
      await listSnapshots();
      break;

    case "snapshot": {
      const sub = argv[1];
      if (!sub) {
        console.error("Error: 'snapshot' requires a subcommand");
        process.exit(1);
      }
      switch (sub) {
        case "create": {
          const vmId = argv[2];
          if (!vmId) {
            console.error("Error: VM ID is required");
            process.exit(1);
          }
          const { values } = parseArgs({
            args: argv.slice(3),
            allowPositionals: true,
            strict: false,
            options: { name: { type: "string" } },
          });
          const name = typeof values.name === "string" ? values.name : undefined;
          await createSnapshot(vmId, name);
          break;
        }
        case "restore":
          await restoreFromSnapshot(argv[2] ?? "");
          break;
        case "delete":
          await deleteSnapshot(argv[2] ?? "");
          break;
        default:
          console.error(`Unknown 'snapshot' subcommand: ${sub}`);
          process.exit(1);
      }
      break;
    }

    // ── GPU Stock ───────────────────────────────────
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

    // ── Billing ─────────────────────────────────────
    case "billing": {
      const sub = argv[1];
      if (!sub) {
        console.error("Error: 'billing' requires a subcommand");
        process.exit(1);
      }
      switch (sub) {
        case "credits":
          await checkCredit();
          break;
        case "usage": {
          const { values } = parseArgs({
            args: argv.slice(2),
            allowPositionals: true,
            strict: false,
            options: { days: { type: "string" } },
          });
          const days = typeof values.days === "string" ? parseInt(values.days, 10) : undefined;
          await listUsage({ days });
          break;
        }
        case "status":
          await billingStatus();
          break;
        default:
          console.error(`Unknown 'billing' subcommand: ${sub}`);
          process.exit(1);
      }
      break;
    }

    // ── Dashboard ───────────────────────────────────
    case "dashboard":
      await getDashboard();
      break;

    // ── Networking ──────────────────────────────────
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

    case "firewalls": {
      const { values } = parseArgs({
        args: argv.slice(1),
        allowPositionals: true,
        strict: false,
        options: { vm: { type: "string" } },
      });
      const vmId = typeof values.vm === "string" ? values.vm : undefined;
      await listFirewalls(vmId);
      break;
    }

    case "firewall": {
      const sub = argv[1];
      if (!sub) {
        console.error("Error: 'firewall' requires a subcommand");
        process.exit(1);
      }
      switch (sub) {
        case "add": {
          const vmId = argv[2];
          if (!vmId) {
            console.error("Error: VM ID is required");
            process.exit(1);
          }
          const { values } = parseArgs({
            args: argv.slice(3),
            allowPositionals: true,
            strict: false,
            options: {
              port: { type: "string" },
              protocol: { type: "string" },
              source: { type: "string" },
              description: { type: "string" },
            },
          });
          const port = typeof values.port === "string" ? parseInt(values.port, 10) : undefined;
          const protocol = typeof values.protocol === "string" ? values.protocol : undefined;
          const source = typeof values.source === "string" ? values.source : undefined;
          const description = typeof values.description === "string" ? values.description : undefined;
          await addFirewallRule(vmId, { port, protocol, source, description });
          break;
        }
        case "delete": {
          const vmId = argv[2];
          const ruleId = argv[3];
          if (!vmId || !ruleId) {
            console.error("Error: VM ID and rule ID are required");
            process.exit(1);
          }
          await deleteFirewallRule(vmId, ruleId);
          break;
        }
        default:
          console.error(`Unknown 'firewall' subcommand: ${sub}`);
          process.exit(1);
      }
      break;
    }

    // ── Object Storage ──────────────────────────────
    case "buckets":
      await listBuckets();
      break;

    case "bucket": {
      const sub = argv[1];
      if (!sub) {
        console.error("Error: 'bucket' requires a subcommand");
        process.exit(1);
      }
      switch (sub) {
        case "create":
          await createBucket(argv[2] ?? "", typeof argv[3] === "string" ? argv[3] : undefined);
          break;
        case "delete":
          await deleteBucket(argv[2] ?? "");
          break;
        default:
          console.error(`Unknown 'bucket' subcommand: ${sub}`);
          process.exit(1);
      }
      break;
    }

    case "keys":
      await listAccessKeys();
      break;

    case "key": {
      const sub = argv[1];
      if (!sub) {
        console.error("Error: 'key' requires a subcommand");
        process.exit(1);
      }
      switch (sub) {
        case "create":
          await createAccessKey();
          break;
        default:
          console.error(`Unknown 'key' subcommand: ${sub}`);
          process.exit(1);
      }
      break;
    }

    // ── Kubernetes ──────────────────────────────────
    case "k8s": {
      const sub = argv[1];
      if (!sub) {
        console.error("Error: 'k8s' requires a subcommand");
        process.exit(1);
      }
      switch (sub) {
        case "list":
          await listClusters();
          break;
        case "create": {
          const { values } = parseArgs({
            args: argv.slice(2),
            allowPositionals: true,
            strict: false,
            options: {
              name: { type: "string" },
              region: { type: "string" },
              nodes: { type: "string" },
              version: { type: "string" },
            },
          });
          const nodeCount = typeof values.nodes === "string" ? parseInt(values.nodes, 10) : undefined;
          await createCluster({
            name: typeof values.name === "string" ? values.name : undefined,
            region: typeof values.region === "string" ? values.region : undefined,
            nodeCount,
            k8sVersion: typeof values.version === "string" ? values.version : undefined,
          });
          break;
        }
        case "delete":
          await deleteCluster(argv[2] ?? "");
          break;
        default:
          console.error(`Unknown 'k8s' subcommand: ${sub}`);
          process.exit(1);
      }
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
