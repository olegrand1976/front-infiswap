import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useUser } from '~/composables/useAuth';
import { dashboardHomeRedirectForRole, emailUnverifiedRedirect, staffOnlyAdminRedirect } from '~/utils/dashboardEntryGuard';
import { institutionEntryRedirect, isInstitutionFullyValidated } from '~/utils/institutionGuard';

export default defineNuxtRouteMiddleware(async (to) => {
    const user = useUser();

    if (!user.value) return navigateTo('/login', { replace: true });

    const emailRedirect = emailUnverifiedRedirect(user.value);
    if (emailRedirect) {
        return navigateTo(emailRedirect, { replace: true });
    }

    const { isAdmin, isDeveloper, isManager, isCommunityManager, isSaleRepresentative, isInstitution } = useAuth();

    const isStaff = isAdmin.value || isDeveloper?.value || isManager?.value || isCommunityManager?.value || isSaleRepresentative?.value;

    const staffRedirect = staffOnlyAdminRedirect(to, isStaff);
    if (staffRedirect) {
        return navigateTo(staffRedirect, { replace: true });
    }

    if (isInstitution.value) {
        if (to.path === '/dashboard/account') {
            return;
        }

        const redirect = institutionEntryRedirect(to, isInstitutionFullyValidated(user.value));
        if (redirect) {
            return navigateTo(redirect, { replace: true });
        }
    }

    const homeRedirect = dashboardHomeRedirectForRole(to, { isManager: isManager.value, isSaleRepresentative: isSaleRepresentative.value });
    if (homeRedirect && homeRedirect !== to.path) {
        return navigateTo(homeRedirect, { replace: true });
    }
});
