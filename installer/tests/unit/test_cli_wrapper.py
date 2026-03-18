"""Unit tests for CLI bob binary integration."""

from __future__ import annotations

import argparse
from pathlib import Path
from unittest.mock import patch


class TestFindBobBinary:
    """Tests for find_bob_binary function."""

    def test_find_bob_binary_returns_path_when_exists(self, tmp_path: Path) -> None:
        """find_bob_binary returns path when binary exists."""
        from installer.cli import find_bob_binary

        with patch("installer.cli.Path.home", return_value=tmp_path):
            bin_dir = tmp_path / ".bob" / "bin"
            bin_dir.mkdir(parents=True)
            (bin_dir / "bob").touch()

            path = find_bob_binary()

            assert path is not None
            assert path.name == "bob"

    def test_find_bob_binary_returns_none_when_missing(self, tmp_path: Path) -> None:
        """find_bob_binary returns None if binary doesn't exist."""
        from installer.cli import find_bob_binary

        with patch("installer.cli.Path.home", return_value=tmp_path):
            path = find_bob_binary()
            assert path is None


class TestLaunchCommand:
    """Tests for launch CLI command."""

    def test_launch_uses_bob_binary_when_available(self, tmp_path: Path) -> None:
        """launch command uses bob binary when available."""
        from installer.cli import cmd_launch

        with patch("installer.cli.subprocess.call") as mock_call:
            with patch("installer.cli.find_bob_binary") as mock_find:
                mock_find.return_value = tmp_path / ".bob" / "bin" / "bob"
                mock_call.return_value = 0

                args = argparse.Namespace(args=[])
                cmd_launch(args)

                mock_call.assert_called_once()
                call_args = mock_call.call_args[0][0]
                assert "bob" in str(call_args[0])

    def test_launch_falls_back_to_claude_when_no_binary(self) -> None:
        """launch falls back to claude when binary not found."""
        from installer.cli import cmd_launch

        with patch("installer.cli.subprocess.call") as mock_call:
            with patch("installer.cli.find_bob_binary", return_value=None):
                mock_call.return_value = 0

                args = argparse.Namespace(args=[])
                cmd_launch(args)

                call_args = mock_call.call_args[0][0]
                assert call_args[0] == "claude"

    def test_launch_passes_extra_args(self, tmp_path: Path) -> None:
        """launch passes extra arguments to claude."""
        from installer.cli import cmd_launch

        with patch("installer.cli.subprocess.call") as mock_call:
            with patch("installer.cli.find_bob_binary") as mock_find:
                mock_find.return_value = tmp_path / ".bob" / "bin" / "bob"
                mock_call.return_value = 0

                args = argparse.Namespace(args=["--model", "opus"])
                cmd_launch(args)

                call_args = mock_call.call_args[0][0]
                assert "--model" in call_args
                assert "opus" in call_args
