import { describe, expect, it } from 'vitest';
import { unwrapLaravelData } from '@/utils/laravelApiData';

describe('unwrapLaravelData', () => {
    it('returns nested data when present', () => {
        const payload = { period: { days: 30 } };
        expect(unwrapLaravelData({ data: payload })).toEqual(payload);
    });

    it('returns payload when already unwrapped', () => {
        const payload = { payment_count: 2 };
        expect(unwrapLaravelData(payload)).toEqual(payload);
    });
});
