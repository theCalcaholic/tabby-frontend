#!/bin/bash
cd "${0%/*}"
echo updating source... && \
sudo su www-data -s /bin/sh -c "git pull" && \
echo done.
echo installing node modules... && \
sudo su www-data -s /bin/sh -c "npm install" && \
echo done.
echo building source... && \
sudo su www-data -s /bin/sh -c "ng build --prod" && \
echo done.
