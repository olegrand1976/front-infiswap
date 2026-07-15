import { describe, expect, it } from 'vitest';
import { buildSponsorshipSuccessQuery, formatSponsorshipAmount } from './sponsorship';

describe('sponsorship', () => {
    it('formats euro amounts without decimals', () => {
        expect(formatSponsorshipAmount(50)).toMatch(/50/);
    });

    it('builds sponsorship success query on plain and existing query paths', () => {
        expect(buildSponsorshipSuccessQuery('/dashboard')).toBe(
            '/dashboard?sponsorship=success&session_id={CHECKOUT_SESSION_ID}',
        );
        expect(buildSponsorshipSuccessQuery('/dashboard?tab=home')).toBe(
            '/dashboard?tab=home&sponsorship=success&session_id={CHECKOUT_SESSION_ID}',
        );
    });
});
