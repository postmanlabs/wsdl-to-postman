#!/bin/bash
# ----------------------------------------------------------------------------------------------------------------------
# This script is intended to be executed as all-inclusive test and artefact creation (excluding packaging and release.)
# As such, a clean exit from this script implies all tests have passed and the code will not fail a build. (However,
# build may still fail due to errors on build executing servers and as such has no relation with code quality.)
#
# This script executes all non time-bound tests, excluding browser tests and performance tests.
# ----------------------------------------------------------------------------------------------------------------------

# Stop on first error
set -e;

# information block

# TODO - Add ASCII art banner for Cloud API

echo -e "\033[0m\033[2m";
date;
echo "node `node -v`";
echo "npm  v`npm -v`";
which git &>/dev/null && git --version;
echo -e "\033[0m";

# git version
which git &>/dev/null && \
  echo -e "Running on branch: \033[4m`git rev-parse --abbrev-ref HEAD`\033[0m (${NODE_ENV:=development} environment)";

# run lint
npm run lint

# run unit tests
npm run unit-tests

# run e2e tests
npm run e2e-tests

# run convert validation tests
npm run convert-validation-tests

# run merge convert validation tests
npm run system-tests


