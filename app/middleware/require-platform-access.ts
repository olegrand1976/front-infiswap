import { useSubscription } from '~/composables/useSubscription';

export default defineNuxtRouteMiddleware(async () => {
    const { requirePlatformAccess } = useSubscription();

    await requirePlatformAccess();
});
