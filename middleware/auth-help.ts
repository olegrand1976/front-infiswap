import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useUser } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware(() => {
    const user = useUser();

    if (!user.value) {
        return navigateTo('/register-immediate', { replace: true });
    }
});
