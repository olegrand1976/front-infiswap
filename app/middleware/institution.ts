import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuth, useUser } from '~/composables/useAuth';
import { emailUnverifiedRedirect } from '~/utils/dashboardEntryGuard';
import { institutionEntryRedirect, isInstitutionFullyValidated } from '~/utils/institutionGuard';

export default defineNuxtRouteMiddleware((to) => {
    const user = useUser();

    if (!user.value) return navigateTo('/login', { replace: true });

    const emailRedirect = emailUnverifiedRedirect(user.value);
    if (emailRedirect) {
        return navigateTo(emailRedirect, { replace: true });
    }

    const { isInstitution } = useAuth();

    if (isInstitution.value) {
        const isFullyValidated = isInstitutionFullyValidated(user.value);

        const redirect = institutionEntryRedirect(to, isFullyValidated);
        if (redirect) {
            return navigateTo(redirect, { replace: true });
        }

        if (isFullyValidated && to.path === '/dashboard/institution/pending-validation') {
            return navigateTo('/dashboard/institution', { replace: true });
        }

        if (!isFullyValidated) {
            if (to.path !== '/dashboard/institution/pending-validation') {
                return navigateTo('/dashboard/institution/pending-validation', { replace: true });
            }
            return;
        }
    }
});
