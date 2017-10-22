#!/bin/bash
cd "${0%/*}"
sudo su www-data -s /bin/sh -c "git pull"
sudo su www-data -s /bin/sh -c "npm install"
sudo su www-data -s /bin/sh -c "ng build --prod"
