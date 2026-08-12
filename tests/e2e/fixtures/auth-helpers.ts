import { expect, type Locator, type Page } from '@playwright/test';
import { AUTH_TOKEN_COOKIE, type RegistrationFormData } from './test-data';

function visibleRegistrationForm(page: Page): Locator {
    return page.locator('form:visible').first();
}

/**
 * Pré-seed le consentement cookies (nécessaires uniquement) avant la première
 * navigation : le bandeau RGPD (fixed bottom z-[100]) recouvre sinon les boutons
 * de formulaire et fait échouer les clics Playwright.
 */
export async function seedCookieConsent(page: Page): Promise<void> {
    await page.addInitScript(() => {
        try {
            localStorage.setItem(
                'infiswap:cookie_consent:v1',
                JSON.stringify({ necessary: true, analytics: false, marketing: false }),
            );
        }
        catch {
            // storage indisponible : le bandeau s'affichera, sans bloquer le script
        }
    });
}

/**
 * Simule le cookie host-only vide (régression login bounce août 2026).
 * Une seule fois via evaluate (addCookies refuse value='', addInitScript
 * réinjecterait le vide à chaque navigation).
 */
export async function seedEmptyAuthTokenCookie(page: Page): Promise<void> {
    const baseURL = process.env.BASE_URL || 'http://127.0.0.1:3000';
    await page.goto(new URL('/', baseURL).href);
    await page.evaluate((cookieName: string) => {
        document.cookie = `${cookieName}=; path=/; SameSite=Lax`;
    }, AUTH_TOKEN_COOKIE);
}

/**
 * Ferme le gate niveau d'études (overlay Dialog z-50) qui bloque le menu compte.
 */
export async function dismissEducationLevelGateIfOpen(page: Page): Promise<void> {
    const gate = page.locator('[role="dialog"]').filter({
        has: page.locator('input[name="education-level-gate"]'),
    });

    try {
        await gate.waitFor({ state: 'visible', timeout: 2_000 });
    }
    catch {
        return;
    }

    await gate.locator('input[name="education-level-gate"]').first().check({ force: true });
    await gate.getByRole('button', { name: 'Valider' }).click({ force: true });
    await expect(gate).toBeHidden({ timeout: 15_000 });
}

export async function fillLoginForm(page: Page, identifier: string, password: string): Promise<void> {
    await page.getByPlaceholder('Email').first().fill(identifier);
    await page.getByPlaceholder(/Mot de passe|Wachtwoord/).first().fill(password);
}

export async function submitLogin(page: Page): Promise<void> {
    const submit = page.getByTestId('login-submit').first();
    if (await submit.count()) {
        await submit.click();
        return;
    }

    await page.getByRole('button', { name: /Se connecter|Inloggen/ }).first().click();
}

/** Attend le dashboard authentifié (évite le skeleton tant que user est null). */
export async function waitForAuthenticatedDashboard(page: Page): Promise<void> {
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
    // Soft nav peut basculer en hard reload (window.location.assign).
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByTestId('account-menu-trigger').first()).toBeVisible({ timeout: 45_000 });
}

/** Cookie session non vide (évite INFISWAP_TOKEN= host-only qui masque le vrai token). */
export async function getAuthTokenCookieValue(context: { cookies: () => Promise<Array<{ name: string; value: string }>> }): Promise<string | undefined> {
    const cookies = await context.cookies();
    const match = cookies
        .filter(cookie => cookie.name === AUTH_TOKEN_COOKIE)
        .map(cookie => cookie.value.trim())
        .find(Boolean);

    return match;
}

/** Déconnexion via le menu compte du layout dashboard (appelle logout() app). */
export async function logoutViaDashboard(page: Page): Promise<void> {
    await waitForAuthenticatedDashboard(page);
    await dismissEducationLevelGateIfOpen(page);

    const trigger = page.getByTestId('account-menu-trigger').first();
    await trigger.click({ force: true });
    const logoutItem = page.getByRole('menuitem', { name: /Déconnexion|Uitloggen/ });
    await expect(logoutItem).toBeVisible({ timeout: 10_000 });
    // force : l’overlay Dialog (gate études) peut rester au-dessus du portail menu
    await logoutItem.click({ force: true });
    await expect(page).toHaveURL((url) => {
        const path = typeof url === 'string' ? new URL(url).pathname : url.pathname;
        return path === '/' || path === '';
    }, { timeout: 15_000 });
}

