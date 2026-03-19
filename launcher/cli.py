"""Bob CLI - simple Claude Code wrapper with no licensing."""

from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path


def get_bob_dir() -> Path:
    """Get the bob home directory."""
    return Path.home() / ".bob"


def get_plugin_dir() -> Path:
    """Get the bob plugin directory."""
    return Path.home() / ".claude" / "bob"


def print_banner() -> None:
    """Print the Bob the Builder banner."""
    banner = """
\033[1;33m  ██████╗  ██████╗ ██████╗ \033[0m
\033[1;33m  ██╔══██╗██╔═══██╗██╔══██╗\033[0m
\033[1;33m  ██████╔╝██║   ██║██████╔╝\033[0m
\033[1;33m  ██╔══██╗██║   ██║██╔══██╗\033[0m
\033[1;33m  ██████╔╝╚██████╔╝██████╔╝\033[0m
\033[1;33m  ╚═════╝  ╚═════╝ ╚═════╝ \033[0m

  \033[1;36mCan we fix it? Yes we can!\033[0m
  Claude Code Enhancement Shell — Free & Open Source
"""
    print(banner)


def cmd_launch(args: list[str]) -> int:
    """Launch Claude Code with bob enhancements."""
    print_banner()

    # Set session environment variables
    session_id = str(os.getpid())
    env = os.environ.copy()
    env["BOB_SESSION_ID"] = session_id
    env["CLAUDE_CODE_TASK_LIST_ID"] = f"bob-{session_id}"

    # Create session directory
    session_dir = get_bob_dir() / "sessions" / session_id
    session_dir.mkdir(parents=True, exist_ok=True)

    try:
        cmd = ["claude"] + args
        return subprocess.call(cmd, env=env)
    finally:
        # Cleanup session directory
        import shutil

        shutil.rmtree(session_dir, ignore_errors=True)


def cmd_version() -> int:
    """Show version information."""
    print("bob v1.0.0 — Claude Code Enhancement Shell")
    return 0


def cmd_statusline() -> int:
    """Run the statusline (reads JSON from stdin, outputs formatted status)."""
    from launcher.statusline import main as statusline_main

    statusline_main()
    return 0


def main() -> None:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        prog="bob",
        description="Bob — Claude Code Enhancement Shell",
    )
    parser.add_argument("--version", action="store_true", help="Show version")
    parser.add_argument("--skip-update-check", action="store_true", help="Skip update check")

    subparsers = parser.add_subparsers(dest="command")
    subparsers.add_parser("statusline", help="Output status line")

    args, remaining = parser.parse_known_args()

    if args.version:
        sys.exit(cmd_version())
    elif args.command == "statusline":
        sys.exit(cmd_statusline())
    else:
        sys.exit(cmd_launch(remaining))


if __name__ == "__main__":
    main()
