#!/bin/bash
REPOSITORY=/home/ec2-user
cd $REPOSITORY

sudo kill -9 `ps -ef|grep nest|awk '{print $2}'`
sudo rm -rf nest-back