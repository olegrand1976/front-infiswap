import { describe, expect, it } from 'vitest';
import { normalizeSelectedFilters, normalizeSelectedFiltersType } from './selectedFilters';

describe('selectedFilters', () => {
    it('maps legacy urgent to immediate', () => {
        expect(normalizeSelectedFiltersType('urgent')).toBe('immediate');
    });

    it('keeps valid API types', () => {
        expect(normalizeSelectedFiltersType('all')).toBe('all');
        expect(normalizeSelectedFiltersType('classic')).toBe('classic');
        expect(normalizeSelectedFiltersType('immediate')).toBe('immediate');
    });

    it('defaults undefined/null to all', () => {
        expect(normalizeSelectedFiltersType(undefined)).toBe('all');
        expect(normalizeSelectedFiltersType(null)).toBe('all');
    });

    it('normalizes filter objects without dropping other keys', () => {
        expect(normalizeSelectedFilters({ type: 'urgent', role: 'nurse', status: 'open' })).toEqual({
            type: 'immediate',
            role: 'nurse',
            status: 'open',
        });
    });
});
