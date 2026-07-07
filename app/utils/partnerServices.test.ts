import { describe, expect, it } from 'vitest';
import { isPartnerProductActive } from './partnerServices';

describe('isPartnerProductActive', () => {
    it('returns true for boolean true and numeric 1', () => {
        expect(isPartnerProductActive(true)).toBe(true);
        expect(isPartnerProductActive(1)).toBe(true);
    });

    it('returns false for inactive flags', () => {
        expect(isPartnerProductActive(false)).toBe(false);
        expect(isPartnerProductActive(0)).toBe(false);
        expect(isPartnerProductActive(null)).toBe(false);
        expect(isPartnerProductActive(undefined)).toBe(false);
    });
});
