import { useCookie, useRequestHeaders } from '#app';
import type { Ref } from 'vue';
import { AUTH_TOKEN } from '~/lib/constants';
import {
    buildAuthCookieExpireDirectives,
    normalizeAuthTokenValue,
    pickAuthTokenFromCookieHeader,
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

/** Pose un token après slate propre (login / register / 2FA / offer). */
export function persistAuthTokenCookie(cookie: Ref<string | null | undefined>, token: string): void {
    if (import.meta.client) {
        clearAllAuthTokenCookies();
    }
    cookie.value = token;
}

/** Efface ref + cookies host-only/domaine. */
export function clearAuthSessionCookie(cookie: Ref<string | null | undefined>): void {
    cookie.value = null;
    if (import.meta.client) {
        clearAllAuthTokenCookies();
    }
}

/**
 * Self-heal client prod uniquement — appeler une fois (plugin auth).
 * Ordre critique : purge host-only AVANT lecture.
 */
export function healAuthTokenCookies(cookie: Ref<string | null | undefined>): void {
    if (!import.meta.client) {
        return;
    }

    const domain = import.meta.env.PROD ? authCookieDomain() : undefined;

    clearHostOnlyAuthTokenCookie();

    if (!domain) {
        cookie.value = normalizeAuthTokenValue(cookie.value) ?? readAuthTokenFromDocument();
        return;
    }

    const raw = readAuthTokenFromDocument() ?? normalizeAuthTokenValue(cookie.value);

    if (!raw) {
        expireAuthCookie(domain);
        cookie.value = null;
        return;
    }

    cookie.value = raw;
}

/**
 * Lecture seule (pas de purge). Le heal client est dans le plugin auth.
 * SSR : préfère un token non vide si le header Cookie en contient plusieurs.
 */
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

    if (import.meta.server) {
        const header = useRequestHeaders(['cookie']).cookie ?? '';
        const picked = pickAuthTokenFromCookieHeader(header);
        cookie.value = picked;
    }
    else if (cookie.value === '') {
        cookie.value = null;
    }

    return cookie;
}
