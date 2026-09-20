#!/bin/sh
set -e

# If /app/content is a fresh (or partial) mounted volume, seed it from the
# read-only copy baked into the image at build time.
if [ ! -f /app/content/editor-docs/Resume.html ]; then
  echo "[init] Seeding /app/content from /app-seed/content..."
  mkdir -p /app/content
  cp -R /app-seed/content/. /app/content/
fi

# Same pattern for public/files: if it's a fresh (or partial) mounted volume,
# seed it from the image. This is what makes a resume PDF "published" from
# the /editor UI survive a redeploy instead of reverting to the image's
# baked-in copy.
if [ ! -f /app/public/files/Brandon-Sanders-Resume.pdf ]; then
  echo "[init] Seeding /app/public/files from /app-seed/files..."
  mkdir -p /app/public/files
  cp -R /app-seed/files/. /app/public/files/
fi

exec "$@"
