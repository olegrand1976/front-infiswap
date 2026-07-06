type ProductEventName =
    | 'replacement_created'
    | 'replacement_viewed'
    | 'response_sent'
    | 'email_cta_clicked';

export function useProductAnalytics() {
    const { gtag } = useGtag();

    function trackEvent(eventName: ProductEventName, params?: Record<string, string | number | boolean>) {
        if (import.meta.server) {
            return;
        }

        gtag('event', eventName, params ?? {});
    }

    return { trackEvent };
}
