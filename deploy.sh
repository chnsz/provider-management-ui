#!/bin/bash

npm run build

current_path=$(pwd)
echo "workdir: ${current_path}"
# 本地文件夹路径
local_folder="${current_path}/dist"
local_dockerfile="${current_path}/Dockerfile"
local_build_file="${current_path}/remote_build.sh"
local_nginx_config="${current_path}/default.conf"

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
