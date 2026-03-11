#!/bin/bash
# Build both the Vite landing page and Docusaurus docs+blog, combine into single output.
# Output: docs/site/dist/ (Vite) with docs/site/dist/docs/ and docs/site/dist/blog/ (Docusaurus)
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_DIR="$SCRIPT_DIR"
DOCUSAURUS_DIR="$SCRIPT_DIR/../docusaurus"

echo "=== Building Vite landing page ==="
cd "$SITE_DIR"
npm ci --prefer-offline 2>/dev/null || npm install
npm run build

echo "=== Building Docusaurus docs + blog ==="
cd "$DOCUSAURUS_DIR"
npm ci --prefer-offline 2>/dev/null || npm install
npm run build

echo "=== Combining outputs ==="
DIST="$SITE_DIR/dist"
BUILD="$DOCUSAURUS_DIR/build"

# Copy Docusaurus docs and blog into Vite dist
cp -r "$BUILD/docs" "$DIST/docs"
cp -r "$BUILD/blog" "$DIST/blog"

# Merge Docusaurus assets into Vite assets (no filename conflicts — Vite uses hashes, Docusaurus uses css/js subdirs)
cp -r "$BUILD/assets/"* "$DIST/assets/"

# Copy search plugin files
[ -d "$BUILD/search" ] && cp -r "$BUILD/search" "$DIST/search"
[ -f "$BUILD/search-index.json" ] && cp "$BUILD/search-index.json" "$DIST/search-index.json"

# Copy Docusaurus img (favicon etc.) — merge into existing img or create
[ -d "$BUILD/img" ] && cp -r "$BUILD/img" "$DIST/img"

# Copy sitemaps
for f in "$BUILD"/*.xml; do
  [ -f "$f" ] && cp "$f" "$DIST/" 2>/dev/null || true
done

echo "=== Build complete ==="
echo "Landing page: $DIST/"
echo "Documentation: $DIST/docs/"
echo "Blog: $DIST/blog/"
echo ""
echo "File counts:"
echo "  docs: $(find "$DIST/docs" -name '*.html' | wc -l | tr -d ' ') pages"
echo "  blog: $(find "$DIST/blog" -name '*.html' | wc -l | tr -d ' ') pages"
