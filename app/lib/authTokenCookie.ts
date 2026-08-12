import { useCookie } from '#app';
import type { Ref } from 'vue';
import { AUTH_TOKEN } from '~/lib/constants';
import {
    buildAuthCookieExpireDirectives,
    normalizeAuthTokenValue,
    readAuthTokenFromDocument,
    resolveAuthCookieDomain,
} from '~/lib/authTokenCookieUtils';

function authCookieDomain(): string | undefined {
    const siteUrl = useRuntimeConfig().public.FRONT_END_URL || '';

    try {
        return resolveAuthCookieDomain(new URL(siteUrl).hostname);
    }
    catch {
        return undefined;
    }
}

function expireAuthCookie(domain?: string): void {
    for (const directive of buildAuthCookieExpireDirectives(domain)) {
        document.cookie = directive;
    }
}

/** Purge uniquement le cookie host-only (souvent `INFISWAP_TOKEN=` vide). */
export function clearHostOnlyAuthTokenCookie(): void {
    if (!import.meta.client) {
        return;
    }

    expireAuthCookie();
}

/**
 * Supprime host-only + domain=.infiswap.be.
 * Évite le cookie vide `INFISWAP_TOKEN=` qui casse lecture auth / login.
 */
export function clearAllAuthTokenCookies(): void {
    if (!import.meta.client) {
        return;
    }

    expireAuthCookie();

    const domain = authCookieDomain();
    if (domain) {
        expireAuthCookie(domain);
    }
}

/**
 * Self-heal prod.
 * Ordre critique : purge host-only AVANT lecture, sinon le cookie vide
 * masque le token domain et on efface la session au login.
 */
export function healAuthTokenCookies(cookie: Ref<string | null | undefined>): void {
    if (!import.meta.client) {
        cookie.value = normalizeAuthTokenValue(cookie.value);
        return;
    }

    const domain = import.meta.env.PROD ? authCookieDomain() : undefined;

    // 1) Toujours retirer le host-only avant de faire confiance à la valeur.
    clearHostOnlyAuthTokenCookie();

    if (!domain) {
        const normalized = normalizeAuthTokenValue(cookie.value) ?? readAuthTokenFromDocument();
        cookie.value = normalized;
        return;
    }

    // 2) Après purge, lire ce qui reste (cookie domaine).
    const raw = readAuthTokenFromDocument() ?? normalizeAuthTokenValue(cookie.value);

    if (!raw) {
        expireAuthCookie(domain);
        cookie.value = null;
        return;
    }

    // 3) Réécriture domaine = un seul cookie propre.
    cookie.value = raw;
}

export function useAuthTokenCookie() {
    const domain = import.meta.env.PROD ? authCookieDomain() : undefined;
    const config = import.meta.env.PROD
        ? {
            maxAge: 1209600,
            secure: true,
            sameSite: 'lax' as const,
            path: '/',
            ...(domain ? { domain } : {}),
        }
        : { maxAge: 1209600, path: '/' };

    const cookie = useCookie<string | null>(AUTH_TOKEN, config);

    // Ne jamais écrire null tant que le host-only vide n'est pas purgé :
    // sinon on efface le token domaine valide.
    if (import.meta.client && domain) {
        clearHostOnlyAuthTokenCookie();
        const raw = readAuthTokenFromDocument() ?? normalizeAuthTokenValue(cookie.value);
        if (cookie.value !== raw) {
            cookie.value = raw;
        }
    }
    else if (cookie.value === '') {
        cookie.value = null;
    }

    return cookie;
}
