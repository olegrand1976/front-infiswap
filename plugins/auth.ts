import { defineNuxtPlugin, useNuxtApp } from '#app';
import { useUser } from '~/composables/useAuth';
import type { User } from '~/lib/types';

export default defineNuxtPlugin(async (nuxtApp) => {
    const user = useUser();
    const { $apifetch } = useNuxtApp();

    const fetchCurrentUser = async (): Promise<User> => {
        try {
            user.value = await $apifetch('/api/user');
            return user.value;
        }
        catch {
            return null;
        }
    };

    nuxtApp.provide('fetchCurrentUser', fetchCurrentUser);
    nuxtApp.provide('user', user.value);
});
