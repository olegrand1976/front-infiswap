import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useUser } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware(async (to) => {
    const user = useUser();

    if (!user.value) return navigateTo('/login', { replace: true });

    const { isAdmin, isDeveloper, isManager, isCommunityManager, isSaleRepresentative } = useAuth();

    const isStaff = isAdmin.value || isDeveloper?.value || isManager?.value || isCommunityManager?.value || isSaleRepresentative?.value;

    if (to.path.startsWith('/dashboard/admin') && !isStaff) {
        return navigateTo('/dashboard', { replace: true });
    }

    if (to.path === '/dashboard') {
        let redirectTo: string | null = null;

        switch (true) {
            case isManager.value:
                redirectTo = '/dashboard/admin/replacements';
                break;

            case isCommunityManager.value:
                redirectTo = '/dashboard/admin/registrations';
                break;

            case isSaleRepresentative.value:
                redirectTo = '/dashboard/admin/users/crm';
                break;

            default:
                redirectTo = null;
        }

        if (redirectTo && redirectTo !== to.path) {
            return navigateTo(redirectTo, { replace: true });
        }
    }
});
