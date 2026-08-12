# Secrets GitHub Actions — front-infiswap

Le front est déployé sur **GCP Cloud Run** via Artifact Registry (`europe-west1-docker.pkg.dev/.../infiswap-web`).
**Docker Hub n'est plus utilisé.**

## Workflow

| Branche | Workflow | Cible |
|---------|----------|-------|
| `staging` | `.github/workflows/deploy-gcp.yml` | `infiswap-web-staging` |
| `main` | `.github/workflows/deploy-gcp.yml` | `infiswap-web-prod` (web only) |

Déploiement **API + Web prod complet** : dépôt `back-infiswap` → `.github/workflows/deploy-prod-gcp.yaml`.

Les configs Cloud Build (`infra/gcp/cloudbuild-*.yaml`) sont versionnées dans ce dépôt pour éviter un checkout cross-repo vers `back-infiswap` (privé).

Auth deploy : **Workload Identity Federation** (provider + SA en dur dans le workflow) — pas de secrets GCP côté front.

## Secrets requis (`deploy-gcp.yml` → job `post-e2e-p0`)

| Secret | Description |
|--------|-------------|
| `E2E_LOGIN_EMAIL` | Compte staging vérifié pour Playwright login (`@p0`) |
| `E2E_LOGIN_PASSWORD` | Mot de passe du compte E2E staging |

Mêmes valeurs que sur `olegrand1976/back-infiswap` (GitHub ne permet pas de lire / copier les valeurs d’un dépôt à l’autre). Pas de secrets org (`olegrand1976` = user, pas org Actions).

### Configurer

```bash
# Interactif (lit email + password depuis le terminal, sans echo du password)
./scripts/sync-e2e-secrets-from-prompt.sh

# Ou manuellement
printf '%s' 'user@example.com' | gh secret set E2E_LOGIN_EMAIL -R olegrand1976/front-infiswap
printf '%s' '***' | gh secret set E2E_LOGIN_PASSWORD -R olegrand1976/front-infiswap
gh secret list -R olegrand1976/front-infiswap
```

Sans ces secrets, le job `E2E Playwright @p0 (auth/payments)` échoue après le deploy staging/prod web.

## Prérequis GCP (une fois)

```bash
cd back-infiswap/back-infiswap
./infra/gcp/setup-github-deploy.sh olegrand1976/front-infiswap
```

## Vérification

```bash
gh secret list -R olegrand1976/front-infiswap
gh workflow run deploy-gcp.yml -R olegrand1976/front-infiswap -f target=staging
gh run list -R olegrand1976/front-infiswap --workflow=deploy-gcp.yml
```

## Legacy OVH / Docker Hub

Fichiers conservés pour archive (`docker-compose.prod*.yml`, `.gitlab-ci.yml`) — plus de workflow GitHub associé.
