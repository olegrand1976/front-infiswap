import { expect, test, type Page, type Route } from '@playwright/test';
import { fillLoginForm, seedCookieConsent, submitLogin } from '../fixtures/auth-helpers';

const INSTITUTION_ID = 501;
const REPRESENTATIVE_USER_ID = 9001;
const CRM_USER_ID = 7001;

function emptyUsersCrmPayload() {
    return {
        users: {
            data: [],
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 0,
            from: null,
            to: null,
        },
        count: 0,
        trashCount: 0,
    };
}

function institutionsCrmPayload(crmId: number | null) {
    return {
        institutions: {
            data: [{
                id: INSTITUTION_ID,
                institution_id: INSTITUTION_ID,
                representative_user_id: REPRESENTATIVE_USER_ID,
                full_name: 'Clinique E2E CRM',
                email: 'e2e-crm@institution.be',
                phone_number: '+32-2-111111',
                account_type: 'institution',
                status: 'active',
                status_label: 'Actif',
                crm: {
                    id: crmId,
                    nb_call: 0,
                    nb_sale: 0,
                    nb_recommandation: 0,
                    nb_meeting: 0,
                    nb_pending: 0,
                    last_contact_date: null,
                    last_contact_method: null,
                },
                subscription: null,
                commercial_offer: null,
                registration_source: 'site',
            }],
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 1,
            from: 1,
            to: 1,
        },
        count: 1,
    };
}

function kpisPayload() {
    return {
        data: {
            total: 1,
            registered_this_month: 0,
            registered_previous_month: 0,
            without_contact_30_days: 0,
            total_sales: 0,
            with_active_subscription: 0,
            with_signed_bc: 0,
        },
    };
}

async function mockCrmInstitutionKpiApis(page: Page): Promise<{
    ensureCalls: number;
    plusBodies: unknown[];
}> {
    const state = {
        ensureCalls: 0,
        plusBodies: [] as unknown[],
    };

    await page.route('**/api/crm/kpis**', async (route: Route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(kpisPayload()),
        });
    });

    await page.route('**/api/crm/institutions/*/ensure-contact', async (route: Route) => {
        state.ensureCalls += 1;
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                message: 'Contact CRM prêt.',
                representative_user_id: REPRESENTATIVE_USER_ID,
                crm: {
                    id: CRM_USER_ID,
                    nb_call: 0,
                    nb_sale: 0,
                    nb_recommandation: 0,
                    nb_meeting: 0,
                    nb_pending: 0,
                    client_type: 'user',
                },
            }),
        });
    });

    await page.route('**/api/crm/plus', async (route: Route) => {
        try {
            state.plusBodies.push(route.request().postDataJSON());
        }
        catch {
            state.plusBodies.push(null);
        }
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                message: 'ok',
                crm: {
                    id: CRM_USER_ID,
                    nb_call: 0,
                    nb_sale: 0,
                    nb_recommandation: 0,
                    nb_meeting: 1,
                    nb_pending: 0,
                    client_type: 'user',
                },
            }),
        });
    });

    await page.route('**/api/crm/institutions**', async (route: Route) => {
        if (route.request().method() !== 'GET') {
            await route.fallback();
            return;
        }

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(institutionsCrmPayload(null)),
        });
    });

    await page.route('**/api/crm**', async (route: Route) => {
        const url = route.request().url();
        if (url.includes('/api/crm/institutions') || url.includes('/api/crm/kpis') || url.includes('/api/crm/plus')) {
            await route.fallback();
            return;
        }

        if (route.request().method() !== 'GET') {
            await route.fallback();
            return;
        }

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(emptyUsersCrmPayload()),
        });
    });

    return state;
}

test.describe('Admin CRM institution KPI +', { tag: '@p1' }, () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test('ensure-contact puis + RDV envoie POST /api/crm/plus meeting', async ({ page }) => {
        const email = process.env.E2E_ADMIN_EMAIL || process.env.E2E_LOGIN_EMAIL;
        const password = process.env.E2E_ADMIN_PASSWORD || process.env.E2E_LOGIN_PASSWORD;

        test.skip(
            !email || !password,
            'E2E_ADMIN_EMAIL/PASSWORD ou E2E_LOGIN_EMAIL/PASSWORD (staff CRM) requis',
        );

        await seedCookieConsent(page);
        await page.goto('/login');
        await fillLoginForm(page, email!, password!);
        await submitLogin(page);
        await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });

        const mocks = await mockCrmInstitutionKpiApis(page);

        await page.goto('/dashboard/admin/users/crm');
        await expect(page.getByRole('heading', { name: /CRM/i })).toBeVisible({ timeout: 20_000 });

        await page.getByTestId('crm-tab-institutions').click();
        await expect(page.getByText('Clinique E2E CRM')).toBeVisible({ timeout: 15_000 });

        await page.getByRole('button', { name: 'Ajouter un rendez-vous' }).click();

        await expect.poll(() => mocks.ensureCalls, { timeout: 10_000 }).toBe(1);
        await expect.poll(() => mocks.plusBodies.length, { timeout: 10_000 }).toBe(1);

        const plusBody = mocks.plusBodies[0] as {
            user_id: number;
            history: Array<{ action_type: string }>;
        };

        expect(plusBody.user_id).toBe(REPRESENTATIVE_USER_ID);
        expect(plusBody.history[0]?.action_type).toBe('meeting');
        await expect(page.getByText(/Total semaine : 1/)).toBeVisible({ timeout: 10_000 });
    });
});
