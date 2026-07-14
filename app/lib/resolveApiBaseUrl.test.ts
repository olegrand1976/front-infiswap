import { describe, expect, it } from 'vitest';
import {
    PROD_API_URL,
    STAGING_API_URL,
    resolveApiBaseUrlFromHostname,
} from './resolveApiBaseUrl';

describe('resolveApiBaseUrlFromHostname', () => {
    it('mappe les domaines prod vers back.infiswap.be', () => {
        expect(resolveApiBaseUrlFromHostname('infiswap.be')).toBe(PROD_API_URL);
        expect(resolveApiBaseUrlFromHostname('www.infiswap.be')).toBe(PROD_API_URL);
        expect(resolveApiBaseUrlFromHostname('infiswap.fr')).toBe(PROD_API_URL);
        expect(resolveApiBaseUrlFromHostname('www.infiswap.fr')).toBe(PROD_API_URL);
    });

    it('mappe le staging GCP vers api-infiswap.ll-it-sc.be', () => {
        expect(resolveApiBaseUrlFromHostname('infiswap.ll-it-sc.be')).toBe(STAGING_API_URL);
    });

    it('retourne null pour localhost et domaines inconnus', () => {
        expect(resolveApiBaseUrlFromHostname('localhost')).toBeNull();
        expect(resolveApiBaseUrlFromHostname('127.0.0.1')).toBeNull();
        expect(resolveApiBaseUrlFromHostname('example.com')).toBeNull();
    });
});
