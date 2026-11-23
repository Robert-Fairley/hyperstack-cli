# hs — HyperStack CLI

CLI tool for managing HyperStack GPU cloud instances. Hibernate and restore VMs, query GPU stock, SSH into instances, and create port tunnels.

## Installation

### npm (global)

```bash
npm install -g .
```

### From source

```bash
git clone <repo-url>
cd hs
npm install
npm run build
# Add to PATH or symlink:
ln -s $(pwd)/dist/cli.js /usr/local/bin/hs
```

## Usage

```bash
# Set your API key (required)
export HYPERSTACK_API_KEY="your-key-here"

# Optional: set SSH key path
export HYPERSTACK_SSH_KEY=~/.ssh/llm

# List all VMs
hs status

# Hibernate a VM (stop billing, preserve state)
hs hibernate i-abc123

# Hibernate but keep the public IP
hs hibernate i-abc123 --retain-ip

# Restore a hibernated VM
hs restore i-abc123

# Query GPU availability
hs stock -g h100          # Filter by GPU model
hs stock -r us-east       # Filter by region
hs stock -a               # Available only

# SSH into a VM
hs ssh my-vm              # Default user: ubuntu
hs ssh my-vm root         # Custom user

# Create an SSH tunnel
hs tunnel my-vm 8000 8000  # localhost:8000 → VM:8000
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HYPERSTACK_API_KEY` | Yes | API key for HyperStack REST API |
| `HYPERSTACK_SSH_KEY` | No | Path to SSH private key (used with `-i` flag) |

## Documentation

- [AGENTS.md](./AGENTS.md) — Agent context and architecture overview
- [DEVELOPMENT.md](./DEVELOPMENT.md) — Developer notes, API reference, contributing guide

## Legal Disclaimer

This software is provided "as is" without warranty of any kind, express or implied. The authors and contributors are not responsible for any data loss, service disruption, or financial damage resulting from the use of this tool.

Use at your own risk. Always verify API responses and command effects before executing destructive operations (e.g., hibernate, delete).

## License

[MIT License](LICENSE) • Free Software

© 2026 Lleu Labs Inc. / Robert Fairley

