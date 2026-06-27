/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { $fetch } from 'ofetch';
import { parseCookies } from 'h3';
import { AUTH_TOKEN, LANGUAGE } from '~/lib/constants';
import { resolveApiBaseUrl } from '~/lib/resolveApiBaseUrl';
import {
    useCookie,
    useRuntimeConfig,
    useNuxtApp,
    useRequestEvent,
    useRequestHeaders,
    defineNuxtPlugin,
    type NuxtApp,
} from '#app';

const CSRF_COOKIE = 'XSRF-TOKEN';
const CSRF_HEADER = 'X-XSRF-TOKEN';

const MUTATION_METHODS = new Set(['post', 'delete', 'put', 'patch']);

function normalizeCsrfToken(token: string | null | undefined): string {
    if (!token) {
        return '';
    }

    try {
        return decodeURIComponent(token);
    }
    catch {
        return token;
    }
}

export default defineNuxtPlugin(async (nuxtApp: NuxtApp) => {
    const language = useCookie(LANGUAGE)?.value ?? 'fr';
    const apifetch = $fetch.create({
        credentials: 'include',
        timeout: import.meta.server ? 15_000 : 60_000,
        async onRequest({ options }) {
            options.baseURL = resolveApiBaseUrl(useRuntimeConfig());
            const { $csrf } = useNuxtApp();
            const event = typeof useEvent === 'function' ? useRequestEvent() : null;
            const method = options?.method?.toLowerCase() ?? 'get';
            let token = normalizeCsrfToken(
                event
                    ? parseCookies(event)[CSRF_COOKIE]
                    : useCookie(CSRF_COOKIE).value,
            );

            if (import.meta.client && MUTATION_METHODS.has(method) && typeof $csrf === 'function') {
                token = normalizeCsrfToken(
                    (await ($csrf as () => Promise<string | null | undefined>)()) ?? token,
                );
            }

            let headers = {
                'Accept': 'application/json',
                'Authorization': `Bearer ${useCookie(AUTH_TOKEN).value ?? ''}`,
                'Accept-Language': language,
                ...options?.headers,
                ...(token && { [CSRF_HEADER]: token }),
            };

            if (!(options.body instanceof FormData)) {
                headers['Content-Type'] = 'application/json';
            }
            else {
                if (options.body instanceof FormData) {
                    options.body = options.body as any;
                }
            }

            if (import.meta.server) {
                const cookieString = event
                    ? event.headers.get('cookie')
                    : useRequestHeaders(['cookie']).cookie;

                headers = {
                    ...headers,
                    ...(cookieString && { cookie: cookieString }),
                };
            }

            options.headers = headers;
        },

        async onResponseError({ response }) {
            const status = response.status;
            if ([500].includes(status)) {
                console.error('[Error]', response.statusText, response._data);
            }
        },
    });

    nuxtApp.provide('apifetch', apifetch);
});
