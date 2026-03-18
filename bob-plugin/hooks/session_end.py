#!/usr/bin/env python3
"""SessionEnd hook - completes session in Console and stops worker if last session.

1. Marks the session as completed in the Console (so the sessions tab updates)
2. Stops the worker only when the current session is the last active one
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

SESSIONS_DIR = Path.home() / ".bob" / "sessions"
SKIP_NAMES = {"default", "pipes"}
CONSOLE_URL = "http://localhost:41777"


def _complete_session() -> None:
    """Mark the current session as completed in the Console.

    Fire-and-forget — silently ignores errors. The Console may already
    be stopped or the session may not exist (e.g. private session).
    """
    session_id = os.environ.get("CLAUDE_SESSION_ID", "")
    if not session_id:
        return

    payload = json.dumps({"contentSessionId": session_id}).encode()
    req = urllib.request.Request(
        f"{CONSOLE_URL}/api/sessions/complete",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        urllib.request.urlopen(req, timeout=5)
    except Exception:
        pass


def _has_other_active_sessions() -> bool:
    """Check if any other Bob wrapper sessions are still active.

    Iterates session directories directly (no subprocess) to avoid failures
    during shutdown. Skips the current session via BOB_SESSION_ID.
    Returns True on any error (safe default: don't stop the worker).
    """
    try:
        if not SESSIONS_DIR.exists():
            return False

        my_session = os.environ.get("BOB_SESSION_ID", "")

        for entry in SESSIONS_DIR.iterdir():
            if not entry.is_dir() or entry.name in SKIP_NAMES:
                continue
            if entry.name == my_session:
                continue
            try:
                pid = int(entry.name)
            except ValueError:
                continue
            try:
                os.kill(pid, 0)
            except OSError:
                continue

            # Another wrapper PID is alive → another session exists
            return True

        return False
    except OSError:
        # Can't read directory → assume other sessions exist (safe default)
        return True


def main() -> int:
    plugin_root = os.environ.get("CLAUDE_PLUGIN_ROOT", "")
    if not plugin_root:
        return 0

    # Mark session as completed in Console (fire-and-forget)
    _complete_session()

    if _has_other_active_sessions():
        return 0

    stop_script = Path(plugin_root) / "scripts" / "worker-service.cjs"
    try:
        subprocess.run(
            ["bun", str(stop_script), "stop"],
            capture_output=True,
            text=True,
            check=False,
            timeout=15,
        )
    except subprocess.TimeoutExpired:
        pass

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
