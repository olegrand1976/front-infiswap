import { expect, type BrowserContext, type Page } from '@playwright/test';
import { AUTH_TOKEN_COOKIE } from './test-data';
import { fillLoginForm, submitLogin } from './auth-helpers';

export const API_URL = process.env.API_URL ?? 'https://api-infiswap.ll-it-sc.be';

export function replacementE2eCredentials(): {
    creatorEmail: string;
    creatorPassword: string;
    candidateEmail: string;
    candidatePassword: string;
} | null {
    const creatorEmail = process.env.E2E_CREATOR_EMAIL;
    const creatorPassword = process.env.E2E_CREATOR_PASSWORD;
    const candidateEmail = process.env.E2E_CANDIDATE_EMAIL;
    const candidatePassword = process.env.E2E_CANDIDATE_PASSWORD;

    if (!creatorEmail || !creatorPassword || !candidateEmail || !candidatePassword) {
        return null;
    }

    return { creatorEmail, creatorPassword, candidateEmail, candidatePassword };
}

export async function loginAs(page: Page, email: string, password: string): Promise<void> {
    await page.goto('/login');
    await fillLoginForm(page, email, password);
    await submitLogin(page);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
}

export async function getAuthToken(context: BrowserContext): Promise<string> {
    const cookies = await context.cookies();
    const token = cookies.find(cookie => cookie.name === AUTH_TOKEN_COOKIE)?.value;
    if (!token) {
        throw new Error(`Cookie ${AUTH_TOKEN_COOKIE} introuvable après login`);
    }

    return token;
}

export async function logoutViaUi(page: Page): Promise<void> {
    await page.context().clearCookies();
    await page.goto('/login');
}

type StoreReplacementPayload = {
    periods: Array<{ startDate: string; endDate: string }>;
    roleType: string;
    patientCount: string;
    zipCodes: string[];
    cities: string[];
    careTypes: number[];
    timeSlot: {
        morning: { startAt: string; endAt: string };
        evening: { startAt: string; endAt: string };
    };
    comment: string;
};

export function buildStoreReplacementPayload(overrides: Partial<StoreReplacementPayload> = {}): StoreReplacementPayload {
    const start = new Date();
    start.setDate(start.getDate() + 3);
    const end = new Date();
    end.setDate(end.getDate() + 5);

    const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);

    return {
        periods: [
            {
                startDate: toIsoDate(start),
                endDate: toIsoDate(end),
            },
        ],
        roleType: 'nurse',
        patientCount: '5',
        zipCodes: ['1000'],
        cities: ['Bruxelles'],
        careTypes: [1],
        timeSlot: {
            morning: { startAt: '08:00', endAt: '12:00' },
            evening: { startAt: '14:00', endAt: '18:00' },
        },
        comment: `E2E remplacement ${Date.now()}`,
        ...overrides,
    };
}

export async function createReplacementViaApi(
    page: Page,
    token: string,
    payload: StoreReplacementPayload = buildStoreReplacementPayload(),
): Promise<number> {
    const response = await page.request.post(`${API_URL}/api/replacements`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: payload,
    });

    if (!response.ok()) {
        const body = await response.text();
        throw new Error(`POST /api/replacements failed (${response.status()}): ${body}`);
    }

    const json = await response.json();
    const id = json?.replacement?.id ?? json?.data?.id;
    if (!id) {
        throw new Error(`Replacement id manquant dans la réponse: ${JSON.stringify(json)}`);
    }

    return Number(id);
}

export async function applyToReplacementViaUi(page: Page, replacementId: number): Promise<void> {
    await page.goto(`/dashboard/replacements/detail/${replacementId}`);
    const applyButton = page.getByTestId('replacement-apply-submit');
    await expect(applyButton).toBeVisible({ timeout: 20_000 });
    await applyButton.click();
    await expect(page.getByText('Réponse envoyée')).toBeVisible({ timeout: 20_000 });
}

export async function acceptWithoutContractViaUi(page: Page, replacementId: number): Promise<void> {
    await page.goto(`/dashboard/replacements/detail/${replacementId}/list`);
    await expect(page.getByTestId('replacement-accept-open').first()).toBeVisible({ timeout: 20_000 });
    await page.getByTestId('replacement-accept-open').first().click();
    await page.getByTestId('replacement-accept-without-contract').click();
    await expect(page.getByText('Accepté').first()).toBeVisible({ timeout: 20_000 });
}
