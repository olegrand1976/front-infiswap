<script setup lang="ts">
import { Medal } from 'lucide-vue-next';
import { hasPaidPlatformAccess, isSubjectToPlatformAccessPayment } from '~/utils/platformAccess';

const user = useState<{ id?: number; created_at?: string | null; platform_access_paid_at?: string | null; roles?: string[]; account_type?: string | null } | null>('user');
const { notifications, getAll } = useNotifications();
const { showWidget: showNetworkJourneyWidget } = useNetworkJourney();
const { trackEvent } = useProductAnalytics();

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

onMounted(async () => {
    try {
        await getAll(1, 25, { unread_only: true });
    }
    catch {
        // ignore — banner is optional
    }

    if (showAccessBanner.value) {
        trackEvent('platform_access_impression', { source: 'banner' });
    }
});

function onAccessClick() {
    trackEvent('platform_access_cta_click', { source: 'banner' });
}
</script>

<template>
    <div
        v-if="showAccessBanner || showCandidateBanner"
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
                class="shrink-0 font-semibold underline"
                @click="onAccessClick"
            >
                Activer maintenant
            </NuxtLink>
        </div>

        <div
            v-if="showCandidateBanner"
            class="rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 text-sm text-sky-900"
        >
            {{ pendingResponseCount }} candidature(s) en attente de votre réponse.
            <NuxtLink
                to="/dashboard/replacements/responses"
                class="ml-2 font-semibold underline"
            >
                Traiter maintenant
            </NuxtLink>
        </div>
    </div>
</template>
