import { assertAllowedExternalRedirectUrl, extractStripeSessionId, isStripeCheckoutSessionId } from '~/utils/accessReturn';
import type { SponsorshipPlan } from '~/utils/sponsorship';
import type { GoogleReviewSource } from '~/utils/googleReview';

interface SponsorshipCheckoutResponse {
    url: string;
}

interface SponsorshipConfirmResponse {
    status: 'active' | 'pending';
}

export function useSponsorship() {
    const { $apifetch } = useNuxtApp();
    const { trackEvent } = useProductAnalytics();

    const plans = useState<SponsorshipPlan[]>('sponsorshipPlans', () => []);
    const loadingPlans = useState('sponsorshipPlansLoading', () => false);
    const checkoutLoading = ref(false);

    async function fetchPlans(): Promise<SponsorshipPlan[]> {
        if (plans.value.length > 0) {
            return plans.value;
        }

        loadingPlans.value = true;

        try {
            const response = await $apifetch<{ plans: SponsorshipPlan[] }>('api/subscription/sponsorship/plans');
            plans.value = response.plans ?? [];

            return plans.value;
        }
        finally {
            loadingPlans.value = false;
        }
    }

    async function checkout(planId: number, redirectTo: string, source: GoogleReviewSource): Promise<void> {
        checkoutLoading.value = true;

        try {
            const response = await $apifetch<SponsorshipCheckoutResponse>('api/subscription/sponsorship/checkout', {
                method: 'POST',
                body: {
                    plan_id: planId,
                    redirect_to: redirectTo,
                    source,
                },
            });

            const checkoutUrl = assertAllowedExternalRedirectUrl(response?.url);
            if (checkoutUrl) {
                window.location.assign(checkoutUrl);
            }
        }
        finally {
            checkoutLoading.value = false;
        }
    }

    async function confirm(sessionId: string): Promise<'active' | 'pending' | 'error'> {
        for (let attempt = 0; attempt < 4; attempt++) {
            try {
                const response = await $apifetch<SponsorshipConfirmResponse>('api/subscription/sponsorship/confirm', {
                    method: 'POST',
                    body: { session_id: sessionId },
                });

                if (response.status === 'active') {
                    return 'active';
                }
            }
            catch (error: unknown) {
                const status = (error as { statusCode?: number })?.statusCode;

                if (status !== 202) {
                    return 'error';
                }
            }

            if (attempt < 3) {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }

        return 'pending';
    }

    async function processStripeReturn(query: Record<string, unknown>): Promise<boolean> {
        if (query.sponsorship !== 'success') {
            return false;
        }

        const sessionId = extractStripeSessionId(query);

        if (!sessionId || !isStripeCheckoutSessionId(sessionId)) {
            return false;
        }

        const outcome = await confirm(sessionId);

        if (outcome === 'active') {
            trackEvent('sponsorship_paid', { session_id: sessionId });
        }

        return outcome === 'active';
    }

    return {
        plans,
        loadingPlans,
        checkoutLoading,
        fetchPlans,
        checkout,
        confirm,
        processStripeReturn,
    };
}
