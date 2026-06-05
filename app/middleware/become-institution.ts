import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuth, useUser } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware(() => {
    const user = useUser();

    if (!user.value) {
        return navigateTo('/login', { replace: true });
    }

    if (!user.value.email_verified_at) {
        return navigateTo('/auth/verify-email', { replace: true });
    }

    const { canCreateInstitution, isInstitution } = useAuth();

    if (isInstitution.value) {
        return navigateTo('/dashboard/institution', { replace: true });
    }

    if (!canCreateInstitution.value) {
        return navigateTo('/dashboard', { replace: true });
    }
});
