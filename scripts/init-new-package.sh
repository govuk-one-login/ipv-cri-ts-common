#!/usr/bin/env bash

set -e

# Use this script to initialise a new package directory.
# It will create the necessary directories and initial files.

ORGANISATION=govuk-one-login
REPO_URL=https://github.com/govuk-one-login/ipv-cri-ts-common

echo "Be sure to execute this function in the root of the repository, ideally using 'npm run init-new-package'."

read -p "Scoped package name (exclude @$ORGANISATION/, include 'cri-' prefix): " NAME

# add package to the list of coverage sources for sonar
sed -i '' -E "s|^sonar.javascript.lcov.reportPaths=(.+)$|sonar.javascript.lcov.reportPaths=\1,./packages/$NAME/coverage/lcov.info|" sonar-project.properties

cd packages

mkdir $NAME

cd ../scripts/new-package-template

# copy files from new-package-template dir, substituting org, package name and repo url
for filename in *; do
  sed -e "s|\$ORGANISATION|$ORGANISATION|" \
    -e "s|\$NAME|$NAME|" \
    -e "s|\$REPO_URL|$REPO_URL|" $filename > "../../packages/$NAME/${filename:9}"
done

cd ../../packages/$NAME

npm install

mkdir src

touch src/index.ts

mkdir tests

ln -s ../../tsconfig.base.json tsconfig.json

ln -s ../../vitest.config.base.ts vitest.config.ts
