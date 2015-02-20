#!/bin/sh
sudo service presomeister stop
echo
echo "Getting new version..."
git pull
echo
sudo service presomeister start
