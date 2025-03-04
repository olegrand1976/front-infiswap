import { $fetch } from 'ofetch';
import { parseCookies } from 'h3';
import { AUTH_TOKEN, LANGUAGE } from '~/lib/constants';
import {
    useCookie,
    useRuntimeConfig,
    useNuxtApp,
    useRequestEvent,
    useRequestHeaders,
    defineNuxtPlugin,
} from '#app';

const CSRF_COOKIE = 'XSRF-TOKEN';
const CSRF_HEADER = 'X-XSRF-TOKEN';

export default defineNuxtPlugin(async (nuxtApp) => {
    const { $csrf } = useNuxtApp();
    const { API_URL, FRONT_END_URL } = useRuntimeConfig().public;
    const language = useCookie(LANGUAGE)?.value ?? 'fr';

    const apifetch = $fetch.create({
        credentials: 'include',
        baseURL: API_URL,
        // eslint-disable-next-line no-unused-vars
        async onRequest({ request, options }) {
            const event = typeof useEvent === 'function' ? useRequestEvent() : null;
            let token = event
                ? parseCookies(event)[CSRF_COOKIE]
                : useCookie(CSRF_COOKIE).value;

            if (
                import.meta.client
                    && ['post', 'delete', 'put', 'patch'].includes(
                        options?.method?.toLowerCase() ?? '',
                    )
            ) {
                if ($csrf) {
                    token = $csrf;
                }
            }

            let headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useCookie(AUTH_TOKEN).value ?? ''}`,
                'Accept-Language': language,
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
