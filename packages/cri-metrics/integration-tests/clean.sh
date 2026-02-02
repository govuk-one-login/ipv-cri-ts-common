#!/usr/bin/env bash

set -e

sam delete --stack-name $STACK_NAME --no-prompts
