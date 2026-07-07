<script setup lang="ts">
import { ArrowRight, Medal, MessageSquare } from 'lucide-vue-next';
import { hasPaidPlatformAccess, isSubjectToPlatformAccessPayment } from '~/utils/platformAccess';
import type { User } from '~/lib/types';

const user = useState<User | null>('user');
const { notifications, getAll } = useNotifications();
const { showWidget: showNetworkJourneyWidget } = useNetworkJourney();
const { trackEvent } = useProductAnalytics();
const {
    activeCampaign,
    fetchActiveCampaign,
    trackPartnerBannerImpression,
    trackPartnerBannerClick,
} = usePartnerServices();

const showAccessBanner = computed(() =>
    isSubjectToPlatformAccessPayment(user.value)
    && !hasPaidPlatformAccess(user.value)
    && !showNetworkJourneyWidget.value,
);

const pendingResponseCount = computed(() =>
    (notifications.value?.data ?? []).filter(
        (notification) => notification.type === 'replacement.response' && !notification.read_at,
    ).length,
);

const showCandidateBanner = computed(() =>
    pendingResponseCount.value > 0 && !showAccessBanner.value,
);

const showPartnerBanner = computed(() =>
    !showAccessBanner.value
    && !showCandidateBanner.value
    && !!activeCampaign.value,
);

const partnerCtaPath = computed(() => activeCampaign.value?.cta_path ?? '/nurstech-by-infiswap');
const partnerIsNursAssur = computed(() => activeCampaign.value?.featured === 'nursassur');

onMounted(async () => {
    try {
        await getAll(1, 25, { unread_only: true });
    }
    catch {
        // optional banner
    }

    if (showAccessBanner.value) {
        trackEvent('platform_access_impression', { source: 'banner' });
    }

    await fetchActiveCampaign();
});

watch(showPartnerBanner, (visible) => {
    if (visible) {
        trackPartnerBannerImpression();
    }
});

function onAccessClick() {
    trackEvent('platform_access_cta_click', { source: 'banner' });
}

function onPartnerBannerClick() {
    trackPartnerBannerClick();
}
</script>

<template>
    <div
        v-if="showAccessBanner || showCandidateBanner || showPartnerBanner"
        class="mx-6 mt-4 space-y-2"
    >
        <div
            v-if="showAccessBanner"
            class="flex flex-col gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between"
        >
            <div class="flex items-start gap-2">
                <Medal
                    class="mt-0.5 size-5 shrink-0 text-amber-600"
                    aria-hidden="true"
                />
                <span>
                    Rejoignez le réseau pour publier et répondre aux remplacements —
                    <strong>accès à vie 9,90 €</strong>
                </span>
            </div>
            <NuxtLink
                to="/acces-plan"
                class="inline-flex shrink-0 items-center justify-center rounded-md bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-700"
                @click="onAccessClick"
            >
                Découvrir
            </NuxtLink>
        </div>

        <div
            v-else-if="showCandidateBanner"
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
                to="/dashboard/replacements"
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
                :to="partnerCtaPath"
                class="inline-flex shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-sm font-semibold text-white"
                :class="partnerIsNursAssur ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'"
                @click="onPartnerBannerClick"
            >
                En savoir plus
                <ArrowRight class="size-4" />
            </NuxtLink>
        </div>
    </div>
</template>
