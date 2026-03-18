"""CLI entry point and step orchestration using argparse."""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

from installer import __build__
from installer.context import InstallContext
from installer.errors import FatalInstallError, InstallationCancelled
from installer.steps.base import BaseStep
from installer.steps.claude_files import ClaudeFilesStep
from installer.steps.config_files import ConfigFilesStep
from installer.steps.dependencies import DependenciesStep
from installer.steps.finalize import FinalizeStep
from installer.steps.prerequisites import PrerequisitesStep
from installer.steps.shell_config import ShellConfigStep
from installer.steps.vscode_extensions import VSCodeExtensionsStep
from installer.ui import Console


def get_all_steps() -> list[BaseStep]:
    """Get all installation steps in order."""
    return [
        PrerequisitesStep(),
        ClaudeFilesStep(),
        ConfigFilesStep(),
        DependenciesStep(),
        ShellConfigStep(),
        VSCodeExtensionsStep(),
        FinalizeStep(),
    ]


def run_installation(ctx: InstallContext) -> None:
    """Execute all installation steps."""
    ui = ctx.ui
    steps = get_all_steps()

    if ui:
        ui.set_total_steps(len(steps))

    for step in steps:
        if ui:
            ui.step(step.name.replace("_", " ").title())

        if step.check(ctx):
            if ui:
                ui.info(f"Already complete, skipping")
            continue

        try:
            step.run(ctx)
        except KeyboardInterrupt:
            raise InstallationCancelled(step.name) from None
        ctx.mark_completed(step.name)


def cmd_install(args: argparse.Namespace) -> int:
    """Install Bob."""
    console = Console(non_interactive=args.non_interactive, quiet=args.quiet)

    effective_local_repo_dir = args.local_repo_dir if args.local_repo_dir else (Path.cwd() if args.local else None)
    project_dir = Path.cwd()

    console.banner()

    ctx = InstallContext(
        project_dir=project_dir,
        non_interactive=args.non_interactive,
        skip_env=args.skip_env,
        local_mode=args.local,
        local_repo_dir=effective_local_repo_dir,
        is_local_install=args.local_system,
        target_version=args.target_version,
        ui=console,
    )

    try:
        run_installation(ctx)
    except FatalInstallError as e:
        console.error(f"Installation failed: {e}")
        return 1
    except InstallationCancelled as e:
        console.warning(f"Installation cancelled during: {e.step_name}")
        console.info("Run the installer again to resume from where you left off")
        return 130
    except KeyboardInterrupt:
        console.warning("Installation cancelled")
        return 130

    return 0


def cmd_version(_args: argparse.Namespace) -> int:
    """Show version information."""
    print(f"bob-installer (build: {__build__})")
    return 0


def find_bob_binary() -> Path | None:
    """Find the bob binary in ~/.bob/bin/."""
    binary_path = Path.home() / ".bob" / "bin" / "bob"
    if binary_path.exists():
        return binary_path
    return None


def cmd_launch(args: argparse.Namespace) -> int:
    """Launch Claude Code via bob binary."""
    claude_args = args.args or []

    bob_path = find_bob_binary()
    if bob_path:
        cmd = [str(bob_path)] + claude_args
    else:
        cmd = ["claude"] + claude_args

    return subprocess.call(cmd)


def create_parser() -> argparse.ArgumentParser:
    """Create the argument parser."""
    parser = argparse.ArgumentParser(
        prog="installer",
        description="Bob Installer",
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    install_parser = subparsers.add_parser("install", help="Install Bob")
    install_parser.add_argument(
        "-n",
        "--non-interactive",
        action="store_true",
        help="Run without interactive prompts",
    )
    install_parser.add_argument(
        "-q",
        "--quiet",
        action="store_true",
        help="Minimal output (for updates)",
    )
    install_parser.add_argument(
        "--skip-env",
        action="store_true",
        help="Skip environment setup (API keys)",
    )
    install_parser.add_argument(
        "--local",
        action="store_true",
        help="Use local files instead of downloading",
    )
    install_parser.add_argument(
        "--local-repo-dir",
        type=Path,
        default=None,
        help="Local repository directory",
    )
    install_parser.add_argument(
        "--local-system",
        action="store_true",
        help="Install system-level dependencies via Homebrew",
    )
    install_parser.add_argument(
        "--target-version",
        type=str,
        default=None,
        help="Target version/tag for downloads (e.g., dev-abc1234-20260124)",
    )

    subparsers.add_parser("version", help="Show version information")

    launch_parser = subparsers.add_parser("launch", help="Launch Claude Code via bob binary")
    launch_parser.add_argument(
        "args",
        nargs="*",
        help="Arguments to pass to claude",
    )

    return parser


def main() -> None:
    """Main entry point."""
    parser = create_parser()
    args = parser.parse_args()

    if args.command == "install":
        sys.exit(cmd_install(args))
    elif args.command == "version":
        sys.exit(cmd_version(args))
    elif args.command == "launch":
        sys.exit(cmd_launch(args))
    else:
        parser.print_help()
        sys.exit(0)


if __name__ == "__main__":
    main()
