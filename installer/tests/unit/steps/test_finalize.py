"""Tests for finalize step."""

from __future__ import annotations

import tempfile
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest


class TestGetBobVersion:
    """Test _get_bob_version function."""

    @patch("installer.steps.finalize.subprocess.run")
    def test_returns_version_from_bob_binary(self, mock_run):
        """_get_bob_version returns version from bob --version output."""
        from installer.steps.finalize import _get_bob_version

        mock_run.return_value = MagicMock(
            returncode=0,
            stdout="Bob v5.2.3",
        )

        with tempfile.TemporaryDirectory() as tmpdir:
            with patch("installer.steps.finalize.Path.home", return_value=Path(tmpdir)):
                bin_dir = Path(tmpdir) / ".bob" / "bin"
                bin_dir.mkdir(parents=True)
                bob_path = bin_dir / "bob"
                bob_path.write_text("#!/bin/bash\necho 'Bob v5.2.3'")

                version = _get_bob_version()
                assert version == "5.2.3"

    @patch("installer.steps.finalize.subprocess.run")
    def test_returns_dev_version_from_bob_binary(self, mock_run):
        """_get_bob_version returns dev version from bob --version output."""
        from installer.steps.finalize import _get_bob_version

        mock_run.return_value = MagicMock(
            returncode=0,
            stdout="Bob vdev-abc1234-20260125",
        )

        with tempfile.TemporaryDirectory() as tmpdir:
            with patch("installer.steps.finalize.Path.home", return_value=Path(tmpdir)):
                bin_dir = Path(tmpdir) / ".bob" / "bin"
                bin_dir.mkdir(parents=True)
                bob_path = bin_dir / "bob"
                bob_path.write_text("#!/bin/bash")

                version = _get_bob_version()
                assert version == "dev-abc1234-20260125"

    def test_returns_fallback_when_bob_not_found(self):
        """_get_bob_version returns installer version when bob not found."""
        from installer import __version__
        from installer.steps.finalize import _get_bob_version

        with tempfile.TemporaryDirectory() as tmpdir:
            with patch("installer.steps.finalize.Path.home", return_value=Path(tmpdir)):
                version = _get_bob_version()
                assert version == __version__


class TestFinalizeStep:
    """Test FinalizeStep class."""

    def test_finalize_step_has_correct_name(self):
        """FinalizeStep has name 'finalize'."""
        from installer.steps.finalize import FinalizeStep

        step = FinalizeStep()
        assert step.name == "finalize"

    def test_check_always_returns_false(self):
        """check() always returns False (always runs)."""
        from installer.context import InstallContext
        from installer.steps.finalize import FinalizeStep
        from installer.ui import Console

        step = FinalizeStep()
        with tempfile.TemporaryDirectory() as tmpdir:
            project_dir = Path(tmpdir)
            ctx = InstallContext(
                project_dir=project_dir,
                ui=Console(non_interactive=True),
            )

            assert step.check(ctx) is False


class TestFinalSuccessPanel:
    """Test final success panel display."""

    def test_run_displays_success_message(self):
        """run() displays success panel."""
        from installer.context import InstallContext
        from installer.steps.finalize import FinalizeStep
        from installer.ui import Console

        step = FinalizeStep()
        with tempfile.TemporaryDirectory() as tmpdir:
            project_dir = Path(tmpdir)
            (project_dir / ".claude").mkdir()

            console = Console(non_interactive=True)
            ctx = InstallContext(
                project_dir=project_dir,
                ui=console,
            )

            with patch.object(console, "next_steps") as mock_next_steps:
                step.run(ctx)

                mock_next_steps.assert_called()
