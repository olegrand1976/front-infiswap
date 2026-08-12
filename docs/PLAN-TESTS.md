# Plan de tests Infiswap (front)

Référence qualité inspirée PetsFollow : tags Playwright `@p0` / `@p1`, gate Vitest, e2e post-deploy.

## Légende

| Tag | Signification | Où ça tourne |
|-----|---------------|--------------|
| **@p0** | Bloquant release (auth, session, paiements retour) | Deploy front staging/prod + deploy back staging |
| **@p1** | Métier (remplacements, admin KPI, cookies RGPD, inscription) | Local / manuel / CI étendue |
| Vitest | Unit (cookies token, celebrations, utils) | Quality gate front + back |

## P0 — à chaque deploy front

| ID | Scénario | Spec |
|----|----------|------|
| A1 | Login → dashboard + Bearer `/api/user` + reload | `tests/e2e/auth/login.spec.ts` |
| A2 | Cookie `INFISWAP_TOKEN` non vide après login | idem |
| A3 | Credentials invalides restent sur `/login` | idem |
| A4 | Connecté : `/login` → redirect dashboard | idem |
| A5 | Cookie host-only vide puis login → dashboard + reload | idem (régression bounce) |
| A6 | Logout UI → re-login → dashboard + reload | idem |
| A7 | Login NL (libellés) | idem |
| P1 | Retours Stripe simulés (acces-plan / sponsoring / boost) | `tests/e2e/payments/stripe-return.spec.ts` |

Commande CI : `npm run test:e2e:p0`  
Secrets : `E2E_LOGIN_EMAIL`, `E2E_LOGIN_PASSWORD` (repo front + back).

## P1 — avant staging → prod (échantillon)

| ID | Scénario | Spec |
|----|----------|------|
| R1–R3 | Remplacements create/apply/accept, visibilité, anti double accept | `tests/e2e/replacements/*` |
| C1 | Consentement cookies RGPD | `tests/e2e/cookies/cookie-consent.spec.ts` |
| K1–K2 | Admin CRM / marketing Journey KPI | `tests/e2e/admin/*` |
| I1 | Inscription (actuellement `fixme` — flaky) | `tests/e2e/auth/register.spec.ts` |

Commande : `npm run test:e2e:p1`

## Unit (Vitest) — toujours dans le quality gate

- `app/lib/authTokenCookieUtils.test.ts` — header Cookie vide+valide, heal post-purge (bloque régression login bounce)
- Autres utils : `purchaseCelebration`, `lifetimeBadgeReveal`, etc.

## Smoke API (back)

`infra/gcp/smoke-test.sh --auth-chain` : login API Bearer (ne couvre **pas** le cookie navigateur).

## Gaps connus

- Push **front-only** sans secrets e2e → job `@p0` échoue : configurer les secrets sur `front-infiswap`
- Pas encore de smoke navigateur « read-only » prod distinct de `@p0`
- Inscription e2e en quarantaine (`fixme`)
