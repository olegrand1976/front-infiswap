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

function decodeCookieValue(raw: string): string {
    try {
        return decodeURIComponent(raw);
    }
    catch {
        return raw;
    }
}

/**
 * Prefère toute valeur non vide si plusieurs INFISWAP_TOKEN (host-only vide + domain valide).
 * Régression bloquée : prendre le 1er match seul → login bounce (session effacée).
 */
export function pickAuthTokenFromCookieHeader(cookieHeader: string): string | null {
    if (!cookieHeader) {
        return null;
    }

    const re = new RegExp(`(?:^|;\\s*)${AUTH_TOKEN}=([^;]*)`, 'g');
    let match: RegExpExecArray | null;
    let best: string | null = null;

    while ((match = re.exec(cookieHeader)) !== null) {
        const normalized = normalizeAuthTokenValue(decodeCookieValue(match[1]));
        if (normalized) {
            best = normalized;
        }
    }

    return best;
}

/** Lit INFISWAP_TOKEN depuis document.cookie (préfère non vide). */
export function readAuthTokenFromDocument(): string | null {
    if (typeof document === 'undefined') {
        return null;
    }

    return pickAuthTokenFromCookieHeader(document.cookie);
}

/**
 * Décision heal après purge host-only (pure, testable).
 * Si on lit vide alors qu'un token domaine existe encore → on NE doit PAS nullifier.
 */
export function resolveHealedAuthToken(input: {
    documentCookieAfterHostOnlyPurge: string;
    cookieRefValue: string | null | undefined;
}): string | null {
    return pickAuthTokenFromCookieHeader(input.documentCookieAfterHostOnlyPurge)
        ?? normalizeAuthTokenValue(input.cookieRefValue);
}
