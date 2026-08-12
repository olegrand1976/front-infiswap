import { AUTH_TOKEN } from './constants';

/** Domaine cookie partagé prod (host-only legacy → .infiswap.be). */
export function resolveAuthCookieDomain(hostname: string): string | undefined {
    if (hostname === 'infiswap.be' || hostname.endsWith('.infiswap.be')) {
        return '.infiswap.be';
    }

    return undefined;
}

/** '' / whitespace = pas de session (évite cookie INFISWAP_TOKEN= vide). */
export function normalizeAuthTokenValue(value: string | null | undefined): string | null {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
}

/** Directives Set-Cookie d'expiration (variantes d'attributs pour match navigateur). */
export function buildAuthCookieExpireDirectives(domain?: string): string[] {
    const domainPart = domain ? `; domain=${domain}` : '';
    const bases = [
        `${AUTH_TOKEN}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax`,
        `${AUTH_TOKEN}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`,
        `${AUTH_TOKEN}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    ];

    return bases.map(base => `${base}${domainPart}`);
}

/**
 * Lit INFISWAP_TOKEN depuis document.cookie.
 * Après purge host-only, ne reste en principe que le cookie domain=.infiswap.be.
 */
export function readAuthTokenFromDocument(): string | null {
    if (typeof document === 'undefined') {
        return null;
    }

    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${AUTH_TOKEN}=([^;]*)`));
    if (!match) {
        return null;
    }

    try {
        return normalizeAuthTokenValue(decodeURIComponent(match[1]));
    }
    catch {
        return normalizeAuthTokenValue(match[1]);
    }
}
