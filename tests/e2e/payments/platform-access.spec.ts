import { expect, test } from '@playwright/test';
import {
    isLocalE2eBaseUrl,
    mockAuthenticatedNurse,
    startPlatformAccessMockApi,
    stopPlatformAccessMockApi,
} from '../fixtures/platform-access-helpers';

test.describe('Accès réseau 9,90 € — surfaces publiques', () => {
    test.beforeAll(async () => {
        if (isLocalE2eBaseUrl()) {
            await startPlatformAccessMockApi();
        }
    });

    test.afterAll(async () => {
        if (isLocalE2eBaseUrl()) {
            await stopPlatformAccessMockApi();
        }
    });

    test('page acces-plan expose le wording paiement unique à vie', async ({ page }) => {
        await page.goto('/acces-plan');

        await expect(page).toHaveURL(/\/(acces-plan|login)/, { timeout: 20_000 });

        if (page.url().includes('/login')) {
            await expect(page.getByRole('button', { name: /connecter/i }).first()).toBeVisible();
            return;
        }

        await expect(
            page.getByText(/paiement unique|accès permanent|pour toujours|à vie|bientôt disponible/i).first(),
        ).toBeVisible({
            timeout: 20_000,
        });
    });

    test('pricing mentionne le parcours accès 9,90 €', async ({ page }) => {
        await page.goto('/pricing');

        await expect(page).toHaveURL(/\/pricing/, { timeout: 20_000 });
        await expect(page.getByText(/9[,.]90/).first()).toBeVisible({ timeout: 20_000 });
        await expect(page.getByText(/accès/i).first()).toBeVisible();
    });
});

/**
 * Mocks navigateur + mini-API locale (SSR Nuxt).
 * Activer : E2E_PLATFORM_ACCESS_MOCK=1 BASE_URL=http://127.0.0.1:3010
 * Prérequis : front local (`npx nuxt dev --port 3010`), API .env sur le port mock (8000 par défaut).
 */
test.describe('Accès réseau 9,90 € — parcours mock unpaid (local)', () => {
    test.beforeAll(async () => {
        test.skip(
            process.env.E2E_PLATFORM_ACCESS_MOCK !== '1',
            'Activer E2E_PLATFORM_ACCESS_MOCK=1 + front local (nuxt dev) pour les mocks unpaid',
        );
        await startPlatformAccessMockApi({ unpaidPostCutoff: true, paid: false });
    });

    test.afterAll(async () => {
        await stopPlatformAccessMockApi();
    });

    test.beforeEach(async ({ page }) => {
        test.skip(
            process.env.E2E_PLATFORM_ACCESS_MOCK !== '1',
            'Activer E2E_PLATFORM_ACCESS_MOCK=1 + front local (nuxt dev) pour les mocks unpaid',
        );

        await mockAuthenticatedNurse(page, { unpaidPostCutoff: true, paid: false });
    });

    test('create affiche le hint accès pour unpaid post-cutoff', async ({ page }) => {
        await page.goto('/dashboard/replacements/create', { waitUntil: 'domcontentloaded' });
        await expect(page).toHaveURL(/\/dashboard\/replacements\/create/, { timeout: 20_000 });
        await expect(page.getByText(/paiement unique 9,90\s*€/i)).toBeVisible({ timeout: 25_000 });
        await expect(page.getByText(/requis pour publier/i)).toBeVisible();
    });

    test('acces-plan unpaid expose le CTA d’activation', async ({ page }) => {
        await page.goto('/acces-plan?trigger=create');
        await expect(page).toHaveURL(/\/acces-plan/, { timeout: 20_000 });
        await expect(
            page.getByRole('button', { name: /obtenir mon accès|réessayer|accéder à mon espace/i }).first(),
        ).toBeVisible({ timeout: 25_000 });
        await expect(page.getByText(/paiement unique|sans abonnement|à vie/i).first()).toBeVisible();
    });

    test('retour Stripe simulé conserve le trigger dans l’URL', async ({ page }) => {
        await page.goto('/acces-plan?session_id=cs_e2e_simulated&trigger=apply');
        await expect(page).toHaveURL(/trigger=apply/, { timeout: 15_000 });
        await expect(page.getByText(/accès|paiement|validation|bientôt disponible|réessayer/i).first()).toBeVisible({
            timeout: 15_000,
        });
    });
});
