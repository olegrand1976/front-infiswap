import { describe, expect, it } from 'vitest';
import {
    needsProfileCountryConfirmation,
    resolveProfileCountryCode,
    workingAtFromCountryCode,
} from './profileCountry';

describe('profileCountry', () => {
    it('needs confirmation when profile empty', () => {
        expect(needsProfileCountryConfirmation(null)).toBe(true);
        expect(needsProfileCountryConfirmation({})).toBe(true);
        expect(needsProfileCountryConfirmation({ country: null, working_at: null })).toBe(true);
        expect(needsProfileCountryConfirmation({ country: '', working_at: '  ' })).toBe(true);
    });

    it('resolves country and working_at codes', () => {
        expect(resolveProfileCountryCode({ country: 'be' })).toBe('be');
        expect(resolveProfileCountryCode({ country: 'fr' })).toBe('fr');
        expect(resolveProfileCountryCode({ working_at: 'France' })).toBe('fr');
        expect(resolveProfileCountryCode({ working_at: 'Belgique,France' })).toBe('be');
        expect(needsProfileCountryConfirmation({ country: 'be' })).toBe(false);
    });

    it('maps workingAt labels', () => {
        expect(workingAtFromCountryCode('be')).toBe('Belgique');
        expect(workingAtFromCountryCode('fr')).toBe('France');
    });
});
