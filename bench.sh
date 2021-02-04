#!/bin/bash
set -euo pipefail

echo "### 1 ### Test the API /products endpoint"
ab -c 1 -n 100 http://localhost:8080/products/

echo "### 2 ### Warm up GraphQL Mesh cache"
ab -c 1 -n 1 -p query.json -T application/json http://localhost:4000/graphql/

echo "### 3 ### Test GraphQL Mesh"
ab -c 1 -n 100 -p query.json -T application/json http://localhost:4000/graphql/

