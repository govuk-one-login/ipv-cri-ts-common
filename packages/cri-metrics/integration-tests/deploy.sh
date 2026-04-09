#!/usr/bin/env bash

set -e

echo "Run ID: $RUN_ID"

sam validate -t integration-tests/stack/template.yaml --lint

if ! command -v esbuild &> /dev/null; then
  npm install -g esbuild
fi

sam build -t integration-tests/stack/template.yaml

sam deploy --stack-name $STACK_NAME \
  --no-fail-on-empty-changeset \
  --resolve-s3 \
  --capabilities CAPABILITY_IAM \
  --tags \
  cri:component=ipv-cri-ts-common \
  cri:stack-type=preview \
  cri:application=cri-metrics \
  cri:deployment-source=CI \
  --parameter-overrides \
  RunId=$RUN_ID
