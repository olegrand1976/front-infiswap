import { expect, test } from '@playwright/test';
import { fillLoginForm, submitLogin } from '../fixtures/auth-helpers';

const SIMULATED_SESSION = 'cs_e2e_simulated';

test.describe('Retours Stripe simulés', () => {
    test.beforeEach(async ({ page }) => {
        const email = process.env.E2E_LOGIN_EMAIL;
        const password = process.env.E2E_LOGIN_PASSWORD;

        test.skip(!email || !password, 'E2E_LOGIN_EMAIL / E2E_LOGIN_PASSWORD non configurés');

        await page.goto('/login');
        await fillLoginForm(page, email!, password!);
        await submitLogin(page);
        await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
    });

    test('acces-plan redirige vers le dashboard (produit retiré)', async ({ page }) => {
        await page.goto(`/acces-plan?session_id=${SIMULATED_SESSION}`);

        await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
    });

    test('dashboard accepte un retour sponsoring simulé', async ({ page }) => {
        await page.goto(`/dashboard?sponsorship=success&session_id=${SIMULATED_SESSION}`);

        await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
    });

    test('détail remplacement accepte un retour boost simulé', async ({ page }) => {
        await page.goto(`/dashboard/replacements/detail/1?boost=success&session_id=${SIMULATED_SESSION}`);

        await expect(page).toHaveURL(/\/dashboard\/replacements/, { timeout: 15_000 });
    });

    test('liste candidats accepte un retour contrat simulé', async ({ page }) => {
        await page.goto(`/dashboard/replacements/detail/1/list?contract=success&session_id=${SIMULATED_SESSION}`);

        await expect(page).toHaveURL(/\/dashboard\/replacements\/detail\/1\/list/, { timeout: 15_000 });
    });
});
