FROM ubuntu:16.04

MAINTAINER Julien Tant <julien@craftyx.fr>

RUN apt-get update \
    && apt-get install --no-install-recommends -y software-properties-common locales supervisor \
    && apt-get update \
    && locale-gen en_US.UTF-8

ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

RUN add-apt-repository ppa:nginx/stable \
    && add-apt-repository ppa:ondrej/php \
    && apt-get update \
    && apt-get install --no-install-recommends -y \
        nginx \
        git \
        unzip \
        php7.4-fpm \
        php7.4-cli \
        php7.4-xdebug \
        php7.4-pdo \
        php7.4-pdo-mysql \
        php7.4-sqlite3 \
        php7.4-xml \
        php7.4-redis \
        php7.4-memcached \
        php7.4-mbstring \
        php7.4-tokenizer \
        php7.4-zip \
        php7.4-gd \
        php7.4-curl \
        curl \
    && mkdir /run/php \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && version=$(php -r "echo PHP_MAJOR_VERSION.PHP_MINOR_VERSION;") \
    #&& curl -A "Docker" -o /tmp/blackfire-probe.tar.gz -D - -L -s https://blackfire.io/api/v1/releases/probe/php/linux/amd64/$version \
    #&& tar zxpf /tmp/blackfire-probe.tar.gz -C /tmp \
    #&& mv /tmp/blackfire-*.so $(php -r "echo ini_get('extension_dir');")/blackfire.so \
    #&& printf "extension=blackfire.so\nblackfire.agent_socket=tcp://blackfire:8707\n" > /etc/php/7.1/mods-available/blackfire.ini \
    #&& phpenmod blackfire \
    && apt-get remove -y --purge software-properties-common curl \
    && apt-get clean \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY /nginx/default /etc/nginx/sites-enabled/default
COPY php.ini /etc/php/7.4/fpm/php.ini
COPY php-fpm.conf /etc/php/7.4/fpm/php-fpm.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

COPY laravel.ini /etc/php/7.4/fpm/conf.d/laravel.ini
COPY disabled-xdebug.ini /etc/php/7.1/mods-available/xdebug.ini
#COPY enabled-xdebug.ini /etc/php/7.4/mods-available/xdebug.ini
RUN /etc/init.d/php7.4-fpm restart

RUN mkdir /tmp/certgen
COPY ssl.conf /tmp/certgen
WORKDIR /tmp/certgen

# Generate a new key
RUN openssl genrsa -out server.key 4096

# generate the CSR
RUN openssl req -new -sha256 -out server.csr -key server.key -config ssl.conf

# use this to view the certificate
#RUN openssl req -text -noout -in /tmp/certgen/server.csr

# Generate the key and copy this to where you want it
# and the remove the /tmp/certreq directory as generation is complete

RUN openssl x509 -req \
    -sha256 \
    -days 3650 \
    -in server.csr \
    -signkey server.key \
    -out server.crt \
    -extensions req_ext \
    -extfile ssl.conf \
    && cp /tmp/certgen/server.crt /etc/ssl/certs/ \
    && cp /tmp/certgen/server.key /etc/ssl/private/ \
    && rm -rf /tmp/certgen

EXPOSE 80
EXPOSE 443

WORKDIR /var/www/html

CMD ["supervisord"]
