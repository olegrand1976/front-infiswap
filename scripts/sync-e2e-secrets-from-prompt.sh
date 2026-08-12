#!/usr/bin/env bash
# Configure E2E_LOGIN_* GitHub Actions secrets on olegrand1976/front-infiswap.
# Usage: ./scripts/sync-e2e-secrets-from-prompt.sh
# Does not print the password. Values are never written to disk by this script.
set -euo pipefail

REPO="${REPO:-olegrand1976/front-infiswap}"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI requis" >&2
  exit 1
fi

existing="$(gh secret list -R "$REPO" 2>/dev/null || true)"
if echo "$existing" | grep -q '^E2E_LOGIN_EMAIL' && echo "$existing" | grep -q '^E2E_LOGIN_PASSWORD'; then
  echo "E2E_LOGIN_EMAIL et E2E_LOGIN_PASSWORD déjà présents sur $REPO."
  read -r -p "Écraser ? [y/N] " ans
  case "${ans:-}" in
    y|Y|yes|YES) ;;
    *) echo "Annulé."; exit 0 ;;
  esac
fi

read -r -p "E2E_LOGIN_EMAIL: " email
if [[ -z "${email}" ]]; then
  echo "Email vide." >&2
  exit 1
fi

read -r -s -p "E2E_LOGIN_PASSWORD: " password
echo
if [[ -z "${password}" ]]; then
  echo "Password vide." >&2
  exit 1
fi

printf '%s' "$email" | gh secret set E2E_LOGIN_EMAIL -R "$REPO"
printf '%s' "$password" | gh secret set E2E_LOGIN_PASSWORD -R "$REPO"

unset password
echo "OK — secrets définis sur $REPO :"
gh secret list -R "$REPO" | grep '^E2E_LOGIN_' || true
