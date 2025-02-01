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
            if ([401, 419].includes(error?.response?.status)) return null;
            throw error;
        }
    };
    user.value = await fetchCurrentUser();

    nuxtApp.provide('fetchCurrentUser', fetchCurrentUser);
});
