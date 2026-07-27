import { defineNuxtPlugin, useNuxtApp, type NuxtApp } from '#app';
import { useUser } from '~/composables/useAuth';
import { clearLegacyHostOnlyAuthCookie, useAuthTokenCookie } from '~/lib/authTokenCookie';
import type { User } from '~/lib/types';
import { isAppLocale, normalizeAppLocale } from '~/utils/appLocale';
import { LANGUAGE } from '~/lib/constants';
import { setDayjsLocale } from '~/composables/useDate';

export default defineNuxtPlugin({
    name: 'auth',
    dependsOn: ['i18n:plugin'],
    async setup(nuxtApp) {
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

        if (import.meta.client && user.value) {
            await syncLocaleFromUserSettings(nuxtApp, user.value);
        }

        nuxtApp.provide('fetchCurrentUser', fetchCurrentUser);
        nuxtApp.provide('authReady', authReady);
        nuxtApp.provide('user', user.value);
    },
});

async function syncLocaleFromUserSettings(nuxtApp: NuxtApp, user: User): Promise<void> {
    if (!user.settings) {
        return;
    }

    let raw: unknown;
    try {
        raw = (JSON.parse(user.settings) as { language?: unknown }).language;
    }
    catch {
        return;
    }

    if (!isAppLocale(raw)) {
        return;
    }

    const next = normalizeAppLocale(raw);
    const languageCookie = useCookie<string | null>(LANGUAGE, {
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
    });
    languageCookie.value = next;
    setDayjsLocale(next);

    const i18n = nuxtApp.$i18n;
    if (normalizeAppLocale(i18n.locale.value) !== next) {
        await i18n.setLocale(next);
    }
}
