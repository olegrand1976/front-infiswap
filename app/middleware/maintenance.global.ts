export default defineNuxtRouteMiddleware((to) => {
    const isMaintenance = useRuntimeConfig().public.MAINTENANCE_MODE;

    if (isMaintenance && to.path !== '/maintenance') {
        return navigateTo('/maintenance');
    }
});
