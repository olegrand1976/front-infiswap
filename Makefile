# Infiswap — orchestration front (Nuxt 3) + back (Laravel 12 / Sail)
# Prérequis : git, Docker avec plugin Compose v2 (`docker compose`).
# Exécuter depuis front-infiswap/ (monorepo : ../back-infiswap/back-infiswap).

ROOT := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
MONOREPO_ROOT := $(abspath $(ROOT)/..)
FRONT_DIR := $(ROOT)
BACK_DIR := $(MONOREPO_ROOT)/back-infiswap/back-infiswap
SCRIPTS_DIR := $(MONOREPO_ROOT)/scripts/
PORTS_FILE := $(MONOREPO_ROOT)/.infiswap-ports.env
COMPOSE ?= docker compose
COMPOSE_FILE ?= docker-compose.yml

# Variables consommées par scripts/prod-tunnel.sh : exportées vers l'environnement des recettes.
export SSH_HOST SSH_USER SSH_PORT PMA_PORT DB_PORT DB_REMOTE

.PHONY: help \
	push push-all push-front push-back \
	pull pull-all pull-front pull-back pull-all-autostash pull-front-autostash pull-back-autostash \
	check-clean-front check-clean-back check-unmerged-front check-unmerged-back \
	check-branch-arg checkout-front checkout-back checkout-all \
	up up-all up-front up-back \
	down down-all down-front down-back \
	front-npm-dev front-npm-dev-prep \
	migrate-back \
	tunnel-prod tunnel-pma tunnel-db verify-ovh sync-prod-db \
	gcp-bootstrap gcp-setup-github-deploy gcp-deploy gcp-domains gcp-disable-premedica gcp-smoke \
	gcp-scale-up gcp-scale-down gcp-scale-scheduler \
	gcp-staging-db-sync gcp-staging-db-sync-run

help:
	@echo "Infiswap — commandes disponibles"
	@echo ""
	@echo "  Git — les deux dépôts"
	@echo "    make pull-all / push-all"
	@echo "    make pull-all-autostash (rebase + autostash)"
	@echo "  Git — un dépôt"
	@echo "    make pull-front | pull-back"
	@echo "    make pull-front-autostash | pull-back-autostash"
	@echo "    make push-front | push-back"
	@echo "    make checkout-front BRANCH=<nom-branche>"
	@echo "    make checkout-back BRANCH=<nom-branche>"
	@echo "  Git — checkout sur les deux dépôts (TOUJOURS en parallèle)"
	@echo "    make checkout BRANCH=<nom-branche>       # alias de checkout-all"
	@echo "    make checkout-all BRANCH=<nom-branche>"
	@echo ""
	@echo "  Docker Compose — les deux stacks (ports libres auto + URLs affichées)"
	@echo "    make up-all / down-all"
	@echo "  Docker Compose — une stack"
	@echo "    make up-front | up-back"
	@echo "    make down-front | down-back"
	@echo ""
	@echo "  Front — Nuxt en local (hors Docker, back up requis : make up-back)"
	@echo "    make front-npm-dev            # arrête le conteneur front Docker si actif"
	@echo ""
	@echo "  Après up-* : fichier .infiswap-ports.env (source pour réutiliser les ports)"
	@echo ""
	@echo "  Local — back (Sail, stack up requise : make up-back)"
	@echo "    make migrate-back              # vendor/bin/sail artisan migrate"
	@echo "    make migrate-back ARGS=\"--step\"  # options artisan supplémentaires"
	@echo ""
	@echo "  Prod — tunnel SSH (admin DB sans exposition publique)"
	@echo "    make tunnel-prod   # via SSH_TARGET=infiswap-back (~/.ssh/config)"
	@echo "    make tunnel-pma | tunnel-db"
	@echo "    make verify-ovh   # audit sécurité prod via infiswap-back"
	@echo "    Variables: SSH_TARGET, SSH_HOST, SSH_USER, PMA_PORT, DB_PORT, DB_REMOTE"
	@echo "    (ou scripts/prod-tunnel.local.env non versionné)"
	@echo ""
	@echo "  Local — sync base prod → Sail"
	@echo "    make sync-prod-db              # dump OVH (SSH) + import local"
	@echo "    make sync-prod-db FROM=gcp     # dump GCS prod + import local"
	@echo "    make sync-prod-db DUMP=path    # import dump existant (.sql.gz)"
	@echo ""
	@echo "  GCP staging (infiswap.ll-it-sc.be — indépendant d'OVH)"
	@echo "    make gcp-bootstrap"
	@echo "    make gcp-setup-github-deploy"
	@echo "    make gcp-deploy | gcp-domains | gcp-disable-premedica | gcp-smoke"
	@echo "    make gcp-scale-scheduler   # planif. 18h–23h Europe/Paris"
	@echo "    make gcp-scale-up | gcp-scale-down   # manuel"
	@echo "    make gcp-staging-db-sync   # sync nocturne prod → staging (00h Paris)"
	@echo "    make gcp-staging-db-sync-run   # test manuel sync DB"
	@echo ""
	@echo "Chemins : FRONT=$(FRONT_DIR)  BACK=$(BACK_DIR)"

