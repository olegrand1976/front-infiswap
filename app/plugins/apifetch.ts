/* eslint-disable @typescript-eslint/no-explicit-any */
import { $fetch } from 'ofetch';
import { LANGUAGE } from '~/lib/constants';
import { useAuthTokenCookie } from '~/lib/authTokenCookie';
import { resolveApiBaseUrl } from '~/lib/resolveApiBaseUrl';
import {
    useCookie,
    useRuntimeConfig,
    defineNuxtPlugin,
    type NuxtApp,
} from '#app';

function readRequestHeaders(raw: unknown): Record<string, string> {
    if (!raw) {
        return {};
    }

    if (raw instanceof Headers) {
        return Object.fromEntries(raw.entries());
    }

    if (Array.isArray(raw)) {
        return Object.fromEntries(raw);
    }

    return { ...(raw as Record<string, string>) };
}

function extractBearerToken(authorization?: string): string | undefined {
    if (!authorization) {
        return undefined;
    }

    const match = authorization.match(/^Bearer\s+(.+)$/i);
    const token = match?.[1]?.trim();

    return token || undefined;
}

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
            const token = extractBearerToken(incoming.Authorization)
                ?? (authToken.value ? String(authToken.value) : undefined);

            const headers: Record<string, string> = {
                'Accept': 'application/json',
                'Accept-Language': languageCookie.value ?? 'fr',
                ...incoming,
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
            else {
                delete headers.Authorization;
            }

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
