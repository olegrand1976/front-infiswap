import { LANGUAGE } from '~/lib/constants';
import {
    detectLocaleFromBrowser,
    isAppLocale,
    normalizeAppLocale,
    type AppLocale,
} from '~/utils/appLocale';

export function useAppLocale() {
    const { locale, setLocale, locales } = useI18n();
    const languageCookie = useCookie<string | null>(LANGUAGE, {
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
    });

    const currentLocale = computed<AppLocale>(() => normalizeAppLocale(locale.value));

    async function applyLocale(next: AppLocale, options?: { persistSettings?: boolean }) {
        const normalized = normalizeAppLocale(next);
        languageCookie.value = normalized;
        await setLocale(normalized);

        if (options?.persistSettings === false) {
            return;
        }

        const { user, createPreferences } = useAuth();
        if (user.value?.id && user.value?.settings) {
            try {
                await createPreferences({
                    key: 'language',
                    value: normalized,
                });
                if (user.value.settings) {
                    user.value.settings.language = normalized;
                }
            }
            catch {
                // Cookie + i18n already updated; settings sync is best-effort.
            }
        }
    }

    async function syncFromUserOrBrowser() {
        const { user } = useAuth();
        const settingsLang = user.value?.settings?.language;

        if (isAppLocale(settingsLang)) {
            await applyLocale(settingsLang, { persistSettings: false });
            return;
        }

        if (isAppLocale(languageCookie.value)) {
            await applyLocale(languageCookie.value, { persistSettings: false });
            return;
        }

        const browserTag = import.meta.client
            ? (navigator.language || navigator.languages?.[0] || null)
            : null;
        await applyLocale(detectLocaleFromBrowser(browserTag), { persistSettings: false });
    }

    return {
        locale: currentLocale,
        locales,
        applyLocale,
        syncFromUserOrBrowser,
        languageCookie,
    };
}
