import type { PartnerCampaign, PartnerProduct } from '~/utils/partnerServices';

type PartnerClickPayload = {
    product: string;
    source?: string;
    placement?: string;
    utm_campaign?: string;
};

export function usePartnerServices() {
    const { $apifetch } = useNuxtApp();
    const { productClick } = useProduct();
    const { trackEvent } = useProductAnalytics();

    const activeCampaign = useState<PartnerCampaign | null>('partnerActiveCampaign', () => null);

    async function fetchActiveCampaign(): Promise<PartnerCampaign | null> {
        try {
            const response = await $apifetch<{ data: PartnerCampaign }>('api/partner-campaigns/active');
            activeCampaign.value = response.data;

            return response.data;
        }
        catch {
            return null;
        }
    }

    function trackPartnerImpression(product: PartnerProduct, placement: string, source = 'web') {
        trackEvent(`${product}_impression`, {
            source,
            product,
            placement,
            campaign_period: activeCampaign.value?.period ?? 'unknown',
        });
    }

    function trackPartnerCtaClick(
        product: PartnerProduct,
        placement: string,
        cta: 'discover' | 'contact' | 'learn_more' | 'banner',
        source = 'web',
    ) {
        trackEvent(`${product}_cta_click`, {
            source,
            product,
            placement,
            cta,
            campaign_period: activeCampaign.value?.period ?? 'unknown',
        });
    }

    function trackPartnerFormStart(product: PartnerProduct, placement: string) {
        trackEvent(`${product}_form_start`, { product, placement });
    }

    function trackPartnerFormSubmit(product: PartnerProduct, placement: string) {
        trackEvent(`${product}_form_submit`, { product, placement });
    }

    function trackPartnerBannerImpression() {
        if (!activeCampaign.value) {
            return;
        }

        trackEvent('partner_banner_impression', {
            product: activeCampaign.value.featured,
            campaign_period: activeCampaign.value.period,
        });
    }

    function trackPartnerBannerClick() {
        if (!activeCampaign.value) {
            return;
        }

        trackEvent('partner_banner_click', {
            product: activeCampaign.value.featured,
            campaign_period: activeCampaign.value.period,
        });
    }

    async function registerPartnerClick(payload: PartnerClickPayload) {
        try {
            await productClick(payload);
        }
        catch {
            // gtag remains the source of truth for anonymous users
        }
    }

    return {
        activeCampaign,
        fetchActiveCampaign,
        trackPartnerImpression,
        trackPartnerCtaClick,
        trackPartnerFormStart,
        trackPartnerFormSubmit,
        trackPartnerBannerImpression,
        trackPartnerBannerClick,
        registerPartnerClick,
    };
}
