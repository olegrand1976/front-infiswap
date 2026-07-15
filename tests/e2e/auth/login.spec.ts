import { expect, test } from '@playwright/test';
import { AUTH_TOKEN_COOKIE } from '../fixtures/test-data';
import { fillLoginForm, submitLogin } from '../fixtures/auth-helpers';

test.describe('Connexion', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('login réussi redirige vers le dashboard', async ({ page, context }) => {
        const email = process.env.E2E_LOGIN_EMAIL;
        const password = process.env.E2E_LOGIN_PASSWORD;

        test.skip(!email || !password, 'E2E_LOGIN_EMAIL / E2E_LOGIN_PASSWORD non configurés');

        await fillLoginForm(page, email!, password!);
        await submitLogin(page);

        await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });

        const cookies = await context.cookies();
        const authCookie = cookies.find((c) => c.name === AUTH_TOKEN_COOKIE);
        expect(authCookie?.value).toBeTruthy();
    });

    test('credentials invalides restent sur la page login', async ({ page }) => {
        await fillLoginForm(page, 'invalid-e2e@example.com', 'WrongPassword99!');
        await submitLogin(page);

        await expect(page).toHaveURL(/\/login/);
        await expect(page.getByText(/incorrect|erreur|identifiant/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('utilisateur connecté est redirigé depuis /login', async ({ page }) => {
        const email = process.env.E2E_LOGIN_EMAIL;
        const password = process.env.E2E_LOGIN_PASSWORD;

        test.skip(!email || !password, 'E2E_LOGIN_EMAIL / E2E_LOGIN_PASSWORD non configurés');

        await fillLoginForm(page, email!, password!);
        await submitLogin(page);
        await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });

        await page.goto('/login');
        await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
    });
});
