import { LANGUAGE } from '~/lib/constants';
import { setDayjsLocale } from '~/composables/useDate';
import { isAppLocale, normalizeAppLocale } from '~/utils/appLocale';

export default defineNuxtPlugin(() => {
    const { locale } = useI18n();
    const languageCookie = useCookie<string | null>(LANGUAGE, {
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
    });

    watch(
        locale,
        (value) => {
            const normalized = normalizeAppLocale(value);
            languageCookie.value = normalized;
            setDayjsLocale(normalized);
        },
        { immediate: true },
    );

    if (import.meta.client && !isAppLocale(languageCookie.value)) {
        const { syncFromUserOrBrowser } = useAppLocale();
        void syncFromUserOrBrowser();
    }
});
