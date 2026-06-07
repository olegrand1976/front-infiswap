# Secrets GitHub Actions — front-infiswap (prod)

Configurer dans **Settings → Secrets and variables → Actions** du dépôt `olegrand1976/front-infiswap`.

Recopier les valeurs depuis GitLab → Settings → CI/CD → Variables (`old` remote).

## Secrets requis

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Compte Docker Hub |
| `DOCKERHUB_PASSWORD` | Token Docker Hub (pas le mot de passe compte) |
| `SSH_PRIVATE_KEY` | Clé privée PEM pour l'utilisateur `deploy` |
| `SSH_KNOWN_HOSTS` | Empreinte host SSH (optionnel si `ssh-keyscan` dans le workflow) |
| `SSH_HOST` | IP ou hostname OVH |
| `SSH_USER` | Utilisateur SSH (ex. `deploy`) |
| `API_URL` | URL API Laravel prod (build Nuxt) |
| `FRONT_END_URL` | URL publique du front |
| `PORT` | Port runtime (ex. `3000`) |
| `OPENAI_API_KEY` | Clé OpenAI prod |

## Vérification

```bash
gh secret list -R olegrand1976/front-infiswap
```

## Import depuis un fichier local (une fois les valeurs exportées)

```bash
gh secret set DOCKERHUB_USERNAME -R olegrand1976/front-infiswap --body "valeur"
# Répéter pour chaque secret
```
