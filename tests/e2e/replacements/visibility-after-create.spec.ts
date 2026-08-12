import { expect, test, type Page } from '@playwright/test';
import {
    buildStoreReplacementPayload,
    createReplacementViaApi,
    getAuthToken,
    loginAs,
    replacementE2eCredentials,
} from '../fixtures/replacement-helpers';

async function fillMinimalCreateForm(page: Page): Promise<void> {
    const start = new Date();
    start.setDate(start.getDate() + 4);
    const end = new Date();
    end.setDate(end.getDate() + 6);
    const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);

    await page.getByTestId('replacement-period-start').first().fill(toIsoDate(start));
    await page.getByTestId('replacement-period-end').first().fill(toIsoDate(end));
    await page.getByPlaceholder('Entrer un nombre').fill('4');

    const morningInputs = page.locator('label:has-text("Matin")').locator('..').locator('input[type="text"]');
    if (await morningInputs.count() >= 2) {
        await morningInputs.nth(0).fill('08:00');
        await morningInputs.nth(1).fill('12:00');
    }

    const zipInput = page.getByPlaceholder(/6565|75000/).first();
    if (await zipInput.isVisible()) {
        await zipInput.fill('1000');
        await zipInput.press('Enter');
        const dialog = page.getByRole('dialog');
        if (await dialog.isVisible().catch(() => false)) {
            const confirm = dialog.getByRole('button', { name: /valider|confirmer|enregistrer|ok/i }).first();
            if (await confirm.isVisible().catch(() => false)) {
                await confirm.click();
            }
            else {
                await page.keyboard.press('Escape');
            }
        }
    }

    const careTrigger = page.getByRole('combobox').filter({ hasText: /Sélectionner|soin/i }).first();
    if (await careTrigger.isVisible().catch(() => false)) {
        await careTrigger.click();
        const firstCare = page.getByRole('checkbox').first();
        if (await firstCare.isVisible().catch(() => false)) {
            await firstCare.click();
        }
        await page.keyboard.press('Escape');
    }
}

test.describe('Remplacements — visibilité après création', { tag: '@p1' }, () => {
    test('UI create → redirect /me → présent ; bandeau Chercher', async ({ page }) => {
        const credentials = replacementE2eCredentials();
        test.skip(!credentials, 'E2E_CREATOR_* / E2E_CANDIDATE_* non configurés');

        await loginAs(page, credentials!.creatorEmail, credentials!.creatorPassword);

        const countryModal = page.getByTestId('confirm-profile-country-modal');
        if (await countryModal.isVisible().catch(() => false)) {
            await page.getByTestId('confirm-profile-country-be').click();
            await expect(countryModal).toBeHidden({ timeout: 15_000 });
        }

        await page.goto('/dashboard/replacements/create');
        await expect(page.getByTestId('replacement-create-submit')).toBeVisible({ timeout: 20_000 });

        if (await countryModal.isVisible().catch(() => false)) {
            await page.getByTestId('confirm-profile-country-be').click();
            await expect(countryModal).toBeHidden({ timeout: 15_000 });
        }

        await fillMinimalCreateForm(page);
        await page.getByTestId('replacement-create-submit').click();

        await expect(page).toHaveURL(/\/dashboard\/replacements\/me/, { timeout: 30_000 });

        await page.goto('/dashboard/replacements');
        await expect(page.getByTestId('own-replacements-hidden-banner')).toBeVisible({ timeout: 20_000 });
        await expect(page.getByTestId('own-replacements-hidden-banner').getByRole('link', { name: /mes remplacements/i })).toBeVisible();
    });

    test('filtre Urgent sur /me envoie immediate (pas 422)', async ({ page, context }) => {
        const credentials = replacementE2eCredentials();
        test.skip(!credentials, 'E2E_CREATOR_* / E2E_CANDIDATE_* non configurés');

        await loginAs(page, credentials!.creatorEmail, credentials!.creatorPassword);

        const creatorToken = await getAuthToken(context);
        await createReplacementViaApi(page, creatorToken, buildStoreReplacementPayload({
            comment: `E2E visibility filter ${Date.now()}`,
        }));

        const mergedStatuses: number[] = [];
        page.on('response', (response) => {
            if (response.url().includes('/api/replacements/search/merged') && response.request().method() === 'POST') {
                mergedStatuses.push(response.status());
            }
        });

        await context.addCookies([{
            name: 'selectedFilters',
            value: JSON.stringify({ type: 'urgent', role: 'all', status: 'open' }),
            domain: new URL(page.url()).hostname,
            path: '/',
        }]);

        await page.goto('/dashboard/replacements/me');
        await expect(page).toHaveURL(/\/dashboard\/replacements\/me/);
        await page.waitForTimeout(2_500);

        expect(mergedStatuses.some(status => status === 422)).toBeFalsy();
        expect(mergedStatuses.some(status => status === 200)).toBeTruthy();
    });
});
