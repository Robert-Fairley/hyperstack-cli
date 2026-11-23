# AGENTS.md — HyperStack CLI Agent Guidelines

## Purpose

This file provides context for AI agents working on the `hstack` project (HyperStack CLI).

# Hard Rules

- ALWAYS ask before installing packages
- ALWAYS ask before calling CLI tools
- NEVER operate outside the scope of the project folder without permission.
- ALWAYS use built-in tools to read/edit/etc files do NOT call CLI to do this.

## Project Overview

- **Name**: `hstack`
- **Type**: TypeScript CLI tool for managing HyperStack GPU cloud instances
- **Runtime**: Node.js 20+ (ESM)
- **Build**: TypeScript (`tsc`) → outputs to `dist/`
- **No external dependencies** — uses only Node.js built-ins

## Architecture

```
src/
├── cli.ts          # Entry point — command routing & help text
├── api.ts          # API client (fetch wrapper, auth)
├── utils.ts        # SSH helpers, VM data extraction, formatting
└── commands/
    ├── vm.ts       # listVms, hibernateVm, restoreVm, getVmIp
    ├── stock.ts    # queryStock (GPU availability)
    └── ssh.ts      # sshToVm, tunnelVm
```

### Module Responsibilities

| Module | Responsibility |
|--------|---------------|
| `api.ts` | API key validation, HTTP requests to HyperStack REST API |
| `utils.ts` | SSH argument building, VM list/IP extraction, config formatting |
| `commands/vm.ts` | VM lifecycle operations (list, hibernate, restore, IP lookup) |
| `commands/stock.ts` | GPU stock queries with region/model filtering |
| `commands/ssh.ts` | SSH connections and port forwarding via `child_process.spawn` |
| `cli.ts` | Argument parsing (`parseArgs`), command dispatch, help text |

## Adding a New Command

1. Create or update a file in `src/commands/` (create a new file if the command doesn't fit existing modules)
2. Export the function from that module
3. Add a case in `cli.ts` switch statement
4. Update `printUsage()` in `cli.ts` with the new command syntax

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HYPERSTACK_API_KEY` | Yes | API key for HyperStack REST API |
| `HYPERSTACK_SSH_KEY` | No | Path to SSH private key (used with `-i` flag) |

## Key Patterns

- **VM lookup**: Accepts both numeric ID and name; tries ID first, falls back to name search
- **SSH tunneling**: Uses `127.0.0.1` (not `localhost`) in `-L` flags to avoid IPv6 issues
- **Default ports**: Tunnel defaults to port 8000
- **Error handling**: API errors throw; CLI catches and prints messages with exit code 1

## Build & Run

```bash
npm run build    # Compile TypeScript
npm run hstack       # Run via Node
```

## Installation

### npm global
```bash
npm install -g .
hstack --help
```

### From source (development)
```bash
cd /path/to/hstack
npm run build
node ./dist/cli.js <command>
```
