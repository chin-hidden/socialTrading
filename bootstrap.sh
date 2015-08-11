#!/usr/bin/env bash
set -o xtrace

YUM="yum -y"
rpm --import http://mirror.centos.org/centos/RPM-GPG-KEY-CentOS-7
# $YUM update --exclude="kernel*"

$YUM groupinstall 'Development Tools'


curl -sL https://rpm.nodesource.com/setup | bash -
$YUM install nodejs python34 python34-devel redis


npm install -g bower npm-css babel

# Install  pip
wget https://bootstrap.pypa.io/get-pip.py
sudo python3.4 get-pip.py


# Installing RabbitMQ
wget --continue http://dl.fedoraproject.org/pub/epel/7/x86_64/e/epel-release-7-5.noarch.rpm
$YUM install epel-release-7*.rpm
sed --in-place=bak -s 's|#baseurl.*|baseurl=http://mirrors.vinahost.vn/epel/7/$basearch|' /etc/yum.repos.d/epel.repo
sed --in-place=bak -s 's/mirrorlist/#mirrorlist/' /etc/yum.repos.d/epel.repo

wget --continue http://www.rabbitmq.com/releases/rabbitmq-server/v3.2.2/rabbitmq-server-3.2.2-1.noarch.rpm
rpm --import http://www.rabbitmq.com/rabbitmq-signing-key-public.asc
$YUM install erlang
$YUM install rabbitmq-server-3.2.2-1.noarch.rpm

# Enable the management plugin
rabbitmq-plugins enable rabbitmq_management

# Make it start on startup
chkconfig rabbitmq-server on
/sbin/service rabbitmq-server start


$YUM install postgresql-server postgresql-contrib postgresql-devel
postgresql-setup initdb
systemctl enable postgresql.service
systemctl start postgresql.service

sudo -u postgres createuser --superuser vagrant
dropdb duber
createdb duber


# Start Redis at startup
systemctl enable redis
systemctl start redis


# Misc tools
$YUM install vim man byobu bash-completion
