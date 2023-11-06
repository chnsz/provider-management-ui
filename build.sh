#!/usr/bin/env bash

set -o errexit
set -o pipefail

function usage() {
  echo "VERSION is empty, skip deploy to prod"
}

npm run build

docker build -t chengxiangdong/pms-ui:latest ./
docker push docker.io/chengxiangdong/pms-ui:latest
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
docker push docker.io/chengxiangdong/pms-ui:${VERSION}
kubectl delete pod -l app=pms-ui -n pms-prod
