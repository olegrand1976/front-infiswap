import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useUser } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware(async (to) => {
    const user = useUser();

    if (!user.value) return navigateTo('/login', { replace: true });

    if (!user.value.email_verified_at) {
        return navigateTo('/auth/verify-email', { replace: true });
    }

    const { isAdmin, isDeveloper, isManager, isCommunityManager, isSaleRepresentative, isInstitution } = useAuth();

    const isStaff = isAdmin.value || isDeveloper?.value || isManager?.value || isCommunityManager?.value || isSaleRepresentative?.value;

    if (to.path.startsWith('/dashboard/admin') && !isStaff) {
        return navigateTo('/dashboard', { replace: true });
    }

    if (isInstitution.value) {
        const institutionStatus = user.value.institution?.status;
        const isFullyValidated = institutionStatus === 'active' || !!user.value.validate_at;

        if (to.path === '/dashboard/account') {
            return;
        }

        if (to.path === '/dashboard' || (to.path.startsWith('/dashboard') && !to.path.startsWith('/dashboard/institution') && !to.path.startsWith('/dashboard/replacements/detail/'))) {
            if (isFullyValidated) {
                return navigateTo('/dashboard/institution', { replace: true });
            }
            else {
                return navigateTo('/dashboard/institution/pending-validation', { replace: true });
            }
        }
    }

    if (to.path === '/dashboard') {
        let redirectTo: string | null = null;

        switch (true) {
            case isManager.value:
                redirectTo = '/dashboard/admin/replacements';
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
