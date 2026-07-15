import { describe, expect, it } from 'vitest';
import {
    buildApiRequestHeaders,
    extractBearerToken,
    readRequestHeaders,
    resolveApiAuthorization,
} from './apiFetchHeaders';

describe('readRequestHeaders', () => {
    it('lit un objet Headers (cas ofetch)', () => {
        const headers = new Headers({ Authorization: 'Bearer token-from-headers' });

        expect(readRequestHeaders(headers)).toEqual({
            authorization: 'Bearer token-from-headers',
        });
    });

    it('lit un objet plain', () => {
        expect(readRequestHeaders({ Authorization: 'Bearer abc' })).toEqual({
            Authorization: 'Bearer abc',
        });
    });
});

describe('extractBearerToken', () => {
    it('extrait un token non vide', () => {
        expect(extractBearerToken('Bearer 5659|abc')).toBe('5659|abc');
    });

    it('ignore Bearer sans token', () => {
        expect(extractBearerToken('Bearer')).toBeUndefined();
        expect(extractBearerToken('Bearer ')).toBeUndefined();
    });
});

describe('buildApiRequestHeaders', () => {
    it('utilise le token explicite même si ofetch passe un Headers', () => {
        const incoming = readRequestHeaders(new Headers({
            Authorization: 'Bearer override-token',
        }));

        const headers = buildApiRequestHeaders(incoming, null, 'fr');

        expect(headers.Authorization).toBe('Bearer override-token');
    });

    it('lit authorization en minuscule depuis Headers', () => {
        const incoming = { authorization: 'Bearer lowercase-token' };

        expect(resolveApiAuthorization(incoming, null)).toBe('lowercase-token');
    });

    it('retombe sur le cookie quand aucun header Authorization valide', () => {
        const headers = buildApiRequestHeaders({}, 'cookie-token', 'fr');

        expect(headers.Authorization).toBe('Bearer cookie-token');
    });

    it('n envoie pas Authorization Bearer vide (régression prod)', () => {
        const headers = buildApiRequestHeaders({}, null, 'fr');

        expect(headers.Authorization).toBeUndefined();
    });

    it('priorise le header explicite au cookie', () => {
        const headers = buildApiRequestHeaders(
            { Authorization: 'Bearer header-token' },
            'cookie-token',
            'fr',
        );

        expect(headers.Authorization).toBe('Bearer header-token');
    });
});

describe('resolveApiAuthorization', () => {
    it('ignore Bearer vide et utilise le cookie', () => {
        expect(resolveApiAuthorization({ Authorization: 'Bearer' }, 'stored')).toBe('stored');
    });
});
