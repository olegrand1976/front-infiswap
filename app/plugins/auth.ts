import { defineNuxtPlugin, useCookie, useNuxtApp } from '#app';
import { useUser } from '~/composables/useAuth';
import { AUTH_TOKEN } from '~/lib/constants';
import type { User } from '~/lib/types';

export default defineNuxtPlugin(async (nuxtApp) => {
    const user = useUser();
    const { $apifetch } = useNuxtApp();

    const fetchCurrentUser = async (): Promise<User> => {
        try {
            return await $apifetch('/api/user');
        }
        catch (error: { data?: { code?: string }; status?: number }) {
            if (error?.data?.code === 'institution_deleted') {
                useCookie(AUTH_TOKEN).value = null;
            }

            return null;
        }
    };

    if (!user.value) {
        user.value = await fetchCurrentUser();
    }

    nuxtApp.provide('fetchCurrentUser', fetchCurrentUser);
    nuxtApp.provide('user', user.value);
});
