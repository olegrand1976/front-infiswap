import http from 'node:http';
import type { AddressInfo } from 'node:net';
import type { Page } from '@playwright/test';
import { AUTH_TOKEN_COOKIE } from './test-data';

export type MockNurseOptions = {
    unpaidPostCutoff?: boolean;
    paid?: boolean;
};

const MOCK_API_PORT = Number(process.env.E2E_PLATFORM_ACCESS_MOCK_PORT || 8000);

let mockApiServer: http.Server | null = null;

const unpaidNurse = {
    id: 9001,
    firstname: 'E2E',
    lastname: 'Nurse',
    full_name: 'E2E Nurse',
    email: 'e2e.nurse@example.com',
    account_type: 'nurse',
    roles: ['nurse'],
    created_at: '2026-07-10T10:00:00.000000Z',
    platform_access_paid_at: null as string | null,
    email_verified_at: '2026-07-10T10:00:00.000000Z',
    status: 'active',
    profile: { country: 'be' },
    settings: null,
};

const accessPlanPayload = {
    access: {
        id: 1,
        name: 'Accès InfiSwap',
        amount: '9.90',
        currency: 'eur',
        description: 'Accès réseau — paiement unique, à vie',
        stripe_price_id: 'price_e2e_platform',
        interval: 'one_time',
    },
};

const statsPayload = {
    members_total: 2500,
    matched_replacements_total: 1800,
    active_users: 900,
    growth: { new_members_30d: 100, percent_vs_previous_30d: 10 },
};

function cookieDomain(): string {
    return new URL(process.env.BASE_URL ?? 'https://infiswap.ll-it-sc.be').hostname;
}

export function isLocalE2eBaseUrl(): boolean {
    const base = process.env.BASE_URL ?? '';

    return /localhost|127\.0\.0\.1/.test(base);
}

function json(res: http.ServerResponse, status: number, body: unknown): void {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    });
    res.end(JSON.stringify(body));
}

/**
 * Mini API sur le port du .env front (souvent 8000) pour que le SSR Nuxt
 * et le navigateur reçoivent les mêmes stubs (Playwright n’intercepte pas le SSR).
 */
export async function startPlatformAccessMockApi(options: MockNurseOptions = {}): Promise<void> {
    if (mockApiServer) {
        return;
    }

    const paid = options.paid ?? false;
    const unpaidPostCutoff = options.unpaidPostCutoff ?? true;
    const user = {
        ...unpaidNurse,
        created_at: unpaidPostCutoff ? '2026-07-10T10:00:00.000000Z' : '2026-06-01T10:00:00.000000Z',
        platform_access_paid_at: paid ? '2026-07-12T10:00:00.000000Z' : null,
    };

    mockApiServer = http.createServer((req, res) => {
        const url = req.url?.split('?')[0] ?? '';

        if (req.method === 'OPTIONS') {
            res.writeHead(204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
            });
            res.end();
            return;
        }

        if (url === '/api/user' || url.endsWith('/api/user')) {
            json(res, 200, user);
            return;
        }

        if (url.includes('/api/user/roles')) {
            json(res, 200, ['nurse']);
            return;
        }

        if (url.includes('/api/notifications/unread-count')) {
            json(res, 200, { count: 0 });
            return;
        }

        if (url.includes('/api/subscription/plans')) {
            json(res, 200, accessPlanPayload);
            return;
        }

        if (url.includes('/api/subscription/current')) {
            json(res, 200, {
                status: paid ? 'active' : 'no_access',
                plan: null,
                paid_at: paid ? '2026-07-12T10:00:00.000000Z' : null,
            });
            return;
        }

        if (url.includes('/api/subscription/') && url.includes('/check')) {
            json(res, 200, {
                status: paid ? 'active' : 'expired',
                payment_required: unpaidPostCutoff && !paid,
            });
            return;
        }

        if (url.includes('/api/subscription/confirm')) {
            // Évite la boucle de retry (4×1,5s) sur le retour Stripe simulé.
            json(res, 422, { status: 'error', message: 'e2e simulated confirm' });
            return;
        }

        if (url.includes('/api/platform/stats')) {
            json(res, 200, statsPayload);
            return;
        }

        if (url.includes('/api/care-types')) {
            json(res, 200, { care_types: [] });
            return;
        }

        json(res, 200, {});
    });

    await new Promise<void>((resolve, reject) => {
        mockApiServer!.once('error', reject);
        // Écoute dual-stack : le SSR Nuxt utilise souvent `localhost` → ::1.
        mockApiServer!.listen(MOCK_API_PORT, () => resolve());
    });

    const address = mockApiServer.address() as AddressInfo;
    // eslint-disable-next-line no-console
    console.log(`[e2e] platform-access mock API on port ${address.port}`);
}

export async function stopPlatformAccessMockApi(): Promise<void> {
    if (!mockApiServer) {
        return;
    }

    const server = mockApiServer;
    mockApiServer = null;

    await new Promise<void>((resolve) => {
        server.close(() => resolve());
    });
}

/** Cookie auth navigateur (complète la mock API SSR). */
export async function mockAuthenticatedNurse(page: Page, options: MockNurseOptions = {}): Promise<void> {
    const unpaidPostCutoff = options.unpaidPostCutoff ?? true;
    const paid = options.paid ?? false;

    await page.context().addCookies([{
        name: AUTH_TOKEN_COOKIE,
        value: 'e2e-platform-access-token',
        domain: cookieDomain(),
        path: '/',
    }]);

    // Rebind navigateur → même stubs (au cas où l’API .env ≠ 8000).
    const user = {
        ...unpaidNurse,
        created_at: unpaidPostCutoff ? '2026-07-10T10:00:00.000000Z' : '2026-06-01T10:00:00.000000Z',
        platform_access_paid_at: paid ? '2026-07-12T10:00:00.000000Z' : null,
    };

    await page.route('**/api/user', async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(user) });
    });
    await page.route('**/api/subscription/plans', async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(accessPlanPayload) });
    });
    await page.route('**/api/subscription/*/check', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                status: paid ? 'active' : 'expired',
                payment_required: unpaidPostCutoff && !paid,
            }),
        });
    });
    await page.route('**/api/subscription/current', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                status: paid ? 'active' : 'no_access',
                plan: null,
                paid_at: paid ? '2026-07-12T10:00:00.000000Z' : null,
            }),
        });
    });
    await page.route('**/api/subscription/confirm', async (route) => {
        await route.fulfill({
            status: 422,
            contentType: 'application/json',
            body: JSON.stringify({ status: 'error', message: 'e2e simulated confirm' }),
        });
    });
    await page.route('**/api/platform/stats', async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(statsPayload) });
    });
    await page.route('**/api/care-types**', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ care_types: [] }),
        });
    });
}
