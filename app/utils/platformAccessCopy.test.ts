import { describe, expect, it } from 'vitest';
import {
    PLATFORM_ACCESS_HINT_APPLY,
    PLATFORM_ACCESS_HINT_PUBLISH,
    platformAccessModalCopy,
    sanitizePlatformAccessTrigger,
} from './platformAccessCopy';

describe('platformAccessCopy', () => {
    it('returns apply-specific modal copy', () => {
        const copy = platformAccessModalCopy('apply');

        expect(copy.title).toContain('candidature');
        expect(copy.lead).toContain('positionner');
        expect(copy.priceLabel).toContain('paiement unique');
        expect(copy.title).not.toContain('annonce');
    });

    it('returns create/default modal copy for publish triggers', () => {
        expect(platformAccessModalCopy('create').title).toContain('publier');
        expect(platformAccessModalCopy('direct').title).toContain('publier');
        expect(platformAccessModalCopy(null).lead).toContain('publier');
    });

    it('sanitizes analytics triggers', () => {
        expect(sanitizePlatformAccessTrigger('apply')).toBe('apply');
        expect(sanitizePlatformAccessTrigger('create')).toBe('create');
        expect(sanitizePlatformAccessTrigger('platform_access_upsell')).toBe('platform_access_upsell');
        expect(sanitizePlatformAccessTrigger('evil')).toBe('direct');
        expect(sanitizePlatformAccessTrigger(undefined)).toBe('direct');
    });

    it('keeps amont hints stable for create and apply', () => {
        expect(PLATFORM_ACCESS_HINT_PUBLISH).toContain('publier');
        expect(PLATFORM_ACCESS_HINT_APPLY).toContain('candidater');
        expect(PLATFORM_ACCESS_HINT_PUBLISH).toContain('9,90');
        expect(PLATFORM_ACCESS_HINT_APPLY).toContain('paiement unique');
    });
});
