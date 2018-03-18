#!/usr/bin/env bash

cd "${0%/*}"
echo updating source... && \
sudo -u www-data git pull && \
echo done.
