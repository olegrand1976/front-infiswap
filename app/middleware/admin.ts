import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware((to) => {
    const { isAdmin, isDeveloper, isManager, isCommunityManager, isSaleRepresentative } = useAuth();

    const isStaff = isAdmin.value || isDeveloper?.value || isManager?.value || isCommunityManager?.value || isSaleRepresentative?.value;

    if (to.path.startsWith('/dashboard/admin') && !isStaff) {
        return navigateTo('/dashboard', { replace: true });
    }
});
