import { expect, test } from '@playwright/test';

const CONSENT_KEY = 'infiswap:cookie_consent:v1';

async function gotoHomeWithoutConsent(page: import('@playwright/test').Page) {
    await page.goto('/');
}

function cookieBanner(page: import('@playwright/test').Page) {
    return page.getByRole('dialog', { name: /Cookies et confidentialité/i });
}

async function skipIfBannerMissing(
    page: import('@playwright/test').Page,
): Promise<boolean> {
    const banner = cookieBanner(page);
    const visible = await banner.isVisible().catch(() => false);
    if (!visible) {
        if (process.env.REQUIRE_COOKIE_BANNER === '1') {
            throw new Error('Bandeau cookies requis (REQUIRE_COOKIE_BANNER=1) mais absent sur BASE_URL');
        }
        test.skip(true, 'Bandeau cookies non déployé sur BASE_URL — déployer le front staging');
        return false;
    }
    return true;
}

test.describe('Consentement cookies RGPD', () => {
    test.beforeEach(async ({ context, page }) => {
        await context.clearCookies();
        await page.addInitScript((key) => {
            try {
                localStorage.removeItem(key);
            }
            catch {
                // ignore
            }
        }, CONSENT_KEY);
    });

    test('premier visit affiche le bandeau et Refuser persiste un refus', async ({ page }) => {
        const metaRequests: string[] = [];
        page.on('request', (request) => {
            if (/facebook\.net|fbevents/i.test(request.url())) {
                metaRequests.push(request.url());
            }
        });

        await gotoHomeWithoutConsent(page);
        if (!(await skipIfBannerMissing(page))) {
            return;
        }

        const banner = cookieBanner(page);
        await expect(banner).toBeVisible();

        await banner.getByRole('button', { name: 'Refuser' }).click();
        await expect(banner).toBeHidden();

        const stored = await page.evaluate(key => localStorage.getItem(key), CONSENT_KEY);
        expect(stored).toBeTruthy();
        const parsed = JSON.parse(stored!);
        expect(parsed.analytics).toBe(false);
        expect(parsed.marketing).toBe(false);

        await expect
            .poll(async () => {
                return page.evaluate(
                    () => !!document.querySelector('script[data-infiswap-meta-pixel]'),
                );
            }, { timeout: 5_000 })
            .toBe(false);

        expect(metaRequests.length).toBe(0);
    });

    test('Tout accepter écrit le consentement et peut charger Meta', async ({ page }) => {
        await gotoHomeWithoutConsent(page);
        if (!(await skipIfBannerMissing(page))) {
            return;
        }

        const banner = cookieBanner(page);
        await banner.getByRole('button', { name: 'Tout accepter' }).click();
        await expect(banner).toBeHidden();

        const stored = await page.evaluate(key => localStorage.getItem(key), CONSENT_KEY);
        const parsed = JSON.parse(stored!);
        expect(parsed.analytics).toBe(true);
        expect(parsed.marketing).toBe(true);

        await expect
            .poll(async () => {
                return page.evaluate(
                    () => !!document.querySelector('script[data-infiswap-meta-pixel]'),
                );
            }, { timeout: 10_000 })
            .toBe(true);
    });

    test('lien Cookies du footer rouvre le bandeau', async ({ page }) => {
        await gotoHomeWithoutConsent(page);
        if (!(await skipIfBannerMissing(page))) {
            return;
        }

        const banner = cookieBanner(page);
        await banner.getByRole('button', { name: 'Refuser' }).click();
        await expect(banner).toBeHidden();

        await page.getByRole('contentinfo').getByRole('button', { name: 'Cookies' }).click();
        await expect(banner).toBeVisible();
    });

    test('revoke puis re-accept marketing réinjecte le pixel sans reload', async ({ page }) => {
        await gotoHomeWithoutConsent(page);
        if (!(await skipIfBannerMissing(page))) {
            return;
        }

        const banner = cookieBanner(page);
        await banner.getByRole('button', { name: 'Tout accepter' }).click();
        await expect
            .poll(async () => {
                return page.evaluate(
                    () => !!document.querySelector('script[data-infiswap-meta-pixel]'),
                );
            }, { timeout: 10_000 })
            .toBe(true);

        await page.getByRole('contentinfo').getByRole('button', { name: 'Cookies' }).click();
        await expect(banner).toBeVisible();
        await banner.getByRole('button', { name: 'Refuser' }).click();

        await expect
            .poll(async () => {
                return page.evaluate(() => ({
                    script: !!document.querySelector('script[data-infiswap-meta-pixel]'),
                    fbq: typeof (window as Window & { fbq?: unknown }).fbq,
                }));
            })
            .toEqual({ script: false, fbq: 'undefined' });

        await page.getByRole('contentinfo').getByRole('button', { name: 'Cookies' }).click();
        await banner.getByRole('button', { name: 'Tout accepter' }).click();

        await expect
            .poll(async () => {
                return page.evaluate(
                    () => !!document.querySelector('script[data-infiswap-meta-pixel]'),
                );
            }, { timeout: 10_000 })
            .toBe(true);
    });
});
