import { $fetch } from 'ofetch';
import { parseCookies } from 'h3';
import { AUTH_TOKEN } from '~/lib/constants';
import { useCookie, useRuntimeConfig, useRequestEvent, useRequestHeaders } from '#app';

const CSRF_COOKIE = 'XSRF-TOKEN';
const CSRF_HEADER = 'X-XSRF-TOKEN';

export const $apifetch = $fetch.create({
    credentials: 'include',
    async onRequest({ request, options }) {
        const event = typeof useEvent === 'function' ? useRequestEvent() : null;
        let token = event
            ? parseCookies(event)[CSRF_COOKIE]
            : useCookie(CSRF_COOKIE).value;
        const { API_BASE_URL, FRONT_END_URL } = useRuntimeConfig().public;

        if (import.meta.client
            && ['post', 'delete', 'put', 'patch'].includes(
                options?.method?.toLowerCase() ?? '',
            )
        ) {
            token = await initCsrf();
        }

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useCookie(AUTH_TOKEN).value ?? ''}`,
            ...options?.headers,
            ...(token && { [CSRF_HEADER]: token }),
        };

        if (import.meta.server) {
            const cookieString = event
                ? event.headers.get('cookie')
                : useRequestHeaders(['cookie']).cookie;

            headers = {
                ...headers,
                ...(cookieString && { cookie: cookieString }),
                referer: FRONT_END_URL,
            };
        }

        options.headers = headers;
        options.baseURL = API_BASE_URL;
    },
    async onResponseError({ response }) {
        const status = response.status;
        if ([500].includes(status)) {
            console.error('[Laravel Error]', response.statusText, response._data);
        }
    },
});

async function initCsrf() {
    const { API_BASE_URL } = useRuntimeConfig().public;
    const existingToken = useCookie(CSRF_COOKIE).value;

    if (existingToken) return existingToken;

    await $fetch('/sanctum/csrf-cookie', {
        baseURL: API_BASE_URL,
        credentials: 'include',
    });

    return useCookie(CSRF_COOKIE).value;
}
