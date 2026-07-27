import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuth, useUser } from '~/composables/useAuth';
import { waitForAuthReady } from '~/utils/accessReturn';

/**
 * Garantit auth + rôle staff sur toutes les routes /dashboard/admin/**
 * (même si une page omet middleware: ['admin']).
 */
export default defineNuxtRouteMiddleware(async (to) => {
    if (!to.path.startsWith('/dashboard/admin')) {
        return;
    }

    await waitForAuthReady();

    const user = useUser();

    if (!user.value) {
        const redirect = encodeURIComponent(to.fullPath);

        return navigateTo(`/login?redirect=${redirect}`, { replace: true });
    }

    if (!user.value.email_verified_at) {
        return navigateTo('/auth/verify-email', { replace: true });
    }

    const { isAdmin, isDeveloper, isManager, isCommunityManager, isSaleRepresentative } = useAuth();
    const isStaff = isAdmin.value
        || isDeveloper?.value
        || isManager?.value
        || isCommunityManager?.value
        || isSaleRepresentative?.value;

    if (!isStaff) {
        return navigateTo('/dashboard', { replace: true });
    }
});
