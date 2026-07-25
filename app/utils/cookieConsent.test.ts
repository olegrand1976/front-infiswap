import { describe, expect, it } from 'vitest';
import { parseCookieConsent, DEFAULT_COOKIE_CONSENT } from './cookieConsent';

describe('parseCookieConsent', () => {
    it('returns null for empty or invalid payload', () => {
        expect(parseCookieConsent(null)).toBeNull();
        expect(parseCookieConsent('not-json')).toBeNull();
        expect(parseCookieConsent('{"analytics":"yes"}')).toBeNull();
    });

    it('parses valid preferences', () => {
        expect(parseCookieConsent(JSON.stringify({ analytics: true, marketing: false }))).toEqual({
            necessary: true,
            analytics: true,
            marketing: false,
        });
    });

    it('exposes denied defaults', () => {
        expect(DEFAULT_COOKIE_CONSENT.analytics).toBe(false);
        expect(DEFAULT_COOKIE_CONSENT.marketing).toBe(false);
    });

    it('rejects incomplete objects', () => {
        expect(parseCookieConsent(JSON.stringify({ analytics: true }))).toBeNull();
        expect(parseCookieConsent(JSON.stringify({ marketing: false }))).toBeNull();
    });
});
