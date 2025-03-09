import { defineNuxtPlugin, useNuxtApp } from '#app';
import { useUser } from '~/composables/useAuth';
import type { User } from '~/lib/types';

export default defineNuxtPlugin(async (nuxtApp) => {
    const user = useUser();
    const { $apifetch } = useNuxtApp();

    const fetchCurrentUser = async () : Promise<User> => {
        try {
            return await $apifetch('/api/user');
        }
        catch {
            return null;
        }
    };

    if (!user.value) {
        user.value = await fetchCurrentUser();
    }

    nuxtApp.provide('fetchCurrentUser', fetchCurrentUser);
    nuxtApp.provide('user', user.value);
});