# --- Git (branche courante) ---

pull-all: pull-front pull-back

check-clean-front:
	@if [ -n "$$(git -C "$(FRONT_DIR)" diff --name-only --diff-filter=U)" ]; then \
		echo "Erreur: front-infiswap contient des conflits non résolus (index en état merge)."; \
		echo "Résoudre/abandonner le merge en cours puis relancer."; \
		exit 128; \
	fi
	@if [ -n "$$(git -C "$(FRONT_DIR)" status --porcelain)" ]; then \
		echo "Erreur: front-infiswap a des modifications locales."; \
		echo "Options:"; \
		echo "  - commit/stash puis relancer make pull-front"; \
		echo "  - ou utiliser make pull-front-autostash"; \
		exit 128; \
	fi

check-clean-back:
	@if [ -n "$$(git -C "$(BACK_DIR)" diff --name-only --diff-filter=U)" ]; then \
		echo "Erreur: back-infiswap contient des conflits non résolus (index en état merge)."; \
		echo "Résoudre/abandonner le merge en cours puis relancer."; \
		exit 128; \
	fi
	@if [ -n "$$(git -C "$(BACK_DIR)" status --porcelain)" ]; then \
		echo "Erreur: back-infiswap a des modifications locales."; \
		echo "Options:"; \
		echo "  - commit/stash puis relancer make pull-back"; \
		echo "  - ou utiliser make pull-back-autostash"; \
		exit 128; \
	fi

pull-front: check-clean-front
	git -C "$(FRONT_DIR)" pull --ff-only

pull-back: check-clean-back
	git -C "$(BACK_DIR)" pull --ff-only

pull-all-autostash: pull-front-autostash pull-back-autostash

pull-front-autostash:
	git -C "$(FRONT_DIR)" pull --rebase --autostash

pull-back-autostash:
	git -C "$(BACK_DIR)" pull --rebase --autostash

check-branch-arg:
	@if [ -z "$(BRANCH)" ]; then \
		echo "Erreur: BRANCH est requis."; \
		echo "Exemple: make checkout-front BRANCH=develop"; \
		exit 2; \
	fi

check-unmerged-front:
	@if [ -n "$$(git -C "$(FRONT_DIR)" diff --name-only --diff-filter=U)" ]; then \
		echo "Erreur: front-infiswap contient des conflits non résolus (index en état merge)."; \
		echo "Résoudre/abandonner le merge en cours avant checkout."; \
		exit 1; \
	fi

check-unmerged-back:
	@if [ -n "$$(git -C "$(BACK_DIR)" diff --name-only --diff-filter=U)" ]; then \
		echo "Erreur: back-infiswap contient des conflits non résolus (index en état merge)."; \
		echo "Résoudre/abandonner le merge en cours avant checkout."; \
		exit 1; \
	fi

checkout-front: check-branch-arg
	@$(MAKE) check-unmerged-front
	git -C "$(FRONT_DIR)" fetch --all --prune
	git -C "$(FRONT_DIR)" checkout "$(BRANCH)"

checkout-back: check-branch-arg
	@$(MAKE) check-unmerged-back
	git -C "$(BACK_DIR)" fetch --all --prune
	git -C "$(BACK_DIR)" checkout "$(BRANCH)"

checkout-all: checkout-front checkout-back

# Alias court : `make checkout BRANCH=staging` bascule back ET front ensemble.
checkout: checkout-all

push-all: push-front push-back

push-front:
	git -C "$(FRONT_DIR)" push

push-back:
	git -C "$(BACK_DIR)" push

# --- Docker Compose (ports libres détectés automatiquement, voir scripts/compose-up.sh) ---

up-all:
	@COMPOSE="$(COMPOSE)" COMPOSE_FILE="$(COMPOSE_FILE)" "$(SCRIPTS_DIR)compose-up.sh" all

up-front:
	@COMPOSE="$(COMPOSE)" COMPOSE_FILE="$(COMPOSE_FILE)" "$(SCRIPTS_DIR)compose-up.sh" front

up-back:
	@COMPOSE="$(COMPOSE)" COMPOSE_FILE="$(COMPOSE_FILE)" "$(SCRIPTS_DIR)compose-up.sh" back

down-all: down-front down-back

down-front:
	cd "$(FRONT_DIR)" && $(COMPOSE) -f $(COMPOSE_FILE) down

down-back:
	cd "$(BACK_DIR)" && $(COMPOSE) -f $(COMPOSE_FILE) down

