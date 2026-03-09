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
        if (to.path === '/dashboard' || (to.path.startsWith('/dashboard') && !to.path.startsWith('/dashboard/institution'))) {
            if (user.value.validate_at) {
                return navigateTo('/dashboard/institution', { replace: true });
            }
            else {
                return navigateTo('/dashboard/institution/pending-validation', { replace: true });
            }
        }

        if (user.value.validate_at && to.path === '/dashboard/institution/pending-validation') {
            return navigateTo('/dashboard/institution', { replace: true });
        }

        if (!user.value.validate_at) {
            if (to.path !== '/dashboard/institution/pending-validation') {
                return navigateTo('/dashboard/institution/pending-validation', { replace: true });
            }
            return;
        }
    }
});
