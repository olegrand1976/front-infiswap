import { expect, test } from '@playwright/test';
import {
    fillLoginForm,
    getAuthTokenCookieValue,
    logoutViaDashboard,
    seedCookieConsent,
    seedEmptyAuthTokenCookie,
    submitLogin,
    waitForAuthenticatedDashboard,
} from '../fixtures/auth-helpers';

async function requireE2eCredentials(): Promise<{ email: string; password: string }> {
    const email = process.env.E2E_LOGIN_EMAIL;
    const password = process.env.E2E_LOGIN_PASSWORD;
    test.skip(!email || !password, 'E2E_LOGIN_EMAIL / E2E_LOGIN_PASSWORD non configurés');

    return { email: email!, password: password! };
}

test.describe('Connexion', { tag: '@p0' }, () => {
    test.beforeEach(async ({ page }) => {
        await seedCookieConsent(page);
        await page.goto('/login');
    });

    test('login envoie un Bearer valide sur /api/user et persiste après reload', async ({ page }) => {
        const { email, password } = await requireE2eCredentials();

        const userRequestAuthorizations: string[] = [];
        page.on('request', (request) => {
            if (request.method() === 'GET' && request.url().includes('/api/user')) {
                userRequestAuthorizations.push(request.headers().authorization ?? '');
            }
        });

        await fillLoginForm(page, email, password);
        await submitLogin(page);

        await waitForAuthenticatedDashboard(page);
        expect(userRequestAuthorizations.some(value => /^Bearer .+/.test(value))).toBe(true);

        await page.reload();
        await waitForAuthenticatedDashboard(page);
    });

    test('login réussi redirige vers le dashboard', async ({ page, context }) => {
        const { email, password } = await requireE2eCredentials();

        await fillLoginForm(page, email, password);
        await submitLogin(page);

        await waitForAuthenticatedDashboard(page);

        const authToken = await getAuthTokenCookieValue(context);
        expect(authToken).toBeTruthy();
    });

    test('credentials invalides restent sur la page login', async ({ page }) => {
        await fillLoginForm(page, 'invalid-e2e@example.com', 'WrongPassword99!');
        await submitLogin(page);

        await expect(page).toHaveURL(/\/login/);
        await expect(page.getByText(/incorrect|erreur|identifiant/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('utilisateur connecté est redirigé depuis /login', async ({ page }) => {
        const { email, password } = await requireE2eCredentials();

        await fillLoginForm(page, email, password);
        await submitLogin(page);
        await waitForAuthenticatedDashboard(page);

        await page.goto('/login');
        await waitForAuthenticatedDashboard(page);
    });

    test('logout UI puis re-login reste sur le dashboard', async ({ page, context }) => {
        const { email, password } = await requireE2eCredentials();

        await fillLoginForm(page, email, password);
        await submitLogin(page);
        await waitForAuthenticatedDashboard(page);

        await logoutViaDashboard(page);

        await seedCookieConsent(page);
        await page.goto('/login');
        await fillLoginForm(page, email, password);
        await submitLogin(page);

        await waitForAuthenticatedDashboard(page);
        await page.reload();
        await waitForAuthenticatedDashboard(page);

        const authToken = await getAuthTokenCookieValue(context);
        expect(authToken).toBeTruthy();
    });
});

test.describe('Connexion — cookie vide host-only', { tag: '@p0' }, () => {
    test('login OK malgré INFISWAP_TOKEN= (régression bounce)', async ({ page, context }) => {
        const { email, password } = await requireE2eCredentials();

        await context.clearCookies();
        await seedCookieConsent(page);
        await seedEmptyAuthTokenCookie(page);
        await page.goto('/login');
        await fillLoginForm(page, email, password);
        await submitLogin(page);

        await waitForAuthenticatedDashboard(page);
        await page.reload();
        await waitForAuthenticatedDashboard(page);

        const authToken = await getAuthTokenCookieValue(context);
        expect(authToken).toBeTruthy();
    });
});

test.describe('Connexion NL', { tag: '@p0' }, () => {
    test.beforeEach(async ({ page }) => {
        await seedCookieConsent(page);
        await page.goto('/nl/login');
    });

    test('page login NL affiche les libellés néerlandais', async ({ page }) => {
        await expect(page.getByPlaceholder(/Wachtwoord|Mot de passe/).first()).toBeVisible();
    });
});
