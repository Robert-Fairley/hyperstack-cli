/**
 * SSH and tunnel commands.
 * Connect to VMs via SSH or forward ports through SSH tunnels.
 *
 * @see https://docs.hyperstack.cloud/docs/network/ssh/ — SSH access guide
 */

import { spawn } from "node:child_process";
import { buildSshArgs, getSshKey } from "../utils.js";
import { getVmIp } from "./vm.js";

/**
 * SSH into a VM by ID or name, forwarding the terminal directly.
 * @param vmId — The VM ID or name to connect to.
 * @param user — SSH username. Defaults to `"ubuntu"`.
 * @see https://docs.hyperstack.cloud/docs/network/ssh/ — SSH access guide
 */
export async function sshToVm(vmId: string, user = "ubuntu"): Promise<void> {
  const ip = await getVmIp(vmId);
  const child = spawn("ssh", buildSshArgs([], `${user}@${ip}`), {
    stdio: "inherit",
  });

  child.on("exit", (code) => process.exit(code ?? 0));
}

/**
 * Create an SSH tunnel from a local port to a remote port on a VM.
 * Prints a status message before connecting. Uses `127.0.0.1` instead of
 * `localhost` to avoid IPv6 resolution issues on some systems.
 * @param vmId — The VM ID or name to tunnel through.
 * @param localPort — Local port to bind. Defaults to `"8000"`.
 * @param remotePort — Remote port on the VM. Defaults to `"8000"`.
 * @param user — SSH username. Defaults to `"ubuntu"`.
 */
export async function tunnelVm(
  vmId: string,
  localPort = "8000",
  remotePort = "8000",
  user = "ubuntu"
): Promise<void> {
  const ip = await getVmIp(vmId);

  // Use 127.0.0.1 instead of localhost to avoid IPv6 issues on some systems
  const tunnelArgs = [
    "-N",
    `-L 127.0.0.1:${localPort}:127.0.0.1:${remotePort}`,
  ];

  console.log(`Tunneling 127.0.0.1:${localPort} → ${user}@${ip}:${remotePort}`);
  console.log("Press Ctrl+C to stop the tunnel.");

  const child = spawn("ssh", buildSshArgs(tunnelArgs, `${user}@${ip}`), {
    stdio: "inherit",
  });

  child.on("exit", (code) => process.exit(code ?? 0));
}
