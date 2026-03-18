#!/bin/bash

set -e

REPO="healthbright/bob"

VERSION="${VERSION:-}"
VERSION="${VERSION#v}"

INSTALLER_ARGS=""
RESTART_BOB=false
SKIP_VERSION_CHECK=false
USE_LOCAL_INSTALLER=false

while [ $# -gt 0 ]; do
	case "$1" in
	--restart-bob)
		RESTART_BOB=true
		shift
		;;
	--skip-version-check)
		SKIP_VERSION_CHECK=true
		shift
		;;
	--local)
		USE_LOCAL_INSTALLER=true
		SKIP_VERSION_CHECK=true
		shift
		;;
	*)
		if [ -z "$INSTALLER_ARGS" ]; then
			INSTALLER_ARGS="$1"
		else
			INSTALLER_ARGS="$INSTALLER_ARGS $1"
		fi
		shift
		;;
	esac
done

get_latest_release() {
	local redirect_url="https://github.com/${REPO}/releases/latest"
	local api_url="https://api.github.com/repos/${REPO}/releases/latest"
	local version=""

	if command -v curl >/dev/null 2>&1; then
		local redirect_location
		redirect_location=$(curl -sIo /dev/null -w '%{redirect_url}' "$redirect_url" 2>/dev/null | tr -d '\r') || true
		if [ -n "$redirect_location" ] && [ "$redirect_location" != "%{redirect_url}" ]; then
			version=$(echo "$redirect_location" | sed -n 's|.*/releases/tag/v\([^/]*\).*|\1|p') || true
		fi
	elif command -v wget >/dev/null 2>&1; then
		local redirect_location
		redirect_location=$(wget --spider -S "$redirect_url" 2>&1 | grep -i 'location:' | tail -1 | sed 's/.*location: *//I' | tr -d '\r') || true
		if [ -n "$redirect_location" ]; then
			version=$(echo "$redirect_location" | sed -n 's|.*/releases/tag/v\([^/]*\).*|\1|p') || true
		fi
	fi

	if [ -n "$version" ]; then
		echo "$version"
		return 0
	fi

	if command -v curl >/dev/null 2>&1; then
		version=$(curl -fsSL "$api_url" 2>/dev/null | grep -m1 '"tag_name"' | sed 's/.*"v\([^"]*\)".*/\1/') || true
	elif command -v wget >/dev/null 2>&1; then
		version=$(wget -qO- "$api_url" 2>/dev/null | grep -m1 '"tag_name"' | sed 's/.*"v\([^"]*\)".*/\1/') || true
	fi

	if [ -n "$version" ]; then
		echo "$version"
		return 0
	fi
	return 1
}

if [ -z "$VERSION" ]; then
	echo "  [..] Fetching latest version..."
	VERSION=$(get_latest_release) || true
	if [ -z "$VERSION" ]; then
		echo "  [!!] Failed to fetch latest version from GitHub."
		echo "  [!!] Please specify a version: VERSION=1.0.0 curl ... | bash"
		exit 1
	fi
	echo "  [OK] Latest version: $VERSION"
else
	echo "  Using specified version: $VERSION"
	if [ "$SKIP_VERSION_CHECK" = true ]; then
		echo "  [..] Skipping version check (--skip-version-check)"
	fi
fi

case "$VERSION" in
dev-*)
	REPO_RAW="https://raw.githubusercontent.com/${REPO}/${VERSION}"
	;;
*)
	REPO_RAW="https://raw.githubusercontent.com/${REPO}/v${VERSION}"
	;;
esac

is_in_container() {
	[ -f "/.dockerenv" ] || [ -f "/run/.containerenv" ]
}

download_file() {
	local path="$1"
	local dest="$2"
	local url="${REPO_RAW}/${path}"

	mkdir -p "$(dirname "$dest")"
	if command -v curl >/dev/null 2>&1; then
		curl -fsSL "$url" -o "$dest"
	elif command -v wget >/dev/null 2>&1; then
		wget -q "$url" -O "$dest"
	else
		echo "Error: Neither curl nor wget found."
		exit 1
	fi
}

