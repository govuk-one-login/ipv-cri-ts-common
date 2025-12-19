#!/bin/bash

# We run coverage separately in each package in the monorepo.
# This means that the lcov files refer to, eg, 'src/index.ts', which is ambiguous as
# Sonar doesn't take into account file location when ingesting coverage.
# This script prepends file paths starting 'src/' with the full repo path leading to that file.
# For example, 'src/index.ts' in 'packages/blahblah/coverage/lcov.info' will be changed to
# 'packages/blahblah/src/index.ts'.

for package_dir in packages/*; do
  if [[ -d "$package_dir" ]]; then
    LCOV_FILE="$package_dir/coverage/lcov.info"

    if [[ -f "$LCOV_FILE" ]]; then
      sed -i "s|src/|packages/$(basename "$package_dir")/src/|" "$LCOV_FILE"

      echo "Modified lcov file: $LCOV_FILE"
    else
      echo "No lcov.info file found for package: $(basename "$package_dir")"
    fi
  fi
done
