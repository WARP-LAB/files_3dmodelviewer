# SPDX-FileCopyrightText: Bernhard Posselt <dev@bernhard-posselt.com>
# SPDX-License-Identifier: AGPL-3.0-or-later

# Generic Makefile for building and packaging a Nextcloud app which uses npm and
# Composer.

app_name=$(notdir $(CURDIR))
build_tools_directory=$(CURDIR)/build/tools
source_build_directory=$(CURDIR)/build/artifacts/source
source_package_name=$(source_build_directory)/$(app_name)
appstore_build_directory=$(CURDIR)/build/artifacts/appstore
appstore_package_name=$(appstore_build_directory)/$(app_name)
nc_cert_directory=$(HOME)/.nextcloud/certificates
npm=$(shell which npm 2> /dev/null)
composer=$(shell which composer 2> /dev/null)

# Fetches the PHP and JS dependencies and compiles the JS. If no composer.json
# is present, the composer step is skipped, if no package.json or js/package.json
# is present, the npm step is skipped
.PHONY: build
build:
ifneq (,$(wildcard $(CURDIR)/composer.json))
	make composer
endif
ifneq (,$(wildcard $(CURDIR)/package.json))
	make npm
endif
ifneq (,$(wildcard $(CURDIR)/js/package.json))
	make npm
endif

# Installs and updates the composer dependencies. If composer is not installed
# a copy is fetched from the web
.PHONY: composer
composer:
ifeq (, $(composer))
	@echo "No composer command available, downloading a copy from the web"
	mkdir -p $(build_tools_directory)
	curl -sS https://getcomposer.org/installer | php
	mv composer.phar $(build_tools_directory)
	php $(build_tools_directory)/composer.phar install --prefer-dist
	php $(build_tools_directory)/composer.phar update --prefer-dist
else
	composer install --prefer-dist
	composer update --prefer-dist
endif


all: dev-setup appstore

# Dev environment setup
dev-setup: distclean npm-init composer

# Update npm
.PHONY: npm-init
npm-init:
	npm install

# Installs npm dependencies
.PHONY: npm
npm:
ifeq (,$(wildcard $(CURDIR)/package.json))
	cd js && $(npm) run build:prod
else
	npm run build:prod
endif

.PHONY: dev
dev:
ifeq (,$(wildcard $(CURDIR)/package.json))
	cd js && $(npm) run build:dev
else
	npm run build:dev
endif

.PHONY: prod
prod:
ifeq (,$(wildcard $(CURDIR)/package.json))
	cd js && $(npm) run build:prod
else
	npm run build:prod
endif

# Removes the appstore build
.PHONY: clean
clean:
	rm -rf $(build_dir)
	rm -rf js/*
	mkdir -p js
	rm -rf img/*
	mkdir -p img

# Same as clean but also removes dependencies installed by composer, bower and
# npm
.PHONY: distclean
distclean: clean
	rm -rf node_modules
	rm -rf ./vendor


# Builds the source package for the app store, ignores php and js tests
.PHONY: appstore
appstore: distclean npm-init build
	rm -rf $(appstore_build_directory)
	mkdir -p $(appstore_build_directory)
	tar cvzf $(appstore_package_name).tar.gz \
	--exclude-vcs \
	--exclude="../$(app_name)/build" \
	--exclude="../$(app_name)/tests" \
	--exclude="../$(app_name)/Makefile" \
	--exclude="../$(app_name)/*.log" \
	--exclude="../$(app_name)/phpunit*xml" \
	--exclude="../$(app_name)/composer.*" \
	--exclude="../$(app_name)/package.json" \
	--exclude="../$(app_name)/package-lock.json" \
	--exclude="../$(app_name)/bower.json" \
	--exclude="../$(app_name)/karma.*" \
	--exclude="../$(app_name)/protractor\.*" \
	--exclude="../$(app_name)/.*" \
	--exclude="../$(app_name)/js/.*" \
	--exclude="../$(app_name)/screenshots" \
	--exclude="../$(app_name)/src" \
	--exclude="../$(app_name)/tests" \
	--exclude="../$(app_name)/node_modules" \
	--exclude="../$(app_name)/vendor" \
	--exclude="../$(app_name)/sketch" \
	../$(app_name) \

	@if [ -f $(nc_cert_directory)/$(app_name).key ]; then \
		echo "Signing package..."; \
		openssl dgst -sha512 -sign $(nc_cert_directory)/$(app_name).key $(appstore_build_directory)/$(app_name).tar.gz | openssl base64; \
	fi

.PHONY: test
test: composer
	$(CURDIR)/vendor/phpunit/phpunit/phpunit -c phpunit.xml
	$(CURDIR)/vendor/phpunit/phpunit/phpunit -c phpunit.integration.xml
