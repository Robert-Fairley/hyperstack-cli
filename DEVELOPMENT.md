# DEVELOPMENT.md — HyperStack CLI Developer Notes

## Quick Start

```bash
# Install dependencies
npm install

# Build
npm run build

# Run
npm run hs status
```

## Project Structure

```
hs/
├── src/
│   ├── cli.ts          # Entry point — command routing & help text
│   ├── api.ts          # API client (fetch wrapper, auth)
│   ├── utils.ts        # SSH helpers, VM data extraction, formatting
│   └── commands/
│       ├── vm.ts       # listVms, hibernateVm, restoreVm, getVmIp
│       ├── stock.ts    # queryStock (GPU availability)
│       └── ssh.ts      # sshToVm, tunnelVm
├── dist/               # Compiled output (gitignored)
├── package.json
├── tsconfig.json
├── AGENTS.md           # Agent context
├── DEVELOPMENT.md      # This file
└── README.md           # User-facing docs
```

## TypeScript Configuration

- **Module**: `NodeNext` (ESM)
- **Target**: `ES2022`
- **Strict mode**: Enabled
- **Source maps**: Enabled for debugging

## Adding a New Command

### 1. Create or update the command module

If the command fits an existing module (`vm.ts`, `stock.ts`, `ssh.ts`), add the function there. Otherwise, create a new file in `src/commands/`.

```typescript
// src/commands/my-new-feature.ts
import { apiRequest } from "../api.js";

export async function myNewCommand(arg: string): Promise<void> {
  const data = await apiRequest(`/my/endpoint/${arg}`);
  console.log(JSON.stringify(data, null, 2));
}
```

### 2. Add routing in `cli.ts`

```typescript
import { myNewCommand } from "./commands/my-new-feature.js";

// In the switch statement:
case "mycommand": {
  const arg = argv[1];
  if (!arg) {
    console.error("Error: argument is required");
    process.exit(1);
  }
  await myNewCommand(arg);
  break;
}
```

### 3. Update help text

Add the command to `printUsage()` in `cli.ts`:

```typescript
hs mycommand <arg>    # Do something useful
```

## Testing

No test framework is configured yet. To add tests:

1. Install a test runner (e.g., `vitest` or `jest`)
2. Create test files alongside source files (`src/*.test.ts`)
3. Add test script to `package.json`

For quick manual testing:

```bash
export HYPERSTACK_API_KEY="your-key-here"
npm run hs status
npm run hs stock -g h100
```

## API Reference

### Endpoints Used

| Command | Endpoint | Method |
|---------|----------|--------|
| `status` | `/core/virtual-machines` | GET |
| `hibernate` | `/core/virtual-machines/{id}/hibernate` | POST |
| `restore` | `/core/virtual-machines/{id}/hibernate-restore` | POST |
| `stock` | `/core/stocks` | GET |

### Response Parsing

VM responses may have different shapes. The `extractVmList()` function handles:
- Direct array: `[...]`
- Wrapped in `instances`: `{ instances: [...] }`
- Wrapped in `virtual_machines`: `{ virtual_machines: [...] }`
- Wrapped in `data`: `{ data: [...] }`

IP extraction checks (in order):
1. `floating_ip`
2. `public_ip`
3. `ip_address`

## SSH Configuration

### Setting the SSH key

```bash
# Option 1: Environment variable
export HYPERSTACK_SSH_KEY=~/.ssh/llm

# Option 2: In ~/.bashrc or ~/.zshrc
echo 'export HYPERSTACK_SSH_KEY=~/.ssh/llm' >> ~/.zshrc
source ~/.zshrc
```

### Tunnel command (fixed)

The tunnel command uses `127.0.0.1` instead of `localhost` to avoid IPv6 resolution issues:

```bash
# Correct usage:
hs tunnel my-vm 8000 8000
# Equivalent to:
ssh -i ~/.ssh/llm -N -L 127.0.0.1:8000:127.0.0.1:8000 ubuntu@<vm-ip>
```

## Distribution

### npm global install

Users can install globally:

```bash
npm install -g /path/to/hs
# or from a published package
npm install -g @lleulabs/hs
```

This makes `hs` available system-wide.

### Binary release (future)

For binary distribution:
1. Use `esbuild` or `pkg` to bundle into a standalone binary
2. Cross-compile for macOS (arm64/x64), Linux (x64/arm64), Windows
3. Publish to GitHub Releases with checksums

Example with `pkg`:
```bash
npm install -D pkg
# In package.json:
# "pkg": { "assets": "node_modules/**/*", "targets": ["node20-darwin-arm64", "node20-linux-x64"] }
npx pkg . -t node20-darwin-arm64,node20-linux-x64 -o dist/bin/hs
```

## Troubleshooting

### `HYPERSTACK_API_KEY` error
Set the environment variable before running:
```bash
export HYPERSTACK_API_KEY="your-key"
```

### SSH connection fails
Check that `HYPERSTACK_SSH_KEY` points to a valid key file:
```bash
echo $HYPERSTACK_SSH_KEY
ls -la $HYPERSTACK_SSH_KEY
```

### Tunnel doesn't work
Ensure the remote port is open on the VM and firewall allows it. Test manually first:
```bash
ssh -i ~/.ssh/llm ubuntu@<vm-ip>
curl localhost:<remote-port>
```

## Contributing

1. Make changes in `src/`
2. Run `npm run build` to compile
3. Test with `npm run hs <command>`
4. Update `README.md` if adding/changing commands
5. Commit with descriptive messages
