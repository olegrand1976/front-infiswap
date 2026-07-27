/* eslint-disable @typescript-eslint/no-explicit-any */
import { $fetch } from 'ofetch';
import { buildApiRequestHeaders, readRequestHeaders } from '~/lib/apiFetchHeaders';
import { LANGUAGE } from '~/lib/constants';
import { useAuthTokenCookie } from '~/lib/authTokenCookie';
import { resolveApiBaseUrl } from '~/lib/resolveApiBaseUrl';
import {
    useCookie,
    useRuntimeConfig,
    defineNuxtPlugin,
    type NuxtApp,
} from '#app';

export default defineNuxtPlugin(async (nuxtApp: NuxtApp) => {
    const runtimeConfig = useRuntimeConfig();
    const languageCookie = useCookie(LANGUAGE);
    const authToken = useAuthTokenCookie();

    const apifetch = $fetch.create({
        credentials: 'omit',
        timeout: import.meta.server ? 15_000 : 60_000,
        async onRequest({ options }) {
            options.baseURL = resolveApiBaseUrl(runtimeConfig);

            const incoming = readRequestHeaders(options.headers);
            const headers = buildApiRequestHeaders(
                incoming,
                authToken.value,
                languageCookie.value ?? 'fr',
            );

            if (!(options.body instanceof FormData)) {
                headers['Content-Type'] = 'application/json';
            }
            else if (options.body instanceof FormData) {
                options.body = options.body as any;
            }

            options.headers = headers;
        },

        async onResponseError({ response }) {
            const status = response.status;
            if ([500].includes(status) && import.meta.dev) {
                console.error('[Error]', response.statusText);
            }
        },
    });

    nuxtApp.provide('apifetch', apifetch);
});
