import { useSubscription } from '~/composables/useSubscription';
import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware(async () => {
    const { check } = useSubscription();
    const { isCollaborator, isAdmin, isDeveloper, isManager, isCommunityManager, isSaleRepresentative, isTester } = useAuth();
    const user = useUser();

    if (!user.value?.id) return;

    // Bypass for roles that don't need a subscription
    if (isCollaborator.value || isAdmin.value || isDeveloper.value || isManager.value
        || isCommunityManager.value || isSaleRepresentative.value || isTester.value) {
        return;
    }

    const response = await check(user.value.id);

    if (response?.status === 'expired') {
        return navigateTo('/acces-plan');
    }
});
