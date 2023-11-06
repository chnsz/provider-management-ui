#!/bin/bash

npm run build

# 本地文件夹路径
local_folder="/mnt/d/code/pms-ui-new/dist"
local_dockerfile="/mnt/d/code/pms-ui-new/Dockerfile"
local_build_file="/mnt/d/code/pms-ui-new/remote_build.sh"
local_nginx_config="/mnt/d/code/pms-ui-new/default.conf"

# 远程服务器的用户名和IP地址
remote_user="root"
remote_ip="192.168.0.4"

# 远程服务器的目标路径
remote_folder="/code/pms-ui/dist"
remote_dockerfile="/code/pms-ui/Dockerfile"
remote_build_file="/code/pms-ui/build.sh"
remote_nginx_config="/code/pms-ui/default.conf"

ssh "$remote_user@$remote_ip" "rm -rf /code/pms-ui/dist > /code/pms-ui/logs.out" "$1"
# 将本地文件夹复制到远程服务器
scp -r "$local_folder" "$remote_user@$remote_ip:$remote_folder"
scp -r "$local_dockerfile" "$remote_user@$remote_ip:$remote_dockerfile"
scp -r "$local_build_file" "$remote_user@$remote_ip:$remote_build_file"
scp -r "$local_nginx_config" "$remote_user@$remote_ip:$remote_nginx_config"

echo "File copy completed"
echo
# 在远程服务器上执行命令
ssh "$remote_user@$remote_ip" "$remote_build_file $1 > /code/pms-ui/logs.out" "$1"
