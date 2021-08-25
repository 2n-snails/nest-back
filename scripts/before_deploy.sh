#!/bin/bash
REPOSITORY=/home/ec2-user
cd $REPOSITORY

sudo pm2 kill
sudo rm -rf nest-back