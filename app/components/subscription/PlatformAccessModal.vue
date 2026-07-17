<script setup lang="ts">
import { Users } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import type { PlatformAccessTrigger } from '~/composables/useSubscription';
import { platformAccessModalCopy } from '~/utils/platformAccessCopy';

const {
    platformAccessModalOpen,
    platformAccessRedirectTo,
    platformAccessTrigger,
    closePlatformAccessModal,
    redirectToAccesPlan,
    accessPlan,
    getAccessPlan,
    purchaseAccess,
    loading,
} = useSubscription();

const { getKpiValue, fetchStats, loading: statsLoading, stats } = usePlatformStats();
const { trackEvent } = useProductAnalytics();
const checkoutInProgress = ref(false);

onMounted(async () => {
    await Promise.all([
        getAccessPlan(),
        fetchStats(),
    ]);
});

watch(platformAccessModalOpen, (open) => {
    if (open) {
        trackEvent('platform_access_impression', {
            source: 'modal',
            trigger: platformAccessTrigger.value ?? 'direct',
        });
    }
});

const modalCopy = computed(() => platformAccessModalCopy(platformAccessTrigger.value));
const modalTitle = computed(() => modalCopy.value.title);
const modalLead = computed(() => modalCopy.value.lead);

const membersCount = computed(() => getKpiValue('members_total'));
const matchedReplacementsCount = computed(() =>
    Math.round(stats.value.matched_replacements_total),
);

const formattedMembersCount = computed(() =>
    membersCount.value.toLocaleString('fr-BE'),
);

const formattedMatchedCount = computed(() =>
    matchedReplacementsCount.value.toLocaleString('fr-BE'),
);

const formattedPrice = computed(() => {
    const amount = accessPlan.value?.amount;
    if (amount === undefined || amount === null || amount === '') {
        return '9,90';
    }

    const num = Number(amount);

    if (Number.isNaN(num)) {
        return String(amount);
    }

    return num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
});

const currencySymbol = computed(() => {
    const currency = accessPlan.value?.currency ?? 'eur';

    return currency === 'gbp' ? '£' : '€';
});

async function handleObtainAccess() {
    const trigger: PlatformAccessTrigger = platformAccessTrigger.value ?? 'direct';
    const redirectTo = platformAccessRedirectTo.value ?? undefined;

    trackEvent('platform_access_cta_click', { source: 'modal', trigger });

    if (!accessPlan.value) {
        await getAccessPlan();
    }

    const priceId = accessPlan.value?.stripe_price_id;

    if (!priceId || accessPlan.value?.interval !== 'one_time') {
        closePlatformAccessModal();
        await redirectToAccesPlan(redirectTo, { trigger, checkout: true });
        return;
    }

    checkoutInProgress.value = true;

    try {
        const response = await purchaseAccess(priceId, {
            redirectTo,
            trigger,
            source: 'modal',
        });

        if (response?.url) {
            closePlatformAccessModal();
            window.location.href = response.url;
            return;
        }

        closePlatformAccessModal();
        await redirectToAccesPlan(redirectTo, { trigger, checkout: true });
    }
    finally {
        checkoutInProgress.value = false;
    }
}
</script>

<template>
    <AlertDialog
        :open="platformAccessModalOpen"
        @update:open="(open) => { if (!open) closePlatformAccessModal(); }"
    >
        <AlertDialogContent class="max-w-lg">
            <AlertDialogHeader>
                <AlertDialogTitle>
                    {{ modalTitle }}
                </AlertDialogTitle>
                <AlertDialogDescription as="div" class="space-y-4 text-left text-sm text-muted-foreground">
                    <p class="text-sm text-foreground/80">
                        {{ modalLead }}
                    </p>

                    <div class="rounded-xl border border-primary/20 bg-primary/5 px-4 py-4 text-center">
                        <p class="text-xs font-semibold uppercase tracking-wide text-primary">
                            {{ modalCopy.priceLabel }}
                        </p>
                        <p class="mt-1 text-3xl font-extrabold text-primary">
                            {{ formattedPrice }} {{ currencySymbol }}
                        </p>
                        <p class="mt-1 text-xs text-muted-foreground">
                            Publiez et postulez sans abonnement
                        </p>
                    </div>

                    <div class="rounded-xl border-2 border-success/30 bg-success/5 px-4 py-3">
                        <p class="text-sm leading-relaxed">
                            Contribution unique pour les nouvelles inscrites :
                            <strong class="text-foreground">{{ formattedPrice }} {{ currencySymbol }} une fois</strong>,
                            accès
                            <strong class="text-foreground">à vie</strong>
                            — aucun abonnement.
                        </p>
                    </div>

                    <div class="flex items-center gap-4 rounded-2xl border border-primary/15 bg-primary/5 p-4">
                        <div class="rounded-2xl bg-primary/10 p-3 text-primary">
                            <Users
                                class="size-6"
                                aria-hidden="true"
                            />
                        </div>
                        <div>
                            <p
                                v-if="statsLoading"
                                class="text-2xl font-extrabold text-primary"
                            >
                                …
                            </p>
                            <template v-else>
                                <p class="text-2xl font-extrabold text-primary">
                                    {{ formattedMembersCount }}+
                                </p>
                                <p class="text-sm font-medium text-foreground">
                                    Membres inscrits sur le réseau
                                </p>
                                <p
                                    v-if="matchedReplacementsCount > 0"
                                    class="text-xs text-muted-foreground"
                                >
                                    {{ formattedMatchedCount }}+ remplacements déjà réalisés
                                </p>
                                <p
                                    v-else
                                    class="text-xs text-muted-foreground"
                                >
                                    Infirmiers, aides-soignant(e)s et sages-femmes en Belgique et en France
                                </p>
                            </template>
                        </div>
                    </div>
                </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter class="flex-col gap-2 sm:flex-row">
                <AlertDialogCancel class="w-full sm:w-auto">
                    Plus tard
                </AlertDialogCancel>
                <Button
                    class="w-full sm:w-auto bg-success hover:bg-success/90"
                    :in-progress="loading || checkoutInProgress"
                    @click="handleObtainAccess"
                >
                    Accès à vie — {{ formattedPrice }} {{ currencySymbol }}
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
