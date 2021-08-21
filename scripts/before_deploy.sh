#!/bin/bash
REPOSITORY=/home/ec2-user
cd $REPOSITORY
sudo su

kill -9 `ps -ef|grep nest|awk '{print $2}'`
rm -rf nest-back