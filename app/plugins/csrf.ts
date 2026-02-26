import { useCookie, useRuntimeConfig, defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(async (nuxtApp) => {
    const CSRF_COOKIE = 'XSRF-TOKEN';
    async function initCsrf() {
        const { API_BASE_URL } = useRuntimeConfig().public;
        const existingToken = useCookie(CSRF_COOKIE).value;

        if (existingToken) return existingToken;

        await $fetch('/sanctum/csrf-cookie', {
            baseURL: API_BASE_URL as string,
            credentials: 'include',
        });

        return useCookie(CSRF_COOKIE).value;
    }

    nuxtApp.provide('csrf', initCsrf);
});
