FROM ubuntu:saucy
MAINTAINER Mike Risse
RUN apt-get update

RUN apt-get install -y git build-essential curl
RUN apt-get install -y 
RUN git clone https://github.com/meteor/meteor

RUN ~/meteor/meteor --help
