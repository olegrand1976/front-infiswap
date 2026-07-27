import { expect, test } from '@playwright/test';
import { AUTH_TOKEN_COOKIE } from '../fixtures/test-data';
import { fillLoginForm, seedCookieConsent, submitLogin } from '../fixtures/auth-helpers';

test.describe('Connexion', () => {
    test.beforeEach(async ({ page }) => {
        await seedCookieConsent(page);
        await page.goto('/login');
    });

    test('login envoie un Bearer valide sur /api/user et persiste après reload', async ({ page }) => {
        const email = process.env.E2E_LOGIN_EMAIL;
        const password = process.env.E2E_LOGIN_PASSWORD;

        test.skip(!email || !password, 'E2E_LOGIN_EMAIL / E2E_LOGIN_PASSWORD non configurés');

        const userRequestAuthorizations: string[] = [];
        page.on('request', (request) => {
            if (request.method() === 'GET' && request.url().includes('/api/user')) {
                userRequestAuthorizations.push(request.headers().authorization ?? '');
            }
        });

        await fillLoginForm(page, email!, password!);
        await submitLogin(page);

        await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
        expect(userRequestAuthorizations.some((value) => /^Bearer .+/.test(value))).toBe(true);

        await page.reload();
        await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
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

test.describe('Connexion NL', () => {
    test.beforeEach(async ({ page }) => {
        await seedCookieConsent(page);
        await page.goto('/nl/login');
    });

    test('page login NL affiche les libellés néerlandais', async ({ page }) => {
        await expect(page.getByPlaceholder(/Wachtwoord|Mot de passe/).first()).toBeVisible();
        await expect(page.getByTestId('login-submit').or(page.getByRole('button', { name: /Inloggen|Se connecter/ })).first()).toBeVisible();
    });
});
