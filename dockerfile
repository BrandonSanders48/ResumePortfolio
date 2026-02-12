FROM php:8.2-apache

# Install necessary utilities + Node.js + Chromium deps for Puppeteer
RUN apt-get update \
    && apt-get install -y curl iputils-ping ca-certificates gnupg \
                          wget xz-utils \
                          chromium \
                          libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
                          libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
                          libxrandr2 libgbm1 libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js LTS
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install PHP GD extension (required by Dompdf)
RUN apt-get update \
    && apt-get install -y libfreetype6-dev libjpeg62-turbo-dev libpng-dev libwebp-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" gd \
    && rm -rf /var/lib/apt/lists/*

# Remove default Apache page (optional)
RUN rm -rf /var/www/html/*

# Keep a read-only copy of the site in /app-source for seeding volumes
COPY . /app-source
RUN cp -R /app-source/. /var/www/html

# Install Puppeteer but use system Chromium (avoid downloading Chrome into a cache)
ENV PUPPETEER_SKIP_DOWNLOAD=1
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app-source
RUN npm init -y \
    && npm install puppeteer pdf-lib \
    && rm -rf /root/.npm

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# PHP error settings
RUN echo "display_errors = Off" >> /usr/local/etc/php/conf.d/docker-php.ini \
    && echo "log_errors = On" >> /usr/local/etc/php/conf.d/docker-php.ini \
    && echo "error_log = /var/log/php_errors.log" >> /usr/local/etc/php/conf.d/docker-php.ini

EXPOSE 80

# Custom entrypoint to seed /var/www/html when a fresh volume is mounted
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

CMD ["docker-entrypoint.sh"]
