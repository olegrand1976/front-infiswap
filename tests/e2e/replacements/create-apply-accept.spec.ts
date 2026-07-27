import { expect, test } from '@playwright/test';
import {
    acceptWithoutContractViaUi,
    applyToReplacementViaUi,
    createReplacementViaApi,
    getAuthToken,
    loginAs,
    logoutViaUi,
    replacementE2eCredentials,
} from '../fixtures/replacement-helpers';

test.describe('Remplacements — création / candidature / acceptation', () => {
    test('happy path API create + UI apply + UI accept', async ({ page, context }) => {
        const credentials = replacementE2eCredentials();
        test.skip(!credentials, 'E2E_CREATOR_* / E2E_CANDIDATE_* non configurés');

        await loginAs(page, credentials!.creatorEmail, credentials!.creatorPassword);
        const creatorToken = await getAuthToken(context);
        const replacementId = await createReplacementViaApi(page, creatorToken);

        await logoutViaUi(page);
        await loginAs(page, credentials!.candidateEmail, credentials!.candidatePassword);
        await applyToReplacementViaUi(page, replacementId);

        await logoutViaUi(page);
        await loginAs(page, credentials!.creatorEmail, credentials!.creatorPassword);
        await acceptWithoutContractViaUi(page, replacementId);
    });

    test('UI create : formulaire minimal et submit', async ({ page }) => {
        const credentials = replacementE2eCredentials();
        test.skip(!credentials, 'E2E_CREATOR_* / E2E_CANDIDATE_* non configurés');

        await loginAs(page, credentials!.creatorEmail, credentials!.creatorPassword);
        await page.goto('/dashboard/replacements/create');

        await expect(page.getByTestId('replacement-create-submit')).toBeVisible({ timeout: 20_000 });

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

        await page.getByTestId('replacement-create-submit').click();

        await expect(page).toHaveURL(/\/dashboard\/replacements/, { timeout: 30_000 });
    });
});
