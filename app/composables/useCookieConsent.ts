import {
    COOKIE_CONSENT_STORAGE_KEY,
    parseCookieConsent,
    type CookieConsentPreferences,
} from '@/utils/cookieConsent';
import {
    META_PIXEL_SCRIPT_ATTR,
    clearMetaPixelGlobals,
    hasAnalyticsConsentFromPrefs,
    hasMarketingConsentFromPrefs,
    resolveMetaPixelEnsureAction,
    type MetaPixelHost,
} from '@/utils/metaPixelLifecycle';

type MetaWindow = Window & MetaPixelHost;

export function useCookieConsent() {
    const preferences = useState<CookieConsentPreferences | null>('cookie-consent', () => null);
    const bannerVisible = useState<boolean>('cookie-consent-banner', () => false);
    const bootstrapped = useState<boolean>('cookie-consent-bootstrapped', () => false);

    function loadFromStorage(): CookieConsentPreferences | null {
        if (!import.meta.client) {
            return null;
        }

        return parseCookieConsent(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY));
    }

    function applyConsentToTrackers(prefs: CookieConsentPreferences): void {
        if (!import.meta.client) {
            return;
        }

        const w = window as Window & {
            gtag?: (...args: unknown[]) => void;
            dataLayer?: unknown[];
            fbq?: (...args: unknown[]) => void;
        };

        w.dataLayer = w.dataLayer || [];
        const gtag = w.gtag || ((...args: unknown[]) => {
            w.dataLayer?.push(args);
        });

        gtag('consent', 'update', {
            analytics_storage: prefs.analytics ? 'granted' : 'denied',
            ad_storage: prefs.marketing ? 'granted' : 'denied',
            ad_user_data: prefs.marketing ? 'granted' : 'denied',
            ad_personalization: prefs.marketing ? 'granted' : 'denied',
        });

        if (prefs.marketing) {
            ensureMetaPixel();
        }
        else {
            revokeMetaPixel();
        }
    }

    function ensureMetaPixel(): void {
        if (!import.meta.client) {
            return;
        }

        const w = window as MetaWindow;
        const hasScript = !!document.querySelector(`script[${META_PIXEL_SCRIPT_ATTR}]`);
        const action = resolveMetaPixelEnsureAction(typeof w.fbq === 'function', hasScript);

        if (action === 'grant_only') {
            try {
                w.fbq?.('consent', 'grant');
            }
            catch {
                // older pixel builds may not support consent API
            }
            return;
        }

        // Stale stub after revoke (script removed) → clear then re-inject
        if (typeof w.fbq === 'function') {
            clearMetaPixelGlobals(w);
        }

        const config = useRuntimeConfig();
        const pixelId = String(config.public.metaPixelId || '1687858552113266');

        const n = function (...args: unknown[]) {
            (n as unknown as { queue: unknown[] }).queue.push(args);
        } as unknown as ((...args: unknown[]) => void) & {
            queue: unknown[];
            loaded: boolean;
            version: string;
            push: (...args: unknown[]) => void;
        };
        n.queue = [];
        n.loaded = true;
        n.version = '2.0';
        n.push = n;
        w.fbq = n;
        w._fbq = n;

        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        script.setAttribute(META_PIXEL_SCRIPT_ATTR, '1');
        document.head.appendChild(script);

        w.fbq('init', pixelId);
        w.fbq('track', 'PageView');
    }

    function revokeMetaPixel(): void {
        if (!import.meta.client) {
            return;
        }

        const w = window as MetaWindow;
        if (typeof w.fbq === 'function') {
            try {
                w.fbq('consent', 'revoke');
            }
            catch {
                // ignore
            }
        }

        document.querySelectorAll(`script[${META_PIXEL_SCRIPT_ATTR}]`).forEach(node => node.remove());

        // Best-effort purge of Meta cookies on current host
        const expire = 'Thu, 01 Jan 1970 00:00:00 GMT';
        ['_fbp', '_fbc'].forEach((name) => {
            document.cookie = `${name}=; expires=${expire}; path=/`;
            document.cookie = `${name}=; expires=${expire}; path=/; domain=${window.location.hostname}`;
        });

        // Allow ensureMetaPixel() to re-inject without a full page reload
        clearMetaPixelGlobals(w);
    }

    function init(): void {
        if (!import.meta.client) {
            return;
        }

        // Plugin (enforce:pre) + banner onMounted may both call init — run once
        if (bootstrapped.value) {
            return;
        }
        bootstrapped.value = true;

        const stored = loadFromStorage();
        if (stored) {
            preferences.value = stored;
            bannerVisible.value = false;
            applyConsentToTrackers(stored);
            return;
        }

        preferences.value = null;
        bannerVisible.value = true;
    }

    function save(prefs: Omit<CookieConsentPreferences, 'necessary'>): void {
        const next: CookieConsentPreferences = {
            necessary: true,
            analytics: prefs.analytics,
            marketing: prefs.marketing,
        };
        preferences.value = next;
        bannerVisible.value = false;

        if (import.meta.client) {
            localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(next));
            applyConsentToTrackers(next);
        }
    }

    function acceptAll(): void {
        save({ analytics: true, marketing: true });
    }

    function rejectNonEssential(): void {
        save({ analytics: false, marketing: false });
    }

    function openPreferences(): void {
        bannerVisible.value = true;
    }

    function hasAnalyticsConsent(): boolean {
        return hasAnalyticsConsentFromPrefs(preferences.value);
    }

    function hasMarketingConsent(): boolean {
        return hasMarketingConsentFromPrefs(preferences.value);
    }

    return {
        preferences,
        bannerVisible,
        init,
        save,
        acceptAll,
        rejectNonEssential,
        openPreferences,
        hasAnalyticsConsent,
        hasMarketingConsent,
        applyConsentToTrackers,
    };
}
