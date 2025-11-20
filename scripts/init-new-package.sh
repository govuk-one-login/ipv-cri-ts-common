set -e

# Use this script to initialise a new package directory.
# It will create the necessary directories, plus:
# - package.json, based on new-package-template.json
# - tsconfig as a symlink to /tsconfig.base.json
# - index.ts

ORGANISATION=govuk-one-login
REPO_URL=https://github.com/govuk-one-login/ipv-cri-ts-common.git

echo "Be sure to execute this function in the root of the repository, ie with './scripts/init-new-package.sh', not './init-new-package.sh'."

read -p "Package name (within @$ORGANISATION/ scope): " NAME

cd packages

mkdir $NAME

cd $NAME

sed -e "s|\$ORGANISATION|$ORGANISATION|" \
    -e "s|\$NAME|$NAME|" \
    -e "s|\$REPO_URL|$REPO_URL|" ../../scripts/new-package-template.json > package.json

npm install

mkdir src

touch src/index.ts

mkdir tests

ln -s ../../tsconfig.base.json tsconfig.json

ln -s ../../vitest.config.base.ts vitest.config.ts
