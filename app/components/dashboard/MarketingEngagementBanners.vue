<script setup lang="ts">
import { ArrowRight, MessageSquare } from 'lucide-vue-next';
import type { User } from '~/lib/types';

type NurseResponseItem = {
    responses?: Array<{ status?: string }>;
};

const user = useState<User | null>('user');
const { $apifetch } = useNuxtApp();
const {
    activeCampaign,
    fetchActiveCampaign,
    trackPartnerBannerImpression,
    trackPartnerBannerClick,
    registerPartnerClickFromProduct,
} = usePartnerServices();

const partnerBannerImpressionSent = ref(false);
const pendingResponseCount = ref(0);

const isNursAssurEligible = computed(() => {
    const country = user.value?.profile?.country;

    if (!country) {
        return false;
    }

    const normalized = country.toLowerCase();

    return normalized === 'be' || normalized === 'belgique';
});

const showCandidateBanner = computed(() => pendingResponseCount.value > 0);

const showPartnerBanner = computed(() => {
    if (!activeCampaign.value || showCandidateBanner.value) {
        return false;
    }

    if (activeCampaign.value.featured === 'nursassur' && !isNursAssurEligible.value) {
        return false;
    }

    return true;
});

const partnerCtaPath = computed(() => activeCampaign.value?.cta_path ?? '/nurstech-by-infiswap');
const partnerIsNursAssur = computed(() => activeCampaign.value?.featured === 'nursassur');

const localePath = useLocalePath();
const partnerCtaTo = computed(() => {
    const raw = partnerCtaPath.value;
    const hashIndex = raw.indexOf('#');
    if (hashIndex === -1) {
        return localePath(raw);
    }

    return `${localePath(raw.slice(0, hashIndex))}#${raw.slice(hashIndex + 1)}`;
});

async function loadPendingResponseCount() {
    if (!user.value?.id) {
        pendingResponseCount.value = 0;

        return;
    }

    try {
        const response = await $apifetch<{ data?: NurseResponseItem[] }>(
            `api/replacement-responses/nurse/${user.value.id}`,
            { method: 'GET' },
        );

        pendingResponseCount.value = (response.data ?? []).reduce((sum, item) => {
            const pending = (item.responses ?? []).filter(
                (candidate) => candidate.status === 'pending',
            ).length;

            return sum + pending;
        }, 0);
    }
    catch {
        pendingResponseCount.value = 0;
    }
}

onMounted(async () => {
    await loadPendingResponseCount();
    await fetchActiveCampaign();
});

watch(showPartnerBanner, (visible) => {
    if (visible && !partnerBannerImpressionSent.value) {
        trackPartnerBannerImpression();
        partnerBannerImpressionSent.value = true;
    }
});

function onPartnerBannerClick() {
    const cta = partnerIsNursAssur.value ? 'see_offer' : 'request_callback';
    trackPartnerBannerClick(cta);
    if (activeCampaign.value?.featured) {
        registerPartnerClickFromProduct(
            activeCampaign.value.featured,
            'dashboard',
            'partner_banner',
        );
    }
}
</script>

<template>
    <div
        v-if="showCandidateBanner || showPartnerBanner"
        class="mx-6 mt-4 space-y-2"
    >
        <div
            v-if="showCandidateBanner"
            class="flex flex-col gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 sm:flex-row sm:items-center sm:justify-between"
        >
            <div class="flex items-start gap-2">
                <MessageSquare
                    class="mt-0.5 size-5 shrink-0 text-emerald-600"
                    aria-hidden="true"
                />
                <span>
                    Vous avez <strong>{{ pendingResponseCount }}</strong> candidature(s) en attente de réponse.
                </span>
            </div>
            <NuxtLink
                to="/dashboard/replacements/responses"
                class="inline-flex shrink-0 items-center justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
                Voir les candidatures
            </NuxtLink>
        </div>

        <div
            v-else-if="showPartnerBanner"
            class="flex flex-col gap-2 rounded-lg border px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
            :class="partnerIsNursAssur ? 'border-indigo-200 bg-indigo-50 text-indigo-950' : 'border-blue-200 bg-blue-50 text-blue-950'"
        >
            <div>
                <p class="font-semibold">
                    {{ activeCampaign?.headline }}
                </p>
                <p class="mt-0.5 text-xs opacity-90">
                    {{ activeCampaign?.banner_copy }}
                </p>
            </div>
            <NuxtLink
                :to="partnerCtaTo"
                class="inline-flex shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-sm font-semibold text-white"
                :class="partnerIsNursAssur ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'"
                @click="onPartnerBannerClick"
            >
                {{ partnerIsNursAssur ? $t('partnerPromo.bannerCtaNursassur') : $t('partnerPromo.bannerCtaNurstech') }}
                <ArrowRight class="size-4" />
            </NuxtLink>
        </div>
    </div>
</template>
