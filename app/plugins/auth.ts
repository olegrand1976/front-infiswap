import { defineNuxtPlugin, useCookie, useNuxtApp } from '#app';
import { useUser } from '~/composables/useAuth';
import { AUTH_TOKEN } from '~/lib/constants';
import type { User } from '~/lib/types';

export default defineNuxtPlugin(async (nuxtApp) => {
    const user = useUser();
    const authReady = useState('authReady', () => false);
    const token = useCookie(AUTH_TOKEN);
    const { $apifetch } = useNuxtApp();

    const fetchCurrentUser = async (): Promise<User | null> => {
        try {
            return await $apifetch('/api/user');
        }
        catch (error: { data?: { code?: string }; status?: number }) {
            if (error?.data?.code === 'institution_deleted') {
                token.value = null;
            }

            return null;
        }
    };

    if (!user.value) {
        if (token.value) {
            user.value = await fetchCurrentUser();
        }
        else {
            user.value = null;
        }
    }

    authReady.value = true;

    nuxtApp.provide('fetchCurrentUser', fetchCurrentUser);
    nuxtApp.provide('user', user.value);
});
