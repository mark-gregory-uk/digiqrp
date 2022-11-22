ARG PHP_VERSION=7.4.3
ARG PROJECT_TYPE=fpm

FROM php:${PHP_VERSION}-${PROJECT_TYPE}-alpine

RUN set -ex && \
    apk --no-cache add --update \
        msmtp \
        postgresql-client \
        postgresql-dev \
        autoconf \
        g++ \
        make \
        icu-dev \
        freetype \
        libzip-dev \
        libpng \
        libjpeg-turbo \
        libwebp \
        libwebp-dev \
        libwebp-tools \
        gnu-libiconv \
        freetype-dev \
        libpng-dev \
        libjpeg-turbo-dev && \
    docker-php-ext-configure gd --with-webp --with-jpeg && \
    docker-php-ext-install -j$(nproc) \
        bcmath \
        gd \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        intl \
        opcache \
        zip && \
    pecl install redis xdebug && \
    docker-php-ext-enable redis xdebug && \
    apk del --no-cache \
        freetype-dev \
        libpng-dev \
        libjpeg-turbo-dev \
        libwebp \
        autoconf \
        g++ \
        make

# Fix for iconv: https://github.com/docker-library/php/issues/240
# RUN apk add gnu-libiconv=1.15-r3 --update-cache --repository http://dl-cdn.alpinelinux.org/alpine/v3.13/community/ --allow-untrusted
# ENV LD_PRELOAD /usr/lib/preloadable_libiconv.so

# setup general options for environment variables
ARG PHP_MEMORY_LIMIT_ARG="512M"
ENV PHP_MEMORY_LIMIT=${PHP_MEMORY_LIMIT_ARG}
ARG PHP_MAX_EXECUTION_TIME_ARG="120"
ENV PHP_MAX_EXECUTION_TIME=${PHP_MAX_EXECUTION_TIME_ARG}
ARG PHP_UPLOAD_MAX_FILESIZE_ARG="500M"
ENV PHP_UPLOAD_MAX_FILESIZE=${PHP_UPLOAD_MAX_FILESIZE_ARG}
ARG PHP_MAX_INPUT_VARS_ARG="3000"
ENV PHP_MAX_INPUT_VARS=${PHP_MAX_INPUT_VARS_ARG}
ARG PHP_POST_MAX_SIZE_ARG="500M"
ENV PHP_POST_MAX_SIZE=${PHP_POST_MAX_SIZE_ARG}
ARG PHP_DISPLAY_ERRORS_ARG="On"
ENV PHP_DISPLAY_ERRORS=${PHP_DISPLAY_ERRORS_ARG}
ARG PHP_HTML_ERRORS_ARG="On"
ENV PHP_HTML_ERRORS=${PHP_HTML_ERRORS_ARG}

# setup opcache for environment variables
ARG PHP_OPCACHE_ENABLE_ARG="0"
ARG PHP_OPCACHE_REVALIDATE_FREQ_ARG="0"
ARG PHP_OPCACHE_VALIDATE_TIMESTAMPS_ARG="0"
ARG PHP_OPCACHE_MAX_ACCELERATED_FILES_ARG="10000"
ARG PHP_OPCACHE_MEMORY_CONSUMPTION_ARG="128"
ARG PHP_OPCACHE_MAX_WASTED_PERCENTAGE_ARG="10"
ARG PHP_OPCACHE_INTERNED_STRINGS_BUFFER_ARG="16"
ARG PHP_OPCACHE_FAST_SHUTDOWN_ARG="1"
ENV PHP_OPCACHE_ENABLE=$PHP_OPCACHE_ENABLE_ARG
ENV PHP_OPCACHE_REVALIDATE_FREQ=$PHP_OPCACHE_REVALIDATE_FREQ_ARG
ENV PHP_OPCACHE_VALIDATE_TIMESTAMPS=$PHP_OPCACHE_VALIDATE_TIMESTAMPS_ARG
ENV PHP_OPCACHE_MAX_ACCELERATED_FILES=$PHP_OPCACHE_MAX_ACCELERATED_FILES_ARG
ENV PHP_OPCACHE_MEMORY_CONSUMPTION=$PHP_OPCACHE_MEMORY_CONSUMPTION_ARG
ENV PHP_OPCACHE_MAX_WASTED_PERCENTAGE=$PHP_OPCACHE_MAX_WASTED_PERCENTAGE_ARG
ENV PHP_OPCACHE_INTERNED_STRINGS_BUFFER=$PHP_OPCACHE_INTERNED_STRINGS_BUFFER_ARG
ENV PHP_OPCACHE_FAST_SHUTDOWN=$PHP_OPCACHE_FAST_SHUTDOWN_ARG

# copy custom.ini settings
COPY ./craft-cms.ini /usr/local/etc/php/conf.d/

# copy xdebug settings
COPY ./xdebug.ini /usr/local/etc/php/conf.d/

# make the directories and set permissions
RUN mkdir -p /app

# the user is www-data, so we copy the files using the user and group
COPY --chown=www-data:www-data . .
# set the permissions
RUN chown -R www-data:www-data /app

#Safely switch back for further tasks
USER www-data

# set the working directory for conveinence
WORKDIR /app