export async function fillRegistrationForm(page: Page, data: RegistrationFormData): Promise<void> {
    const form = visibleRegistrationForm(page);

    await form.getByPlaceholder(/Nom \*|Naam \*/).fill(data.lastname);
    await form.getByPlaceholder(/Prénoms \*|Voornamen \*/).fill(data.firstname);
    await form.getByPlaceholder(/Email \*|E-mail \*/).fill(data.email);
    await form.getByPlaceholder(/N° de téléphone \*|Telefoonnummer \*/).fill(data.phoneNumber);
    await form.getByPlaceholder(/Mot de passe \*|Wachtwoord \*/).fill(data.password);
    await form.getByPlaceholder(/Confirmation mot de passe \*|Bevestig wachtwoord \*/).fill(data.password);
    await form.getByPlaceholder(/Rue \*|Straat \*/).fill(data.street);
    await form.getByPlaceholder(/Code postal \*|Postcode \*/).fill(data.zipCode);
    await form.getByPlaceholder(/Ville \*|Stad \*/).fill(data.city);

    const workingCountriesBlock = form.locator('div.col-span-4').filter({ hasText: 'Pays de recherche' });
    const belgiumCheckbox = workingCountriesBlock.getByRole('checkbox').first();
    await belgiumCheckbox.scrollIntoViewIfNeeded();

    // La Belgique est pré-cochée via SSR (useCountry). On force l'état "coché" de
    // façon déterministe : un simple toggle décocherait le pays et invaliderait le
    // formulaire selon le timing d'hydratation.
    await expect(belgiumCheckbox).toBeVisible();
    if ((await belgiumCheckbox.getAttribute('aria-checked')) !== 'true') {
        await belgiumCheckbox.click();
    }
    await expect(belgiumCheckbox).toBeChecked();

    // Le <Select> radix est portalisé : en CI headless, un simple clic trigger + clic
    // option peut ne pas committer la valeur (race d'animation), laissant
    // professionalCategory vide et le bouton désactivé. On réessaie l'ouverture jusqu'à
    // ce que l'option soit réellement visible, puis on vérifie que le trigger reflète
    // bien la sélection.
    const categoryTrigger = form.getByRole('combobox').filter({ hasText: 'Catégorie professionnelle' });
    await categoryTrigger.scrollIntoViewIfNeeded();
    const independentOption = page.getByRole('option', { name: 'Indépendant(e)' });
    await expect(async () => {
        await categoryTrigger.click();
        await expect(independentOption).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 15_000 });
    await independentOption.click();
    await expect(form.getByRole('combobox').filter({ hasText: 'Indépendant(e)' })).toBeVisible();

    const charteCheckbox = form.getByRole('checkbox', { name: 'charte de bonne conduite' });
    await charteCheckbox.scrollIntoViewIfNeeded();
    if ((await charteCheckbox.getAttribute('aria-checked')) !== 'true') {
        await charteCheckbox.click();
    }
    await expect(charteCheckbox).toBeChecked();
}

export async function submitRegistration(page: Page): Promise<void> {
    const submitButton = visibleRegistrationForm(page).getByRole('button', { name: /S'inscrire|Registreren/ });
    await expect(submitButton).toBeEnabled({ timeout: 15_000 });
    await submitButton.click();
}

export async function cleanupE2eUsers(apiUrl: string): Promise<void> {
    const secret = process.env.MONITORING_RUN_SECRET;
    if (!secret) {
        return;
    }

    await fetch(`${apiUrl}/api/monitoring/e2e-cleanup`, {
        method: 'POST',
        headers: {
            'X-Monitoring-Secret': secret,
            'Accept': 'application/json',
        },
    }).catch(() => undefined);
}

export async function openNlLogin(page: Page, baseURL: string): Promise<void> {
    await seedCookieConsent(page);
    await page.goto(`${baseURL.replace(/\/$/, '')}/nl/login`);
}
