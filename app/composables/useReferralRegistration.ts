import {
    clearReferralCode,
    consumePersistedReferralCode,
    formatReferrerDisplay,
    persistReferralCode,
    readReferralFromRoute,
    type ReferralPreviewResponse,
} from '~/utils/referral';

export function useReferralRegistration() {
    const route = useRoute();
    const { $apifetch } = useNuxtApp();

    const referralCode = ref<string | null>(null);
    const referrerDisplay = ref<string | null>(null);

    async function loadReferralPreview() {
        const fromRoute = readReferralFromRoute(route.query);

        if (fromRoute) {
            persistReferralCode(fromRoute);
            referralCode.value = fromRoute;
        }
        else {
            referralCode.value = consumePersistedReferralCode();
        }

        if (!referralCode.value) {
            return;
        }

        try {
            const response = await $apifetch<ReferralPreviewResponse>(`/api/referral/${referralCode.value}`);
            referrerDisplay.value = formatReferrerDisplay(
                response.referrer.firstname,
                response.referrer.lastInitial,
            );
        }
        catch {
            referrerDisplay.value = null;
        }
    }

    onMounted(() => {
        void loadReferralPreview();
    });

    function clearReferralRegistration() {
        clearReferralCode();
        referralCode.value = null;
        referrerDisplay.value = null;
    }

    return {
        referralCode,
        referrerDisplay,
        clearReferralRegistration,
    };
}
