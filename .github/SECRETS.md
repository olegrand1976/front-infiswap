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

## Prérequis GCP (une fois)

Binding Workload Identity pour ce dépôt :

```bash
cd back-infiswap/back-infiswap
./infra/gcp/setup-github-deploy.sh olegrand1976/front-infiswap
```

Aucun secret GitHub n'est requis côté front : l'authentification passe par **Workload Identity Federation** (identifiants dans le workflow, comme le back).

## Vérification

```bash
gh workflow run deploy-gcp.yml -R olegrand1976/front-infiswap -f target=staging
gh run list -R olegrand1976/front-infiswap --workflow=deploy-gcp.yml
```

## Legacy OVH / Docker Hub

Fichiers conservés pour archive (`docker-compose.prod*.yml`, `.gitlab-ci.yml`) — plus de workflow GitHub associé.
