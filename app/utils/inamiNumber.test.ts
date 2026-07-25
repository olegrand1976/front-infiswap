import { describe, expect, it } from 'vitest';
import {
    hasValidInamiCheckDigit,
    inamiDigits,
    isValidInamiFormat,
} from './inamiNumber';

describe('inamiNumber', () => {
    it('strips non-digits', () => {
        expect(inamiDigits('123.456.25.000')).toBe('12345625000');
    });

    it('accepts empty as valid optional field', () => {
        expect(isValidInamiFormat(null)).toBe(true);
        expect(isValidInamiFormat('')).toBe(true);
        expect(isValidInamiFormat('   ')).toBe(true);
    });

    it('accepts valid check digits', () => {
        expect(isValidInamiFormat('12345625000')).toBe(true);
        expect(isValidInamiFormat('12345676000')).toBe(true);
        expect(isValidInamiFormat('12345625')).toBe(true);
        expect(hasValidInamiCheckDigit('12345625')).toBe(true);
    });

    it('rejects wrong length or check digit', () => {
        expect(isValidInamiFormat('12345')).toBe(false);
        expect(isValidInamiFormat('11234567891')).toBe(false);
        expect(isValidInamiFormat('1234562500')).toBe(false);
    });
});
