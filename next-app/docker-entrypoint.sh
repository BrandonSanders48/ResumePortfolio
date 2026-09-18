#!/bin/sh
set -e

# If /app/content is a fresh (or partial) mounted volume, seed it from the
# read-only copy baked into the image at build time.
if [ ! -f /app/content/editor-docs/Resume.html ]; then
  echo "[init] Seeding /app/content from /app-seed/content..."
  mkdir -p /app/content
  cp -R /app-seed/content/. /app/content/
fi

exec "$@"
