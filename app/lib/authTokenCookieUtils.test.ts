import { describe, expect, it } from 'vitest';
import { AUTH_TOKEN } from './constants';
import {
    buildAuthCookieExpireDirectives,
    normalizeAuthTokenValue,
    pickAuthTokenFromCookieHeader,
    readAuthTokenFromDocument,
    resolveAuthCookieDomain,
    resolveHealedAuthToken,
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

describe('pickAuthTokenFromCookieHeader (régression login bounce)', () => {
    it('préfère le token non vide si un cookie vide précède (cas HAR prod)', () => {
        // Bug historique : 1er match = '' → session considérée absente → heal efface le domain token.
        expect(pickAuthTokenFromCookieHeader(
            'LANGUAGE=fr; INFISWAP_TOKEN=; INFISWAP_TOKEN=6251%7C8kmdAjSotLTsWlRyoMohohKNCZMpECB2MZvTrmhR2d74edc9',
        )).toBe('6251|8kmdAjSotLTsWlRyoMohohKNCZMpECB2MZvTrmhR2d74edc9');
    });

    it('préfère le token non vide si un cookie vide suit', () => {
        expect(pickAuthTokenFromCookieHeader(
            'INFISWAP_TOKEN=6251%7Cabc; INFISWAP_TOKEN=',
        )).toBe('6251|abc');
    });

    it('retourne null si seulement vide ou absent', () => {
        expect(pickAuthTokenFromCookieHeader('INFISWAP_TOKEN=')).toBeNull();
        expect(pickAuthTokenFromCookieHeader('LANGUAGE=fr')).toBeNull();
        expect(pickAuthTokenFromCookieHeader('')).toBeNull();
    });

    it('échoue si on ne prenait que le premier match (garde-fou anti-régression)', () => {
        const header = 'INFISWAP_TOKEN=; INFISWAP_TOKEN=6251%7Cabc';
        const firstOnly = header.match(new RegExp(`(?:^|;\\s*)${AUTH_TOKEN}=([^;]*)`));
        const firstNormalized = normalizeAuthTokenValue(
            firstOnly ? decodeURIComponent(firstOnly[1]) : null,
        );

        // Comportement buggé documenté :
        expect(firstNormalized).toBeNull();
        // Comportement attendu :
        expect(pickAuthTokenFromCookieHeader(header)).toBe('6251|abc');
    });
});

describe('resolveHealedAuthToken (régression post-login)', () => {
    it('conserve le token domaine après purge host-only', () => {
        expect(resolveHealedAuthToken({
            documentCookieAfterHostOnlyPurge: 'INFISWAP_TOKEN=6251%7Cabc',
            cookieRefValue: '',
        })).toBe('6251|abc');
    });

    it('ne nullifie pas si la ref est vide mais le document a encore le token', () => {
        expect(resolveHealedAuthToken({
            documentCookieAfterHostOnlyPurge: 'LANGUAGE=fr; INFISWAP_TOKEN=6251%7Ckeep',
            cookieRefValue: null,
        })).toBe('6251|keep');
    });

    it('nullifie seulement si document et ref sont vides', () => {
        expect(resolveHealedAuthToken({
            documentCookieAfterHostOnlyPurge: 'INFISWAP_TOKEN=',
            cookieRefValue: '',
        })).toBeNull();

        expect(resolveHealedAuthToken({
            documentCookieAfterHostOnlyPurge: '',
            cookieRefValue: null,
        })).toBeNull();
    });

    it('utilise la ref si le document est vide après purge totale', () => {
        expect(resolveHealedAuthToken({
            documentCookieAfterHostOnlyPurge: '',
            cookieRefValue: '6251|from-ref',
        })).toBe('6251|from-ref');
    });
});

describe('readAuthTokenFromDocument', () => {
    it('lit et décode le token depuis document.cookie', () => {
        const original = globalThis.document;
        Object.defineProperty(globalThis, 'document', {
            configurable: true,
            writable: true,
            value: {
                cookie: 'LANGUAGE=fr; INFISWAP_TOKEN=6251%7Cabc; other=1',
            },
        });

        try {
            expect(readAuthTokenFromDocument()).toBe('6251|abc');
        }
        finally {
            Object.defineProperty(globalThis, 'document', {
                configurable: true,
                writable: true,
                value: original,
            });
        }
    });

    it('préfère le non vide quand document.cookie expose le doublon vide+valide', () => {
        const original = globalThis.document;
        Object.defineProperty(globalThis, 'document', {
            configurable: true,
            writable: true,
            value: {
                cookie: 'INFISWAP_TOKEN=; INFISWAP_TOKEN=6251%7Cabc',
            },
        });

        try {
            expect(readAuthTokenFromDocument()).toBe('6251|abc');
        }
        finally {
            Object.defineProperty(globalThis, 'document', {
                configurable: true,
                writable: true,
                value: original,
            });
        }
    });

    it('ignore un cookie vide seul', () => {
        const original = globalThis.document;
        Object.defineProperty(globalThis, 'document', {
            configurable: true,
            writable: true,
            value: { cookie: 'INFISWAP_TOKEN=' },
        });

        try {
            expect(readAuthTokenFromDocument()).toBeNull();
        }
        finally {
            Object.defineProperty(globalThis, 'document', {
                configurable: true,
                writable: true,
                value: original,
            });
        }
    });
});
