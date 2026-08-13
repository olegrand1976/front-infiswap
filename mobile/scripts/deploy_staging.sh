#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v flutter >/dev/null 2>&1; then
  echo "Flutter n'est pas installé. Voir mobile/README.md"
  exit 1
fi

if ! command -v firebase >/dev/null 2>&1; then
  echo "Firebase CLI n'est pas installé (npm i -g firebase-tools), puis 'firebase login'."
  exit 1
fi

FIREBASE_PROJECT="${FIREBASE_PROJECT:-infiswap-1c10f}"
APP_ID="${FIREBASE_ANDROID_APP_ID:-1:249150725582:android:b2aaea1b1b0e3894f49f9f}"
GROUP="${STAGING_TESTERS_GROUP:-staging-testers}"
API_URL="${API_BASE_URL:-https://api-infiswap-staging.ll-it-sc.be}"

VERSION="$(grep '^version:' pubspec.yaml | sed 's/version: *//')"
COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo local)"
BUILD_DATE="$(TZ=Europe/Brussels date '+%d/%m/%Y à %H:%M')"

if [[ -n "${RELEASE_NOTES:-}" ]]; then
  NOTES="$RELEASE_NOTES"
else
  NOTES="Build de test staging InfiSwap — version $VERSION (commit $COMMIT), généré le $BUILD_DATE. Connecté à l'API staging ($API_URL). Merci de tester les dernières fonctionnalités et de signaler tout bug rencontré."
fi

echo "Déploiement staging InfiSwap"
echo "  Version      : $VERSION"
echo "  Commit       : $COMMIT"
echo "  API_BASE_URL : $API_URL"
echo "  Groupe       : $GROUP"
echo

flutter pub get
flutter build apk --release --dart-define=API_BASE_URL="$API_URL"

APK="build/app/outputs/flutter-apk/app-release.apk"

echo
echo "Envoi vers Firebase App Distribution ($GROUP)..."
firebase appdistribution:distribute "$APK" \
  --app "$APP_ID" \
  --groups "$GROUP" \
  --release-notes "$NOTES" \
  --project "$FIREBASE_PROJECT"

echo
echo "Terminé — les testeurs du groupe '$GROUP' reçoivent un email d'invitation."
