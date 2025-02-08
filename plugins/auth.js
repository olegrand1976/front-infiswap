import { defineNuxtPlugin, useNuxtApp } from '#app';
import { useUser } from '~/composables/useAuth';

export default defineNuxtPlugin(async (nuxtApp) => {
    const user = useUser();
    const { $apifetch } = useNuxtApp();

    if (user.value !== undefined) return;

    const fetchCurrentUser = async () => {
        try {
            return await $apifetch('/api/user');
        }
        catch (error) {
            console.error('Failed to fetch user:', error);
            return null;
        }
    };
    user.value = await fetchCurrentUser();

    nuxtApp.provide('fetchCurrentUser', fetchCurrentUser);
});
