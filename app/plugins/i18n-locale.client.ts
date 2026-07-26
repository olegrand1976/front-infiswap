import { LANGUAGE } from '~/lib/constants';
import { setDayjsLocale } from '~/composables/useDate';
import {
    detectLocaleFromBrowser,
    isAppLocale,
    normalizeAppLocale,
} from '~/utils/appLocale';

/**
 * Sync cookie + dayjs with vue-i18n locale.
 * Must not call useI18n() here — Nuxt plugin setup has no currentInstance
 * (vue-i18n MUST_BE_CALL_SETUP_TOP / SyntaxError: 26).
 */
export default defineNuxtPlugin({
    name: 'i18n-locale-sync',
    dependsOn: ['i18n:plugin'],
    setup(nuxtApp) {
        const i18n = nuxtApp.$i18n;
        const languageCookie = useCookie<string | null>(LANGUAGE, {
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365,
        });

        watch(
            () => i18n.locale.value,
            (value) => {
                const normalized = normalizeAppLocale(value);
                languageCookie.value = normalized;
                setDayjsLocale(normalized);
            },
            { immediate: true },
        );

        if (import.meta.client && !isAppLocale(languageCookie.value)) {
            const browserTag = navigator.language || navigator.languages?.[0] || null;
            const next = detectLocaleFromBrowser(browserTag);
            languageCookie.value = next;
            if (normalizeAppLocale(i18n.locale.value) !== next) {
                void i18n.setLocale(next);
            }
        }
    },
});
