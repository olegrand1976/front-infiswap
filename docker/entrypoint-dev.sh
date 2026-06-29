#!/bin/sh
set -e

cd /app

OXC_BINDING="node_modules/@oxc-parser/binding-linux-x64-gnu/parser.linux-x64-gnu.node"
if [ ! -f "$OXC_BINDING" ]; then
  echo "[Infiswap] Installation des dépendances npm (bindings natifs oxc)..."
  npm ci
fi

exec "$@"
