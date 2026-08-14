import { describe, expect, it } from 'vitest';
import { sanitizeTagInput } from './inputTagSanitize';

describe('sanitizeTagInput', () => {
    it('keeps city names when digitsOnly is false', () => {
        expect(sanitizeTagInput('Bruxelles', { digitsOnly: false })).toBe('Bruxelles');
        expect(sanitizeTagInput('Paris 15e', { digitsOnly: false })).toBe('Paris 15e');
        expect(sanitizeTagInput('Saint-Gilles', { digitsOnly: false })).toBe('Saint-Gilles');
    });

    it('strips non-digits for postal codes by default', () => {
        expect(sanitizeTagInput('10a00', { maxLength: 4 })).toBe('1000');
        expect(sanitizeTagInput('Bruxelles', { maxLength: 4 })).toBe('');
    });

    it('enforces postal max length for BE (4) and FR (5)', () => {
        expect(sanitizeTagInput('10001', { maxLength: 4 })).toBe('1000');
        expect(sanitizeTagInput('750001', { maxLength: 5 })).toBe('75000');
    });

    it('does not apply postal max length in city mode', () => {
        const longCity = 'Montigny-le-Tilleul-Extra';
        expect(sanitizeTagInput(longCity, { digitsOnly: false, maxLength: 4 })).toBe(longCity);
    });
});
