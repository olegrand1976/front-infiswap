import { defineNuxtRouteMiddleware, useRouter, navigateTo } from '#app';

// eslint-disable-next-line no-unused-vars
export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.server) return;

    const routeExists = useRouter().resolve(to.fullPath).name;

    if (!routeExists) {
        return navigateTo('/404', { redirectCode: 302 });
    }
});
