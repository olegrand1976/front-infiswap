import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuth, useUser } from '~/composables/useAuth';
import { emailUnverifiedRedirect } from '~/utils/dashboardEntryGuard';

export default defineNuxtRouteMiddleware(() => {
    const user = useUser();

    if (!user.value) {
        return navigateTo('/login', { replace: true });
    }

    const emailRedirect = emailUnverifiedRedirect(user.value);
    if (emailRedirect) {
        return navigateTo(emailRedirect, { replace: true });
    }

    const { canCreateInstitution, isInstitution } = useAuth();

    if (isInstitution.value) {
        return navigateTo('/dashboard/institution', { replace: true });
    }

    if (!canCreateInstitution.value) {
        return navigateTo('/dashboard', { replace: true });
    }
});
