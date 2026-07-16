import { defineNuxtPlugin, useNuxtApp } from '#app';
import { useUser } from '~/composables/useAuth';
import { clearLegacyHostOnlyAuthCookie, useAuthTokenCookie } from '~/lib/authTokenCookie';
import type { User } from '~/lib/types';

export default defineNuxtPlugin(async (nuxtApp) => {
    const user = useUser();
    const authReady = useState('authReady', () => false);
    const token = useAuthTokenCookie();
    const { $apifetch } = useNuxtApp();

    if (import.meta.client) {
        clearLegacyHostOnlyAuthCookie();
    }

    const fetchCurrentUser = async (): Promise<User | null> => {
        try {
            return await $apifetch('/api/user');
        }
        catch (error: { data?: { code?: string }; status?: number; statusCode?: number }) {
            const status = error?.status ?? error?.statusCode;
            if (status === 401 || status === 403 || error?.data?.code === 'institution_deleted') {
                token.value = null;
            }

            return null;
        }
    };

    if (!token.value) {
        user.value = null;
    }
    else if (!user.value) {
        user.value = await fetchCurrentUser();
    }

    authReady.value = true;

    nuxtApp.provide('fetchCurrentUser', fetchCurrentUser);
    nuxtApp.provide('authReady', authReady);
    nuxtApp.provide('user', user.value);
});
