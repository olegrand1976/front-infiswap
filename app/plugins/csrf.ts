import { useCookie, useRuntimeConfig, defineNuxtPlugin } from '#app';
import { resolveApiBaseUrl } from '~/lib/resolveApiBaseUrl';

const CSRF_COOKIE = 'XSRF-TOKEN';

function readCsrfToken(): string | null {
    const fromUseCookie = useCookie(CSRF_COOKIE).value;
    if (fromUseCookie) {
        try {
            return decodeURIComponent(fromUseCookie);
        }
        catch {
            return fromUseCookie;
        }
    }

    if (import.meta.client && typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
        if (match?.[1]) {
            try {
                return decodeURIComponent(match[1]);
            }
            catch {
                return match[1];
            }
        }
    }

    return null;
}

export default defineNuxtPlugin((nuxtApp) => {
    async function initCsrf() {
        const apiBaseUrl = resolveApiBaseUrl(useRuntimeConfig());

        await $fetch('/sanctum/csrf-cookie', {
            baseURL: apiBaseUrl,
            credentials: 'include',
            timeout: import.meta.server ? 15_000 : 60_000,
        });

        return readCsrfToken();
    }

    nuxtApp.provide('csrf', initCsrf);
});
