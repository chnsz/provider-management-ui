#!/usr/bin/env bash

set -o errexit
set -o pipefail

function usage() {
  echo "VERSION is empty, skip deploy to prod"
}

function exp_container {
  is_containerd=`command -v containerd`
  if [[ -x ${is_containerd} ]]; then
    docker save -o "${TEMP_PATH}/pms-ui.tar" chengxiangdong/pms-ui:${1}
    ctr -n=k8s.io i import ${TEMP_PATH}/pms-ui.tar
    rm -rf ${TEMP_PATH}/pms-ui.tar
  fi
}

cd /code/pms-ui
export KUBECONFIG=/etc/kubernetes/admin.conf

docker build -t chengxiangdong/pms-ui:latest ./
exp_container latest
kubectl delete pod -l app=pms-ui -n pms-test

if [[ -z "${1}" ]]; then
  exit 1
fi

VERSION=v0.1.31
if [[ -z "${VERSION}" ]]; then
  usage
  exit 1
fi

docker build -t chengxiangdong/pms-ui:${VERSION} ./
exp_container ${VERSION}
kubectl delete pod -l app=pms-ui -n pms-prod