check_uv() {
	command -v uv >/dev/null 2>&1
}

install_uv() {
	echo "  [..] Installing uv..."
	if command -v curl >/dev/null 2>&1; then
		curl -LsSf https://astral.sh/uv/install.sh | sh
	elif command -v wget >/dev/null 2>&1; then
		wget -qO- https://astral.sh/uv/install.sh | sh
	fi

	export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"

	if ! check_uv; then
		echo "  [!!] Failed to install uv"
		exit 1
	fi
	echo "  [OK] uv installed"
}

confirm_local_install() {
	echo ""
	echo "  Local installation will:"
	echo "    - Add 'bob' command to your shell config (~/.bashrc, ~/.zshrc, fish)"
	echo "    - Configure Claude Code with Bob best-practices (~/.claude.json, ~/.claude/settings.json)"
	echo "    - Install additional tool dependencies via Homebrew or NPM on your system"
	echo ""
	confirm=""
	if [ -t 0 ]; then
		printf "  Continue? [Y/n]: "
		read -r confirm
	elif [ -e /dev/tty ]; then
		printf "  Continue? [Y/n]: "
		read -r confirm </dev/tty
	else
		echo "  No interactive terminal available, continuing with defaults."
		confirm="y"
	fi
	case "$confirm" in
	[Nn] | [Nn][Oo])
		echo "  Cancelled."
		exit 0
		;;
	esac
}

