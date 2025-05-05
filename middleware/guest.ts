import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useUser } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware(async () => {
    const user = useUser();
    if (user.value) {
        if (!user.value.email_verified_at) {
            return;
        }
        return navigateTo('/dashboard', { replace: true });
    }
});
