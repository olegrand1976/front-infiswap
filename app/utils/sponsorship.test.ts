import { describe, expect, it } from 'vitest';
import { formatSponsorshipAmount } from './sponsorship';

describe('sponsorship', () => {
    it('formats euro amounts without decimals', () => {
        expect(formatSponsorshipAmount(50)).toMatch(/50/);
    });
});
