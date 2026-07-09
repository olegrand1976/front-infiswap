#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v flutter >/dev/null 2>&1; then
  echo "Flutter n'est pas installé. Voir mobile/README.md"
  exit 1
fi

if [[ ! -d android || ! -d ios ]]; then
  flutter create . --project-name infiswap_mobile --org be.infiswap
fi

flutter pub get

API_URL="${API_BASE_URL:-http://127.0.0.1:8095}"

echo "Lancement InfiSwap depuis $ROOT"
echo "API_BASE_URL=$API_URL"

flutter run --dart-define=API_BASE_URL="$API_URL" "$@"
