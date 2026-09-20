# ---- deps: install dependencies once, cached separately from source ----
FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: production build with standalone output ----
FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner: minimal image with system Chromium for Puppeteer PDF export ----
FROM node:20-bookworm-slim AS runner
WORKDIR /app

# Chromium + the libraries it needs at runtime (same set as the PHP site's
# Dockerfile, since both use Puppeteer against a system-installed browser).
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       chromium ca-certificates fonts-liberation \
       libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
       libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
       libxrandr2 libgbm1 libasound2 \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Use the apt-installed Chromium instead of downloading Puppeteer's own copy.
ENV PUPPETEER_SKIP_DOWNLOAD=1
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN mkdir -p /app/content /app-seed && chown -R node:node /app /app-seed

# Standalone server + its pruned node_modules
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
# Read-only seed copies used to populate fresh volumes on first run (see
# docker-entrypoint.sh): the editable resume docs, and public/files (which
# the /editor "publish" feature writes into at runtime).
COPY --from=builder --chown=node:node /app/content /app-seed/content
COPY --from=builder --chown=node:node /app/public/files /app-seed/files

COPY --chown=node:node docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER node
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
