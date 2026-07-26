import { describe, expect, it } from 'vitest';
import {
    detectLocaleFromBrowser,
    isAppLocale,
    normalizeAppLocale,
} from './appLocale';

describe('appLocale', () => {
    it('accepts only fr and nl', () => {
        expect(isAppLocale('fr')).toBe(true);
        expect(isAppLocale('nl')).toBe(true);
        expect(isAppLocale('en')).toBe(false);
        expect(isAppLocale('ru')).toBe(false);
    });

    it('normalizes tags and falls back to fr', () => {
        expect(normalizeAppLocale('NL')).toBe('nl');
        expect(normalizeAppLocale('fr-BE')).toBe('fr');
        expect(normalizeAppLocale('de')).toBe('fr');
        expect(normalizeAppLocale(null)).toBe('fr');
    });

    it('detects dutch browser languages including nl-BE', () => {
        expect(detectLocaleFromBrowser('nl-BE')).toBe('nl');
        expect(detectLocaleFromBrowser('nl')).toBe('nl');
        expect(detectLocaleFromBrowser('fr-BE')).toBe('fr');
        expect(detectLocaleFromBrowser('en-US')).toBe('fr');
        expect(detectLocaleFromBrowser(undefined)).toBe('fr');
    });
});
