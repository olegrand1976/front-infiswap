export type AppLocale = 'fr' | 'nl';

export function isAppLocale(value: unknown): value is AppLocale {
    return value === 'fr' || value === 'nl';
}

export function normalizeAppLocale(value: unknown, fallback: AppLocale = 'fr'): AppLocale {
    if (typeof value !== 'string') {
        return fallback;
    }

    const code = value.toLowerCase().slice(0, 2);

    return isAppLocale(code) ? code : fallback;
}

/** Browser / Accept-Language tag → fr|nl (nl* → nl, else fr). */
export function detectLocaleFromBrowser(languageTag: string | null | undefined): AppLocale {
    if (!languageTag) {
        return 'fr';
    }

    return languageTag.toLowerCase().startsWith('nl') ? 'nl' : 'fr';
}
