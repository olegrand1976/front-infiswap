import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware((to) => {
    const { isAdmin } = useAuth();

    if (isAdmin.value && to.path.startsWith('dashboard/admin')) {
        return navigateTo('/dashboard/admin', { replace: true });
    }

    if (!isAdmin.value) {
        return navigateTo('/dashboard', { replace: true });
    }
});
