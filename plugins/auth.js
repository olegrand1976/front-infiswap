import { defineNuxtPlugin, useNuxtApp } from '#app';
import { useUser } from '~/composables/useAuth';

export default defineNuxtPlugin(async (nuxtApp) => {
    const user = useUser();
    const { $apifetch } = useNuxtApp();

    const fetchCurrentUser = async () => {
        try {
            return await $apifetch('/api/user');
        }
        catch (error) {
            console.error('Failed to fetch user:', error);
            return null;
        }
    };

    if (!user.value) {
        user.value = await fetchCurrentUser();
    }

    nuxtApp.provide('fetchCurrentUser', fetchCurrentUser);
    nuxtApp.provide('user', user.value);
});
