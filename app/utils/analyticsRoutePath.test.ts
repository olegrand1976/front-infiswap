import { describe, expect, it } from 'vitest';
import { normalizeAnalyticsRoutePath, shortenRoutePath } from './analyticsRoutePath';

describe('normalizeAnalyticsRoutePath', () => {
    it('normalizes numeric and uuid segments', () => {
        expect(normalizeAnalyticsRoutePath('/dashboard/replacements/detail/42')).toBe('/dashboard/replacements/detail/:id');
        expect(normalizeAnalyticsRoutePath('dashboard/users/abc-123')).toBe('/dashboard/users/abc-123');
        expect(normalizeAnalyticsRoutePath('/dashboard/admin/users/550e8400-e29b-41d4-a716-446655440000'))
            .toBe('/dashboard/admin/users/:id');
    });

    it('returns root for empty paths', () => {
        expect(normalizeAnalyticsRoutePath('')).toBe('/');
        expect(normalizeAnalyticsRoutePath('   ')).toBe('/');
    });
});

describe('shortenRoutePath', () => {
    it('truncates long paths from the start', () => {
        const path = '/dashboard/admin/marketing-analytics/overview/details';
        expect(shortenRoutePath(path, 20)).toBe('…cs/overview/details');
    });
});
