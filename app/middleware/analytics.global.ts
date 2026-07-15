export default defineNuxtRouteMiddleware((to) => {
    if (import.meta.server) {
        return;
    }

    trackPageView(to.path, typeof to.name === 'string' ? to.name : null);
});
