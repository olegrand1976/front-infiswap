# InfiSwap Mobile (Flutter) — Phase 0

Application mobile InfiSwap : fondations (auth Sanctum, client API, navigation).

## Prérequis

### 1. Flutter SDK

Installez Flutter 3.24+ : https://docs.flutter.dev/get-started/install

Vérifiez :

```bash
flutter doctor
```

Corrigez les points signalés (Android SDK, licence Android, etc.).

### 2. API Laravel en local

L'API doit tourner et être joignable depuis l'émulateur ou le téléphone.

```bash
cd api
# Via Sail (recommandé)
./vendor/bin/sail up -d

# Ou sans Sail
php artisan serve --host=0.0.0.0 --port=8095
```

Vérifiez que l'API répond :

```bash
curl http://localhost:8095/up
```

### 3. Compte de test

Utilisez un compte infirmier existant en base, ou créez-en un via le web (`/register`).

Pour tester **sans 2FA** : compte avec `two_factor_enabled = false`.

Pour tester **avec 2FA** : compte avec 2FA activé → l'app affichera l'écran code après login.

### 4. URL de l'API selon l'appareil

| Environnement | `API_BASE_URL` |
|---------------|----------------|
| Émulateur Android | `http://10.0.2.2:8095` (défaut) |
| Simulateur iOS | `http://localhost:8095` |
| Téléphone physique (même Wi-Fi) | `http://<IP-LAN-PC>:8095` ex. `http://192.168.1.42:8095` |
| API distante (staging) | `https://api.votre-domaine.com` |

Trouver votre IP locale :

```bash
hostname -I | awk '{print $1}'
```

---

## Installation (première fois)

```bash
cd mobile

# Génère les dossiers android/ et ios/ (nécessite Flutter installé)
flutter create . --project-name infiswap_mobile --org be.infiswap

flutter pub get
```

---

## Lancer l'app

### Script rapide

```bash
cd mobile
chmod +x run_dev.sh scripts/run_dev.sh

# Web (Chrome) — API locale
API_BASE_URL=http://127.0.0.1:8095 ./run_dev.sh -d chrome

# Émulateur Android
API_BASE_URL=http://10.0.2.2:8095 ./run_dev.sh
```

> **Important** : lancez toujours depuis `mobile/`, pas depuis `mobile/scripts/`.
> Un ancien `flutter create` dans `scripts/` affichait l'app « counter » par défaut.

### Commande manuelle

```bash
cd mobile
flutter pub get

# Web
flutter run -d chrome --dart-define=API_BASE_URL=http://127.0.0.1:8095

# Émulateur Android (défaut)
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8095

# Simulateur iOS
flutter run --dart-define=API_BASE_URL=http://localhost:8095

# Téléphone physique
flutter run --dart-define=API_BASE_URL=http://192.168.1.42:8095
```

---

## Déploiement staging (Firebase App Distribution)

Construit un APK release pointant vers l'API staging et l'envoie aux testeurs
(groupe Firebase `staging-testers`) — ils reçoivent un email d'invitation, sans
passer par le Play Store.

```bash
cd mobile
chmod +x deploy_staging.sh scripts/deploy_staging.sh

./deploy_staging.sh
```

Prérequis : `firebase login` déjà fait sur la machine (compte avec accès au
projet `infiswap-1c10f`).

Variables surchargeables :

| Variable | Défaut |
|---|---|
| `API_BASE_URL` | `https://api-infiswap-staging.ll-it-sc.be` |
| `STAGING_TESTERS_GROUP` | `staging-testers` |
| `RELEASE_NOTES` | `Build staging <version> (<commit>) — API: <url>` |

Gérer les testeurs du groupe :
```bash
firebase appdistribution:testers:add nouveau@email.com --group-alias staging-testers --project infiswap-1c10f
```

---

## HTTP en local (Android)

Pour appeler `http://` (non HTTPS) en développement, Android autorise le cleartext en mode debug par défaut avec Flutter. Si vous avez une erreur réseau sur Android :

1. Vérifiez que l'API écoute sur `0.0.0.0` (pas seulement `127.0.0.1`)
2. Vérifiez le pare-feu de votre machine

---

## Ce qui est inclus (Phase 0)

- Client HTTP **Dio** avec token Bearer Sanctum
- Stockage sécurisé du token (`flutter_secure_storage`)
- **Login** (`POST /api/login`)
- **2FA** (`POST /api/verify-2fa`)
- Récupération utilisateur (`GET /api/user`)
- **Logout** (`POST /api/logout`)
- Navigation **go_router** (splash → login → home)
- Écran d'accueil placeholder (Phase 1 : remplacements)

---

## Scénarios de test

| # | Action | Résultat attendu |
|---|--------|------------------|
| 1 | Ouvrir l'app sans token | Écran login |
| 2 | Login valide (sans 2FA) | Écran home avec nom + rôles |
| 3 | Fermer et rouvrir l'app | Session restaurée → home direct |
| 4 | Déconnexion | Retour login, token effacé |
| 5 | Mauvais mot de passe | Message d'erreur |
| 6 | Compte avec 2FA | Écran code → home après validation |
| 7 | API arrêtée | Message « Impossible de joindre l'API » |

---

## Thème / couleurs

Les couleurs sont alignées sur `front/app/assets/css/tailwind.css` (`:root`).
Seules les **couleurs** sont appliquées — les composants Flutter gardent leurs formes Material par défaut (radius, padding, etc.).

- Tokens : `lib/core/theme/app_colors.dart`
- ThemeData : `lib/core/theme/app_theme.dart` (ColorScheme + teintes minimales)

Couleur principale : `#D83A56` (`oklch(0.5921 0.1935 15.63)`).

---

## Structure

```
mobile/lib/
├── main.dart
├── app.dart
├── core/
│   ├── api/          # Dio + erreurs
│   ├── config/       # API_BASE_URL
│   ├── router/       # go_router
│   ├── storage/      # token sécurisé
│   └── theme/
└── features/
    ├── auth/         # login, 2FA
    ├── home/         # placeholder Phase 0
    └── splash/
```

---

## Prochaine étape (Phase 1)

- Liste des remplacements
- Détail + candidature
- Notifications in-app
