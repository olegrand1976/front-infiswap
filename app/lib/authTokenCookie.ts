import { useCookie } from '#app';
import { AUTH_TOKEN } from '~/lib/constants';

export function useAuthTokenCookie() {
    const config = import.meta.env.PROD
        ? { maxAge: 7776000, secure: true, sameSite: 'lax' as const, path: '/' }
        : { maxAge: 7776000, path: '/' };

    return useCookie(AUTH_TOKEN, config);
}
