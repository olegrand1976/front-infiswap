import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useUser } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware(() => {
    const user = useUser();

    if (!user.value) return navigateTo('/login');

    if (user.value.email_verified_at)
        return navigateTo('dashboard/');
});
