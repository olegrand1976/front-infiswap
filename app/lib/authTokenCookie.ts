import { useCookie } from '#app';
import type { Ref } from 'vue';
import { AUTH_TOKEN } from '~/lib/constants';
import {
    buildAuthCookieExpireDirectives,
    normalizeAuthTokenValue,
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
 * Self-heal prod : une visite suffit pour les comptes déjà cassés.
 * 1) purge le host-only (souvent le `INFISWAP_TOKEN=` vide)
 * 2) si plus de token lisible → purge domaine aussi (login propre)
 * 3) si token valide → le réécrit une fois sur domain=.infiswap.be (un seul cookie)
 */
export function healAuthTokenCookies(cookie: Ref<string | null | undefined>): void {
    const normalized = normalizeAuthTokenValue(cookie.value);

    if (!import.meta.client || !import.meta.env.PROD || !authCookieDomain()) {
        cookie.value = normalized;
        return;
    }

    const domain = authCookieDomain();

    // Toujours retirer le host-only (legacy / vide laissé par logout '').
    expireAuthCookie();

    if (!normalized) {
        if (domain) {
            expireAuthCookie(domain);
        }
        cookie.value = null;
        return;
    }

    // Réécriture domaine = un seul cookie propre ; l'infirmière reste connectée.
    cookie.value = normalized;
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
    cookie.value = normalizeAuthTokenValue(cookie.value);

    return cookie;
}
