type ProductEventName =
    | 'replacement_created'
    | 'replacement_viewed'
    | 'response_sent'
    | 'email_cta_clicked'
    | 'platform_access_impression'
    | 'platform_access_cta_click'
    | 'platform_access_checkout_started'
    | 'platform_access_paid'
    | 'onboarding_banner_click'
    | 'referral_dashboard_copy'
    | 'boost_impression'
    | 'boost_cta_click'
    | 'boost_paid'
    | 'boost_free_claimed'
    | 'contract_offer_shown'
    | 'contract_cta_click'
    | 'contract_paid'
    | 'pro_checkout_start'
    | 'pro_offer_checkout_start'
    | 'pro_checkout_success'
    | 'pro_offer_banner_impression'
    | 'pro_offer_banner_click'
    | 'pro_upsell_impression'
    | 'pro_upsell_click'
    | 'purchase_celebration_impression'
    | 'purchase_celebration_cta_click'
    | 'google_review_impression'
    | 'google_review_cta_click'
    | 'google_review_dismiss'
    | 'sponsorship_paid'
    | 'nurstech_impression'
    | 'nurstech_cta_click'
    | 'nurstech_form_start'
    | 'nurstech_form_submit'
    | 'nursassur_impression'
    | 'nursassur_cta_click'
    | 'nursassur_form_start'
    | 'nursassur_form_submit'
    | 'partner_banner_impression'
    | 'partner_banner_click'
    | 'infiswap_replacements_cta_click';

export function useProductAnalytics() {
    const { gtag } = useGtag();
    const { hasAnalyticsConsent } = useCookieConsent();

    function trackEvent(eventName: ProductEventName, params?: Record<string, string | number | boolean>) {
        if (import.meta.server) {
            return;
        }

        if (!hasAnalyticsConsent()) {
            return;
        }

        gtag('event', eventName, params ?? {});
    }

    return { trackEvent };
}
