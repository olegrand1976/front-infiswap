import { describe, expect, it } from 'vitest';
import { isPartnerProductActive, PARTNER_PRODUCT_API_NAMES } from './partnerServices';

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

describe('PARTNER_PRODUCT_API_NAMES', () => {
    it('maps partner slugs to API product names', () => {
        expect(PARTNER_PRODUCT_API_NAMES.nurstech).toBe('NursTech');
        expect(PARTNER_PRODUCT_API_NAMES.nursassur).toBe('NursAssur');
    });
});
