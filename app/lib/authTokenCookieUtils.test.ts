import { describe, expect, it } from 'vitest';
import { AUTH_TOKEN } from './constants';
import {
    buildAuthCookieExpireDirectives,
    normalizeAuthTokenValue,
    resolveAuthCookieDomain,
} from './authTokenCookieUtils';

describe('resolveAuthCookieDomain', () => {
    it('retourne .infiswap.be pour la prod', () => {
        expect(resolveAuthCookieDomain('infiswap.be')).toBe('.infiswap.be');
        expect(resolveAuthCookieDomain('www.infiswap.be')).toBe('.infiswap.be');
    });

    it('ignore staging et localhost', () => {
        expect(resolveAuthCookieDomain('infiswap.ll-it-sc.be')).toBeUndefined();
        expect(resolveAuthCookieDomain('localhost')).toBeUndefined();
    });
});

describe('normalizeAuthTokenValue', () => {
    it('conserve un token non vide', () => {
        expect(normalizeAuthTokenValue('6251|abc')).toBe('6251|abc');
        expect(normalizeAuthTokenValue('  6251|abc  ')).toBe('6251|abc');
    });

    it('traite vide / null / undefined comme absence de session', () => {
        expect(normalizeAuthTokenValue('')).toBeNull();
        expect(normalizeAuthTokenValue('   ')).toBeNull();
        expect(normalizeAuthTokenValue(null)).toBeNull();
        expect(normalizeAuthTokenValue(undefined)).toBeNull();
    });
});

describe('buildAuthCookieExpireDirectives', () => {
    it('expire host-only avec variantes d’attributs', () => {
        const directives = buildAuthCookieExpireDirectives();

        expect(directives).toHaveLength(3);
        expect(directives.every(d => d.startsWith(`${AUTH_TOKEN}=;`))).toBe(true);
        expect(directives.every(d => d.includes('max-age=0'))).toBe(true);
        expect(directives.some(d => d.includes('secure') && d.includes('samesite=lax'))).toBe(true);
        expect(directives.every(d => !d.includes('domain='))).toBe(true);
    });

    it('expire aussi le cookie domaine partagé', () => {
        const directives = buildAuthCookieExpireDirectives('.infiswap.be');

        expect(directives.every(d => d.includes('domain=.infiswap.be'))).toBe(true);
    });
});
