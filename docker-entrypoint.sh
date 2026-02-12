#!/bin/sh
set -e

# If there's no index.php in /var/www/html (e.g., fresh or partial volume),
# seed it from the read-only copy baked into the image at /app-source.
if [ ! -f /var/www/html/index.php ]; then
  echo "[init] Seeding /var/www/html from /app-source..."
  cp -R /app-source/. /var/www/html
  chown -R www-data:www-data /var/www/html
fi

# Hand off to the default Apache foreground process
exec apache2-foreground
