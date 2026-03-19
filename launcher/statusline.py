#!/usr/bin/env python3
"""Bob statusline - displays context usage, cost, and session info.

Called by Claude Code with JSON on stdin containing session data.
Writes context-pct.json for the context_monitor hook.
"""

import json
import os
import sys
from pathlib import Path


def write_context_cache(session_id: str, pct: float, window_size: int) -> None:
    """Write context percentage to session cache for hooks to read."""
    if not session_id:
        return
    import time

    cache_dir = Path.home() / ".bob" / "sessions" / session_id
    cache_dir.mkdir(parents=True, exist_ok=True)
    cache_file = cache_dir / "context-pct.json"
    try:
        cache_file.write_text(
            json.dumps(
                {
                    "pct": pct,
                    "ts": time.time(),
                    "context_window_size": window_size,
                }
            )
        )
    except OSError:
        pass


def format_duration(ms: int) -> str:
    """Format milliseconds to human-readable duration."""
    secs = ms // 1000
    if secs < 60:
        return f"{secs}s"
    mins = secs // 60
    secs = secs % 60
    if mins < 60:
        return f"{mins}m{secs:02d}s"
    hours = mins // 60
    mins = mins % 60
    return f"{hours}h{mins:02d}m"


def format_cost(cost: float) -> str:
    """Format cost as currency."""
    if cost < 0.01:
        return f"${cost:.4f}"
    return f"${cost:.2f}"


def build_bar(pct: int) -> str:
    """Build a visual progress bar."""
    filled = pct // 5
    empty = 20 - filled
    if pct >= 80:
        color = "\033[31m"  # red
    elif pct >= 60:
        color = "\033[33m"  # yellow
    else:
        color = "\033[32m"  # green
    reset = "\033[0m"
    return f"{color}{'█' * filled}{'░' * empty}{reset}"


def main() -> None:
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        print("Bob")
        return

    # Extract fields
    model_info = data.get("model", {})
    model_name = model_info.get("display_name", "unknown")

    ctx = data.get("context_window", {})
    pct = ctx.get("used_percentage") or 0
    pct_int = int(pct)
    window_size = ctx.get("context_window_size") or 200000

    cost_info = data.get("cost", {})
    cost = cost_info.get("total_cost_usd") or 0
    duration_ms = cost_info.get("total_duration_ms") or 0
    lines_added = cost_info.get("total_lines_added") or 0
    lines_removed = cost_info.get("total_lines_removed") or 0

    session_id = data.get("session_id", "")

    # Write cache for context_monitor hook
    bob_session_id = os.environ.get("BOB_SESSION_ID", session_id)
    write_context_cache(bob_session_id, pct, window_size)

    # Build statusline output
    bar = build_bar(pct_int)
    cost_str = format_cost(cost)
    dur_str = format_duration(int(duration_ms))

    # Lines changed
    lines = ""
    if lines_added or lines_removed:
        lines = f" | \033[32m+{lines_added}\033[0m/\033[31m-{lines_removed}\033[0m"

    # Window size indicator
    window_label = ""
    if window_size >= 1_000_000:
        window_label = " 1M"
    elif window_size > 200_000:
        window_label = f" {window_size // 1000}K"

    print(f"\033[1;33mBob\033[0m {bar} {pct_int}%{window_label} | {cost_str} | {dur_str}{lines} | {model_name}")


if __name__ == "__main__":
    main()
