import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useUser } from '~/composables/useAuth';
import { useAuthTokenCookie } from '~/lib/authTokenCookie';

export default defineNuxtRouteMiddleware(async () => {
    const user = useUser();
    const token = useAuthTokenCookie();
    const { $apifetch } = useNuxtApp();
    const { refresh } = useAuth();

    if (!user.value && token.value) {
        await refresh();
    }

    if (user.value && token.value) {
        if (!user.value.email_verified_at) {
            await $apifetch('api/logout', { method: 'post' });
            user.value = null;
            token.value = '';
            return navigateTo('/');
        }
        return navigateTo('/dashboard', { replace: true });
    }

    if (user.value && !token.value) {
        user.value = null;
    }
});
