<script setup lang="ts">
import { Users, X } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
    hasPaidPlatformAccess,
    isSubjectToPlatformAccessPayment,
} from '~/utils/platformAccess';

const user = useUser();
const { trackEvent } = useProductAnalytics();
const { getKpiValue, fetchStats, loading: statsLoading } = usePlatformStats();

const dismissed = useState('onboarding-banner-dismissed', () => false);

const isRecentVerifiedUser = computed(() => {
    const verifiedAt = user.value?.email_verified_at;

    if (!verifiedAt) {
        return false;
    }

    const verifiedMs = new Date(verifiedAt).getTime();
    const daysSince = (Date.now() - verifiedMs) / (1000 * 60 * 60 * 24);

    return daysSince >= 0 && daysSince <= 14;
});

const showBanner = computed(() =>
    !dismissed.value
    && isRecentVerifiedUser.value
    && isSubjectToPlatformAccessPayment(user.value)
    && !hasPaidPlatformAccess(user.value),
);

const membersCount = computed(() => getKpiValue('members_total'));

onMounted(async () => {
    if (showBanner.value) {
        trackEvent('platform_access_impression', { source: 'onboarding_banner' });
    }

    await fetchStats();
});

function handlePrimaryClick() {
    trackEvent('onboarding_banner_click', { target: 'acces_plan' });
    trackEvent('platform_access_cta_click', { source: 'onboarding_banner', trigger: 'onboarding_banner' });
}

function handleDismiss() {
    dismissed.value = true;
}
</script>

<template>
    <section
        v-if="showBanner"
        class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-white to-success/10 p-5 shadow-sm"
    >
        <button
            type="button"
            class="absolute right-3 top-3 rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Fermer"
            @click="handleDismiss"
        >
            <X class="size-4" />
        </button>

        <div class="flex flex-col gap-4 pr-8 md:flex-row md:items-center md:justify-between">
            <div class="space-y-2">
                <p class="text-xs font-semibold uppercase tracking-wide text-primary">
                    Accès réseau — paiement unique, à vie
                </p>
                <h2 class="text-lg font-bold text-foreground md:text-xl">
                    Publiez et postulez — 9,90 € une fois
                </h2>
                <p class="max-w-2xl text-sm text-muted-foreground">
                    Dès que vous publiez ou candidatez, un accès unique débloque le réseau.
                    Sans abonnement.
                </p>
                <div class="flex items-center gap-2 text-sm font-medium text-primary">
                    <Users class="size-4 shrink-0" />
                    <span v-if="statsLoading">… membres inscrits</span>
                    <span v-else>{{ membersCount.toLocaleString('fr-BE') }}+ membres inscrits</span>
                </div>
            </div>

            <div class="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button
                    as-child
                    class="bg-success hover:bg-success/90"
                    @click="handlePrimaryClick"
                >
                    <NuxtLink to="/acces-plan">
                        Obtenir mon accès à vie
                    </NuxtLink>
                </Button>
                <Button
                    as-child
                    variant="outline"
                >
                    <NuxtLink to="/pricing">
                        Voir les tarifs
                    </NuxtLink>
                </Button>
            </div>
        </div>
    </section>
</template>
