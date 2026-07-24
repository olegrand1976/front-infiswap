export default defineNuxtPlugin({
    name: 'cookie-consent',
    enforce: 'pre',
    setup() {
        if (!import.meta.client) {
            return;
        }

        const w = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
        w.dataLayer = w.dataLayer || [];
        const gtag = w.gtag || ((...args: unknown[]) => {
            w.dataLayer?.push(args);
        });

        // Consent Mode v2 — denied until the user accepts via the banner
        gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500,
        });

        const { init } = useCookieConsent();
        init();
    },
});
