import { useSubscription } from '~/composables/useSubscription';

export default defineNuxtRouteMiddleware(async () => {
    const { check } = useSubscription();
    const user = useUser();

    if (!user.value?.id) return;

    const response = await check(user.value.id);

    if (response?.status === 'expired') {
        return navigateTo('/dashboard/subscription/create');
    }
});
