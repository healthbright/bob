#!/bin/bash
# Bob - Claude Code Enhancement Shell wrapper
# No licensing required - free and open source

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

exec uv run --python 3.12 --no-project --with rich python -m launcher "$@"
