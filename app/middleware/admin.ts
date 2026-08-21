import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuth, useUser } from '~/composables/useAuth';
import { dashboardHomeRedirectForRole, emailUnverifiedRedirect, staffOnlyAdminRedirect } from '~/utils/dashboardEntryGuard';

export default defineNuxtRouteMiddleware(async (to) => {
    const user = useUser();

    if (!user.value) return navigateTo('/login', { replace: true });

    const emailRedirect = emailUnverifiedRedirect(user.value);
    if (emailRedirect) {
        return navigateTo(emailRedirect, { replace: true });
    }

    const { isAdmin, isDeveloper, isManager, isCommunityManager, isSaleRepresentative } = useAuth();

    const isStaff = isAdmin.value || isDeveloper?.value || isManager?.value || isCommunityManager?.value || isSaleRepresentative?.value;

    const staffRedirect = staffOnlyAdminRedirect(to, isStaff);
    if (staffRedirect) {
        return navigateTo(staffRedirect, { replace: true });
    }

    const homeRedirect = dashboardHomeRedirectForRole(to, { isManager: isManager.value, isSaleRepresentative: isSaleRepresentative.value });
    if (homeRedirect && homeRedirect !== to.path) {
        return navigateTo(homeRedirect, { replace: true });
    }
});
