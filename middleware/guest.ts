import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useUser } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware(async () => {
    const user = useUser();
    const token = useCookie('AUTH_TOKEN');
    const { $apifetch } = useNuxtApp();

    if (user.value) {
        if (!user.value.email_verified_at) {
            user.value = null;
            token.value = '';
            await $apifetch('api/logout', { method: 'post' });
            return navigateTo('/');
        }
        return navigateTo('/dashboard', { replace: true });
    }
});
