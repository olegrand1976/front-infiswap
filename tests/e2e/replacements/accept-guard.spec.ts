import { expect, test } from '@playwright/test';
import {
    API_URL,
    acceptWithoutContractViaUi,
    createReplacementViaApi,
    getAuthToken,
    loginAs,
    logoutViaUi,
    replacementE2eCredentials,
} from '../fixtures/replacement-helpers';

test.describe('Remplacements — garde anti double acceptation', { tag: '@p1' }, () => {
    test('après une acceptation, plus de bouton Accepter pour les autres candidatures', async ({ page, context }) => {
        const credentials = replacementE2eCredentials();
        test.skip(!credentials, 'E2E_CREATOR_* / E2E_CANDIDATE_* non configurés');

        await loginAs(page, credentials!.creatorEmail, credentials!.creatorPassword);
        const creatorToken = await getAuthToken(context);
        const replacementId = await createReplacementViaApi(page, creatorToken);

        await logoutViaUi(page);
        await loginAs(page, credentials!.candidateEmail, credentials!.candidatePassword);
        const candidateToken = await getAuthToken(context);

        const meResponse = await page.request.get(`${API_URL}/api/user`, {
            headers: {
                Authorization: `Bearer ${candidateToken}`,
                Accept: 'application/json',
            },
        });
        expect(meResponse.ok()).toBeTruthy();
        const me = await meResponse.json();
        const candidateId = me?.id ?? me?.user?.id;
        expect(candidateId).toBeTruthy();

        const applyResponse = await page.request.post(`${API_URL}/api/replacement-responses/send`, {
            headers: {
                'Authorization': `Bearer ${candidateToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: {
                replacementId,
                respondedBy: candidateId,
                comment: 'E2E garde accept',
            },
        });
        expect(applyResponse.ok()).toBeTruthy();

        await logoutViaUi(page);
        await loginAs(page, credentials!.creatorEmail, credentials!.creatorPassword);
        await acceptWithoutContractViaUi(page, replacementId);

        await page.goto(`/dashboard/replacements/detail/${replacementId}/list`);
        await expect(page.getByText('Accepté').first()).toBeVisible({ timeout: 15_000 });
        await expect(page.getByTestId('replacement-accept-open')).toHaveCount(0);
    });
});
