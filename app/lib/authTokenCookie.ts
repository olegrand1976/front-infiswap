import { useCookie } from '#app';
import { AUTH_TOKEN } from '~/lib/constants';

function authCookieDomain(): string | undefined {
    const siteUrl = useRuntimeConfig().public.FRONT_END_URL || '';

    try {
        const hostname = new URL(siteUrl).hostname;

        if (hostname === 'infiswap.be' || hostname.endsWith('.infiswap.be')) {
            return '.infiswap.be';
        }
    }
    catch {
        return undefined;
    }

    return undefined;
}

/** Supprime l'ancien cookie host-only après migration vers domain=.infiswap.be */
export function clearLegacyHostOnlyAuthCookie(): void {
    if (!import.meta.client || !import.meta.env.PROD || !authCookieDomain()) {
        return;
    }

    document.cookie = `${AUTH_TOKEN}=; path=/; max-age=0; secure; samesite=lax`;
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

    return useCookie(AUTH_TOKEN, config);
}
