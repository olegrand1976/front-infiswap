type ProductEventName =
    | 'replacement_created'
    | 'replacement_viewed'
    | 'response_sent'
    | 'email_cta_clicked'
    | 'platform_access_impression'
    | 'platform_access_cta_click'
    | 'boost_impression'
    | 'boost_cta_click'
    | 'boost_paid'
    | 'contract_offer_shown'
    | 'contract_cta_click'
    | 'contract_paid'
    | 'purchase_celebration_impression'
    | 'purchase_celebration_cta_click'
    | 'google_review_impression'
    | 'google_review_cta_click'
    | 'google_review_dismiss'
    | 'sponsorship_impression'
    | 'sponsorship_tier_click'
    | 'sponsorship_paid';

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
