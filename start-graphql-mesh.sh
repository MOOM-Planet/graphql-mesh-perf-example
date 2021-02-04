#!/bin/bash
set -euo pipefail

cd graphql
yarn
yarn graphql-mesh serve
