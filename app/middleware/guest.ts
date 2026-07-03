import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useUser } from '~/composables/useAuth';
import { AUTH_TOKEN } from '~/lib/constants';

export default defineNuxtRouteMiddleware(async () => {
    const user = useUser();
    const token = useCookie(AUTH_TOKEN);
    const { $apifetch } = useNuxtApp();

    if (user.value) {
        if (!user.value.email_verified_at) {
            await $apifetch('api/logout', { method: 'post' });
            user.value = null;
            token.value = '';
            return navigateTo('/');
        }
        return navigateTo('/dashboard', { replace: true });
    }
});
