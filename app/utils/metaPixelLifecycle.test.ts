import { describe, expect, it } from 'vitest';
import {
    clearMetaPixelGlobals,
    hasAnalyticsConsentFromPrefs,
    hasMarketingConsentFromPrefs,
    resolveMetaPixelEnsureAction,
} from './metaPixelLifecycle';

describe('resolveMetaPixelEnsureAction', () => {
    it('grants only when fbq and script are both present', () => {
        expect(resolveMetaPixelEnsureAction(true, true)).toBe('grant_only');
    });

    it('reinjects after revoke (fbq stub without script)', () => {
        expect(resolveMetaPixelEnsureAction(true, false)).toBe('reinject');
    });

    it('reinjects on first load (no fbq)', () => {
        expect(resolveMetaPixelEnsureAction(false, false)).toBe('reinject');
        expect(resolveMetaPixelEnsureAction(false, true)).toBe('reinject');
    });
});

describe('clearMetaPixelGlobals', () => {
    it('removes fbq stubs so ensure can re-inject without reload', () => {
        const host: { fbq?: (...args: unknown[]) => void; _fbq?: unknown } = {
            fbq: () => undefined,
            _fbq: true,
        };

        clearMetaPixelGlobals(host);

        expect(host.fbq).toBeUndefined();
        expect(host._fbq).toBeUndefined();
    });
});

describe('consent preference helpers', () => {
    it('treats null preferences as denied', () => {
        expect(hasAnalyticsConsentFromPrefs(null)).toBe(false);
        expect(hasMarketingConsentFromPrefs(null)).toBe(false);
    });

    it('requires explicit true', () => {
        expect(hasAnalyticsConsentFromPrefs({ analytics: false })).toBe(false);
        expect(hasAnalyticsConsentFromPrefs({ analytics: true })).toBe(true);
        expect(hasMarketingConsentFromPrefs({ marketing: true })).toBe(true);
    });
});
