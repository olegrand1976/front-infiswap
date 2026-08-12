import { expect, test, type Page } from '@playwright/test';
import { fillLoginForm, submitLogin } from '../fixtures/auth-helpers';

function marketingOverviewFixture() {
    return {
        data: {
            period: {
                from: new Date().toISOString(),
                to: new Date().toISOString(),
                days: 30,
            },
            attendance: {
                today: {
                    logins: 1,
                    unique_users: 1,
                    by_account_type: {
                        nurse: { logins: 1, unique_users: 1 },
                        institution: { logins: 0, unique_users: 0 },
                        staff: { logins: 0, unique_users: 0 },
                    },
                },
                period: {
                    logins: 10,
                    unique_users: 5,
                    by_account_type: {
                        nurse: { logins: 10, unique_users: 5 },
                        institution: { logins: 0, unique_users: 0 },
                        staff: { logins: 0, unique_users: 0 },
                    },
                },
                daily_series: [],
            },
            top_screens: [],
            acquisition: {
                registrations: 2,
                email_verified: 2,
                belgium: 1,
                france: 1,
            },
            conversion: {
                registrations: 2,
                email_verified: 2,
                platform_access: 0,
                boost_purchases: 0,
                contract_purchases: 0,
            },
            journey_emails: {
                total_sends: 3,
                by_workflow: [{
                    workflow: 'warm_inactive',
                    sends: 3,
                    open_rate: 50,
                    click_rate: 50,
                }],
                daily_series: [],
                last_sent_at: new Date().toISOString(),
            },
            partners: {
                window_days: 30,
                clicks: { nurstech: 0, nursassur: 0 },
                contacts: { nurstech: 0, nursassur: 0 },
                clicks_by_placement_30d: [],
                aggregate: {},
            },
            revenue: {
                total_amount_cents: 0,
                payment_count: 0,
                payments_this_month: { count: 0, amount_cents: 0 },
                latest_payment: null,
                top_payer: null,
                by_product_type: [],
            },
        },
    };
}

async function mockMarketingJourneyApis(page: Page): Promise<void> {
    await page.route('**/api/admin/marketing-analytics?**', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(marketingOverviewFixture()),
        });
    });

    await page.route('**/api/admin/marketing-analytics/journey-templates/warm_inactive', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                data: {
                    workflow: 'warm_inactive',
                    archived: false,
                    variants: [{
                        key: 'default',
                        label: 'Relance tiède',
                        subject: 'InfiSwap — 3 remplacement(s) près de chez vous',
                        html: '<html><body><p>Bonjour Camille</p></body></html>',
                    }],
                },
            }),
        });
    });

    await page.route('**/api/admin/marketing-analytics/journey-sends/warm_inactive**', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                stats: {
                    sends: 3,
                    trackable_sends: 2,
                    opens: 1,
                    clicks: 1,
                    open_rate: 50,
                    click_rate: 50,
                },
                users: [{
                    id: 1,
                    user_id: 10,
                    full_name: 'Alice Nurse',
                    email: 'alice.journey@example.com',
                    step: null,
                    sent_at: new Date().toISOString(),
                    opened_at: new Date().toISOString(),
                    clicked_at: null,
                    open_count: 1,
                    click_count: 0,
                    trackable: true,
                }],
                count: 1,
            }),
        });
    });
}

test.describe('Admin marketing Journey KPI', { tag: '@p1' }, () => {
    test('ouvre le dialog template / destinataires au clic KPI', async ({ page }) => {
        const email = process.env.E2E_ADMIN_EMAIL || process.env.E2E_LOGIN_EMAIL;
        const password = process.env.E2E_ADMIN_PASSWORD || process.env.E2E_LOGIN_PASSWORD;

        test.skip(
            !email || !password,
            'E2E_ADMIN_EMAIL/PASSWORD ou E2E_LOGIN_EMAIL/PASSWORD (staff marketing) requis',
        );

        await page.goto('/login');
        await fillLoginForm(page, email!, password!);
        await submitLogin(page);
        await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });

        await mockMarketingJourneyApis(page);
        await page.goto('/dashboard/admin/marketing-analytics');

        await expect(page.getByRole('heading', { name: 'Emails Journey' })).toBeVisible({ timeout: 20_000 });
        const kpi = page.getByTestId('journey-workflow-kpi').first();
        await expect(kpi.getByText('Open 50 %')).toBeVisible();
        await expect(kpi.getByText('Clic 50 %')).toBeVisible();
        await kpi.click();

        const dialog = page.getByTestId('journey-workflow-dialog');
        await expect(dialog).toBeVisible();
        await expect(dialog.getByText(/Open 1/)).toBeVisible();
        await expect(dialog.getByText(/Clic 1/)).toBeVisible();
        await expect(dialog.getByRole('button', { name: 'Template' })).toBeVisible();
        await expect(dialog.getByRole('button', { name: 'Destinataires' })).toBeVisible();
        await expect(dialog.getByText(/Objet :/)).toBeVisible();
        await expect(dialog.locator('iframe[title="Prévisualisation e-mail Journey"]')).toBeVisible();

        await dialog.getByRole('button', { name: 'Destinataires' }).click();
        await expect(dialog.getByText('alice.journey@example.com')).toBeVisible();
    });
});
