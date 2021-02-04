#!/bin/bash
set -euo pipefail

cd api
yarn
node index.js