# Prérequis front-npm-dev : libérer le port 3000 et .nuxt (souvent root si créé par Docker).
front-npm-dev-prep:
	@if docker ps --format '{{.Names}}' 2>/dev/null | grep -qx infiswap_frontend; then \
		echo "[Infiswap] Arrêt du conteneur front Docker (port 3000)…"; \
		$(MAKE) down-front; \
	fi
	@if [ -d "$(FRONT_DIR)/.nuxt" ] && { [ ! -w "$(FRONT_DIR)/.nuxt/dev" ] 2>/dev/null || find "$(FRONT_DIR)/.nuxt" -maxdepth 2 ! -writable -print -quit | grep -q .; }; then \
		echo "[Infiswap] Nettoyage .nuxt (permissions Docker)…"; \
		docker run --rm -v "$(FRONT_DIR):/app" -w /app alpine:3.20 rm -rf .nuxt; \
	fi

# Nuxt dev sur l'hôte (npm run dev). Lit .infiswap-ports.env si présent (make up-back).
front-npm-dev: front-npm-dev-prep
	@set -a; \
	[ -f "$(PORTS_FILE)" ] && . "$(PORTS_FILE)"; \
	set +a; \
	host="$${INFISWAP_HOST:-127.0.0.1}"; \
	app_port="$${INFISWAP_APP_PORT:-80}"; \
	front_port="$${INFISWAP_FRONT_PORT:-3000}"; \
	if [ "$$app_port" = "80" ]; then api_url="http://$$host"; else api_url="http://$$host:$$app_port"; fi; \
	echo "[Infiswap] Front npm dev → http://$$host:$$front_port/  API $$api_url"; \
	cd "$(FRONT_DIR)" && \
	NUXT_PUBLIC_API_URL="$$api_url" \
	NUXT_PUBLIC_FRONT_END_URL="http://$$host:$$front_port" \
	API_URL_SSR="$$api_url" \
	npm run dev -- --port "$$front_port"

migrate-back:
	cd "$(BACK_DIR)" && vendor/bin/sail artisan migrate $(ARGS)

# --- Tunnel SSH vers les services d'admin du serveur de prod ---

tunnel-prod:
	@"$(SCRIPTS_DIR)prod-tunnel.sh" all

tunnel-pma:
	@"$(SCRIPTS_DIR)prod-tunnel.sh" pma

tunnel-db:
	@"$(SCRIPTS_DIR)prod-tunnel.sh" db

verify-ovh:
	@SSH_TARGET="$${SSH_TARGET:-infiswap-back}" "$(SCRIPTS_DIR)verify-ovh-prereqs.sh"

sync-prod-db:
	@if [ -n "$(DUMP)" ]; then \
		"$(SCRIPTS_DIR)sync-prod-db-local.sh" "$(DUMP)"; \
	elif [ "$(FROM)" = "gcp" ]; then \
		"$(SCRIPTS_DIR)sync-prod-db-local.sh" --from-gcp; \
	else \
		"$(SCRIPTS_DIR)sync-prod-db-local.sh"; \
	fi

# --- GCP staging (premedica-prod-2025) ---

gcp-bootstrap:
	@FRONT_DIR="$(FRONT_DIR)" "$(BACK_DIR)/infra/gcp/bootstrap.sh"

gcp-setup-github-deploy:
	@"$(BACK_DIR)/infra/gcp/setup-github-deploy.sh" olegrand1976/back-infiswap
	@"$(BACK_DIR)/infra/gcp/setup-github-deploy.sh" olegrand1976/front-infiswap

gcp-deploy:
	@FRONT_DIR="$(FRONT_DIR)" "$(BACK_DIR)/infra/gcp/deploy-staging.sh"

gcp-domains:
	@"$(BACK_DIR)/infra/gcp/setup-custom-domains.sh"

gcp-disable-premedica:
	@"$(BACK_DIR)/infra/gcp/disable-premedica.sh"

gcp-smoke:
	@"$(BACK_DIR)/infra/gcp/smoke-test.sh"

gcp-scale-up:
	@"$(BACK_DIR)/infra/gcp/scale-staging.sh" 1

gcp-scale-down:
	@"$(BACK_DIR)/infra/gcp/scale-staging.sh" 0

gcp-scale-scheduler:
	@"$(BACK_DIR)/infra/gcp/setup-scale-scheduler.sh"

gcp-staging-db-sync:
	@"$(BACK_DIR)/infra/gcp/setup-staging-db-sync.sh"

INFRA_DIR := $(MONOREPO_ROOT)/../infra

gcp-staging-db-sync-run:
	cd "$(INFRA_DIR)/shared-mysql" && gcloud builds submit \
		--config=cloudbuild-sync-prod-to-staging.yaml \
		--project=premedica-prod-2025 \
		--region=europe-west9
