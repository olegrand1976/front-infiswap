import { describe, expect, it } from 'vitest';
import {
    formatReferrerDisplay,
    normalizeReferralCode,
    readReferralFromRoute,
} from './referral';

describe('referral utils', () => {
    it('normalizes referral codes', () => {
        expect(normalizeReferralCode(' abc123 ')).toBe('ABC123');
        expect(normalizeReferralCode('abc12')).toBeNull();
        expect(normalizeReferralCode('')).toBeNull();
        expect(normalizeReferralCode(null)).toBeNull();
    });

    it('reads referral code from route query', () => {
        expect(readReferralFromRoute({ referral: 'abc123' })).toBe('ABC123');
        expect(readReferralFromRoute({ referral: ['xyz789'] })).toBe('XYZ789');
        expect(readReferralFromRoute({})).toBeNull();
    });

    it('formats referrer display name', () => {
        expect(formatReferrerDisplay('Jean', 'D')).toBe('Jean D.');
        expect(formatReferrerDisplay('Marie', '')).toBe('Marie');
    });
});