download_installer() {
	local installer_dir="$HOME/.bob/installer"

	echo "  [..] Downloading installer..."

	rm -rf "$installer_dir"
	mkdir -p "$installer_dir/installer"

	local base_url=""
	case "$VERSION" in
	dev-*) base_url="https://github.com/${REPO}/releases/download/${VERSION}" ;;
	*) base_url="https://github.com/${REPO}/releases/download/v${VERSION}" ;;
	esac
	local tree_url="${base_url}/tree.json"

	local tag_ref=""
	case "$VERSION" in
	dev-*) tag_ref="$VERSION" ;;
	*) tag_ref="v${VERSION}" ;;
	esac
	local api_url="https://api.github.com/repos/${REPO}/git/trees/${tag_ref}?recursive=true"
	local tree_json=""

	if command -v curl >/dev/null 2>&1; then
		tree_json=$(curl -fsSL "$tree_url" 2>/dev/null) || true
	elif command -v wget >/dev/null 2>&1; then
		tree_json=$(wget -qO- "$tree_url" 2>/dev/null) || true
	fi

	if [ -z "$tree_json" ]; then
		if command -v curl >/dev/null 2>&1; then
			tree_json=$(curl -fsSL "$api_url" 2>/dev/null) || true
		elif command -v wget >/dev/null 2>&1; then
			tree_json=$(wget -qO- "$api_url" 2>/dev/null) || true
		fi
	fi

	if [ -z "$tree_json" ]; then
		echo "  [!!] Failed to fetch file list from GitHub API"
		exit 1
	fi

	echo "$tree_json" | grep -oE '"path": ?"installer/[^"]*\.py"' | sed 's/"path": *"//g; s/"$//g' | while IFS= read -r file_path; do
		case "$file_path" in
		*__pycache__* | *dist/* | *build/* | *tests/*) continue ;;
		esac

		local dest_file="$installer_dir/$file_path"
		mkdir -p "$(dirname "$dest_file")"
		download_file "$file_path" "$dest_file"
	done

	download_file "pyproject.toml" "$installer_dir/pyproject.toml"

	echo "  [OK] Installer downloaded"
}

setup_bob_launcher() {
	local bin_dir="$HOME/.bob/bin"

	mkdir -p "$bin_dir"

	# Create the bob launcher script
	cat > "$bin_dir/bob" << 'LAUNCHER_EOF'
#!/bin/bash
# Bob - Claude Code Enhancement Shell
# Can we fix it? Yes we can!

exec claude "$@"
LAUNCHER_EOF

	chmod +x "$bin_dir/bob"

	echo "  [OK] Bob launcher ready"
}

run_installer() {
	local installer_dir="$HOME/.bob/installer"

	echo ""

	export PYTHONPATH="$installer_dir:${PYTHONPATH:-}"

	local version_arg="--target-version $VERSION"
	local local_arg=""
	if [ "$USE_LOCAL_INSTALLER" = true ]; then
		local_arg="--local --local-repo-dir $(pwd)"
	fi

	local system_arg=""
	if ! is_in_container; then
		system_arg="--local-system"
	fi

	uv run --python 3.12 --no-project --with rich --with certifi \
		python -m installer install $system_arg $version_arg $local_arg "$@"
}

is_native_windows() {
	case "$(uname -s)" in
	MINGW* | MSYS* | CYGWIN*) return 0 ;;
	*) return 1 ;;
	esac
}

if is_native_windows; then
	echo ""
	echo "======================================================================"
	echo "  Bob — Windows Detected"
	echo "======================================================================"
	echo ""
	echo "  Bob requires a Unix environment (macOS, Linux, or WSL2)."
	echo ""
	echo "  Install WSL2 first (PowerShell as admin):"
	echo "    wsl --install -d Ubuntu"
	echo ""
	echo "  Then open Ubuntu and re-run this installer."
	echo ""
	exit 1
fi

echo ""
echo "======================================================================"
echo "  Bob Installer (v${VERSION})"
echo "  Can we fix it? Yes we can!"
echo "======================================================================"
echo ""

if is_in_container; then
	echo "  Running inside container — skipping system dependencies"
	echo ""
elif [ "$RESTART_BOB" = true ]; then
	echo "  Updating local installation..."
	echo ""
elif [ "$USE_LOCAL_INSTALLER" = true ]; then
	echo "  Local installation selected (--local)"
	echo ""
	confirm_local_install
else
	confirm_local_install
fi

echo ""
echo "Downloading Bob (v${VERSION})..."
echo ""

if check_uv; then
	echo "  [OK] uv already installed"
else
	install_uv
fi

if ! command -v git >/dev/null 2>&1; then
	case "$(uname -s)" in
	Linux)
		if command -v dnf >/dev/null 2>&1; then
			echo "  [..] Installing git (required by Homebrew)..."
			sudo dnf install -y git && echo "  [OK] git installed" ||
				echo "  [!!] Failed to install git via dnf"
		elif command -v yum >/dev/null 2>&1; then
			echo "  [..] Installing git (required by Homebrew)..."
			sudo yum install -y git && echo "  [OK] git installed" ||
				echo "  [!!] Failed to install git via yum"
		elif command -v apt-get >/dev/null 2>&1; then
			echo "  [..] Installing git (required by Homebrew)..."
			sudo apt-get update -qq && sudo apt-get install -y git &&
				echo "  [OK] git installed" ||
				echo "  [!!] Failed to install git via apt"
		fi
		;;
	esac
fi

if [ "$USE_LOCAL_INSTALLER" = true ]; then
	if [ -d "installer" ] && [ -f "pyproject.toml" ]; then
		echo "  [OK] Using local installer from current directory"
		rm -rf "$HOME/.bob/installer"
		mkdir -p "$HOME/.bob/installer"
		ln -sf "$(pwd)/installer" "$HOME/.bob/installer/installer"
		ln -sf "$(pwd)/pyproject.toml" "$HOME/.bob/installer/pyproject.toml"
	else
		echo "  [!!] --local requires running from bob repo root"
		echo "  [!!] Missing: installer/ directory or pyproject.toml"
		exit 1
	fi
else
	download_installer
fi
setup_bob_launcher

run_installer $INSTALLER_ARGS

if [ "$RESTART_BOB" = true ]; then
	BOB_BIN="$HOME/.bob/bin/bob"
	if [ -x "$BOB_BIN" ]; then
		echo ""
		echo "  Restarting Bob..."
		echo ""
		exec "$BOB_BIN" --skip-update-check
	fi
fi
