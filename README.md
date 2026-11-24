# hstack — HyperStack CLI

CLI tool for managing HyperStack GPU cloud instances. Hibernate and restore VMs, query GPU stock, SSH into instances, and create port tunnels.

## Installation

### npm (global)

```bash
npm install -g .
# Runs as: hstack
```


## Usage

```bash
# Set your API key (required)
export HYPERSTACK_API_KEY="your-key-here"

# Optional: set SSH key path
export HYPERSTACK_SSH_KEY=~/.ssh/llm

# Global options
hstack --help          # Show help
hstack --json          # Output all commands as JSON (shorthand: -j)

# List all VMs
hstack status
hstack status --json   # JSON output

# Hibernate a VM (stop billing, preserve state)
hstack hibernate i-abc123
hstack hibernate i-abc123 --retain-ip   # Keep the public IP

# Restore a hibernated VM
hstack restore i-abc123
hstack restore i-abc123 --public-ip     # Assign a new public IP

# Query GPU availability
hstack stock -g h100          # Filter by GPU model
hstack stock -r us-east       # Filter by region
hstack stock -a               # Available only
hstack stock --json           # JSON output

# SSH into a VM
hstack ssh my-vm              # Default user: ubuntu
hstack ssh my-vm root         # Custom user

# Create an SSH tunnel
hstack tunnel my-vm 8000 8000  # localhost:8000 → VM:8000
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

© 2026 Robert Fairley

