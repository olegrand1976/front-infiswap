import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware((to) => {
    const { isInstitution } = useAuth();

    if (isInstitution.value && to.path === '/dashboard') {
        return navigateTo('/dashboard/institution', { replace: true });
    }
});
