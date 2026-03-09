import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuth, useUser } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware((to) => {
    const user = useUser();

    if (!user.value) return navigateTo('/login', { replace: true });

    if (!user.value.email_verified_at) {
        return navigateTo('/auth/verify-email', { replace: true });
    }

    const { isInstitution } = useAuth();

    if (isInstitution.value) {
        if (user.value.validate_at && to.path === '/dashboard/institution/pending-validation') {
            return navigateTo('/dashboard/institution', { replace: true });
        }

        if (!user.value.validate_at) {
            if (to.path !== '/dashboard/institution/pending-validation') {
                return navigateTo('/dashboard/institution/pending-validation', { replace: true });
            }
            return;
        }

        if (to.path === '/dashboard') {
            return navigateTo('/dashboard/institution', { replace: true });
        }
    }
});
