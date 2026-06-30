/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { $fetch } from 'ofetch';
import { AUTH_TOKEN, LANGUAGE } from '~/lib/constants';
import { resolveApiBaseUrl } from '~/lib/resolveApiBaseUrl';
import {
    useCookie,
    useRuntimeConfig,
    defineNuxtPlugin,
    type NuxtApp,
} from '#app';

export default defineNuxtPlugin(async (nuxtApp: NuxtApp) => {
    const language = useCookie(LANGUAGE)?.value ?? 'fr';
    const apifetch = $fetch.create({
        credentials: 'omit',
        timeout: import.meta.server ? 15_000 : 60_000,
        async onRequest({ options }) {
            options.baseURL = resolveApiBaseUrl(useRuntimeConfig());

            let headers: Record<string, string> = {
                'Accept': 'application/json',
                'Authorization': `Bearer ${useCookie(AUTH_TOKEN).value ?? ''}`,
                'Accept-Language': language,
                ...(options?.headers as Record<string, string> | undefined),
            };

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
            if ([500].includes(status)) {
                console.error('[Error]', response.statusText, response._data);
            }
        },
    });

    nuxtApp.provide('apifetch', apifetch);
});
