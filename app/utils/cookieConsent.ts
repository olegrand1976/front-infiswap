export type CookieConsentPreferences = {
    necessary: true;
    analytics: boolean;
    marketing: boolean;
};

export const COOKIE_CONSENT_STORAGE_KEY = 'infiswap:cookie_consent:v1';

export const DEFAULT_COOKIE_CONSENT: CookieConsentPreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
};

export function parseCookieConsent(raw: string | null): CookieConsentPreferences | null {
    if (!raw) {
        return null;
    }

    try {
        const parsed = JSON.parse(raw) as Partial<CookieConsentPreferences>;
        if (typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean') {
            return null;
        }

        return {
            necessary: true,
            analytics: parsed.analytics,
            marketing: parsed.marketing,
        };
    } catch {
        return null;
    }
}
