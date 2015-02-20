#!/bin/sh
sudo service presomeister stop
git pull
sudo service presomeister start
