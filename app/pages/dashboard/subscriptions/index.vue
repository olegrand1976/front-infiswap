<template>
    <div class="relative min-h-96 px-4 py-6 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl space-y-8">
            <SubscriptionProOfferBanner
                v-if="offer"
                :offer="offer"
                :loading="loading"
                @subscribe="subscribeToOffer"
            />

            <div
                v-if="isPremium"
                class="space-y-6"
            >
                <div class="rounded-xl border border-amber-300 bg-amber-50/60 p-6 dark:border-amber-500/40 dark:bg-amber-500/5">
                    <div class="flex flex-wrap items-start justify-between gap-4">
                        <div class="space-y-1">
                            <div class="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                                <Crown class="size-3.5" />
                                Infiswap Pro
                            </div>
                            <h1 class="text-2xl font-semibold">
                                {{ currentPlan?.name ?? 'Abonnement actif' }}
                            </h1>
                            <p class="text-sm text-muted-foreground">
                                {{ subscriptionSummary }}
                            </p>
                        </div>

                        <div class="flex flex-col gap-2 w-full sm:w-auto">
                            <Button
                                class="min-h-11 w-full sm:w-auto"
                                :disabled="loading"
                                @click="openBillingPortal"
                            >
                                Gérer mon abonnement
                            </Button>
                            <Button
                                v-if="onGracePeriod"
                                variant="outline"
                                class="min-h-11 w-full sm:w-auto"
                                :disabled="loading"
                                @click="resume"
                            >
                                Réactiver
                            </Button>
                            <Button
                                v-else
                                variant="ghost"
                                class="min-h-11 w-full text-muted-foreground sm:w-auto"
                                :disabled="loading"
                                @click="cancel"
                            >
                                Résilier
                            </Button>
                        </div>
                    </div>

                    <div
                        v-if="boostCredit"
                        class="mt-6 flex flex-wrap items-center gap-2 rounded-lg bg-white/70 px-4 py-3 text-sm dark:bg-white/5"
                    >
                        <Sparkles class="size-4 text-amber-500" />
                        <span v-if="boostCredit.available">
                            Votre boost de {{ boostCredit.duration_days }} jours est disponible ce mois-ci.
                        </span>
                        <span v-else>
                            Boost du mois déjà utilisé. Prochain crédit le {{ formatDate(boostCredit.next_credit_at) }}.
                        </span>
                    </div>
                </div>

                <ul class="grid gap-3 sm:grid-cols-3">
                    <li
                        v-for="benefit in PRO_BENEFITS"
                        :key="benefit.title"
                        class="rounded-lg border p-4 dark:border-gray-700"
                    >
                        <component
                            :is="benefit.icon"
                            class="size-5 text-success"
                        />
                        <p class="mt-2 font-medium">
                            {{ benefit.title }}
                        </p>
                        <p class="mt-1 text-sm text-muted-foreground">
                            {{ benefit.description }}
                        </p>
                    </li>
                </ul>
            </div>

            <div
                v-else
                class="space-y-8"
            >
                <div class="space-y-3 text-center">
                    <h1 class="text-3xl font-semibold sm:text-4xl">
                        Le réseau reste gratuit
                    </h1>
                    <p class="mx-auto max-w-xl text-muted-foreground">
                        Publier, postuler et échanger ne coûte rien, et ne coûtera jamais rien.
                        Infiswap Pro ajoute trois avantages à celles qui veulent aller plus vite.
                    </p>
                </div>

                <ul class="grid gap-3 sm:grid-cols-3">
                    <li
                        v-for="benefit in PRO_BENEFITS"
                        :key="benefit.title"
                        class="rounded-lg border p-4 dark:border-gray-700"
                    >
                        <component
                            :is="benefit.icon"
                            class="size-5 text-success"
                        />
                        <p class="mt-2 font-medium">
                            {{ benefit.title }}
                        </p>
                        <p class="mt-1 text-sm text-muted-foreground">
                            {{ benefit.description }}
                        </p>
                    </li>
                </ul>

                <div class="grid gap-4 md:grid-cols-2">
                    <SubscriptionProPlanCard
                        v-for="plan in plans"
                        :key="plan.lookup_key"
                        :plan="plan"
                        :highlighted="plan.interval === 'year'"
                        :loading="loading"
                        @subscribe="subscribe(plan)"
                    />
                </div>

                <p class="text-center text-xs text-muted-foreground">
                    Sans engagement de durée sur la formule mensuelle, annulable en un clic.
                    Prix TTC. Le boost offert non utilisé dans le mois n'est pas reporté.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BellRing, Crown, FileCheck, Sparkles } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import type { ProPlan } from '~/composables/useProSubscription';
import { buildProCelebrationDedupeKey } from '~/utils/purchaseCelebration';
import { extractStripeSessionId } from '~/utils/accessReturn';

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

useHead({
    title: 'Infiswap Pro',
});

const PRO_BENEFITS = [
    {
        icon: BellRing,
        title: 'Alerte instantanée',
        description: 'Prévenue dès la publication, quand les comptes gratuits reçoivent un récap le soir.',
    },
    {
        icon: Sparkles,
        title: 'Un boost offert par mois',
        description: '7 jours en tête de liste sur l\'annonce de votre choix, chaque mois.',
    },
    {
        icon: FileCheck,
        title: 'Contrats inclus',
        description: 'Contrats de remplacement illimités, signature et archivage compris.',
    },
];

const {
    status,
    catalog,
    loading,
    isPremium,
    boostCredit,
    fetchStatus,
    fetchCatalog,
    checkout,
    confirm,
    openBillingPortal,
    cancel,
    resume,
} = useProSubscription();

const { triggerCelebration } = usePurchaseCelebration();
const { trackEvent } = useProductAnalytics();
const { $toast } = useNuxtApp();
const route = useRoute();
const router = useRouter();

const plans = computed(() => catalog.value?.plans ?? []);
const offer = computed(() => catalog.value?.offer ?? null);
const currentPlan = computed(() => status.value?.subscription?.plan ?? null);
const onGracePeriod = computed(() => status.value?.subscription?.on_grace_period === true);

const subscriptionSummary = computed(() => {
    const subscription = status.value?.subscription;

    if (!subscription) {
        return '';
    }

    if (subscription.on_grace_period && subscription.ends_at) {
        return `Résilié — vous en gardez le bénéfice jusqu'au ${formatDate(subscription.ends_at)}.`;
    }

    return subscription.plan?.label
        ? `Formule ${subscription.plan.label}, reconduite automatiquement.`
        : 'Abonnement actif.';
});

function formatDate(value: string | null): string {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' });
}

async function subscribe(plan: ProPlan): Promise<void> {
    trackEvent('pro_checkout_start', { lookup_key: plan.lookup_key });

    const url = await checkout(plan.lookup_key);

    if (url) {
        window.location.href = url;
    }
}

async function subscribeToOffer(): Promise<void> {
    const current = offer.value;

    if (!current?.plan) {
        return;
    }

    trackEvent('pro_offer_checkout_start', { lookup_key: current.price_lookup_key });

    const url = await checkout(current.price_lookup_key, { offerToken: current.token });

    if (url) {
        window.location.href = url;
    }
}

/** Retour Stripe : on confirme avant toute célébration, jamais sur la seule query. */
async function processStripeReturn(): Promise<void> {
    if (route.query.pro !== 'success') {
        return;
    }

    const sessionId = extractStripeSessionId(route.query as Record<string, unknown>);

    if (!sessionId) {
        return;
    }

    const outcome = await confirm(sessionId);

    await router.replace({ query: {} });

    if (outcome === 'active') {
        trackEvent('pro_checkout_success', { session_id: sessionId });
        triggerCelebration({
            variant: 'pro',
            dedupeKey: buildProCelebrationDedupeKey(sessionId),
        });

        return;
    }

    $toast({
        description: 'Paiement enregistré : votre abonnement s\'activera dans quelques instants.',
    });
}

onMounted(async () => {
    await Promise.all([fetchStatus(), fetchCatalog()]);
    await processStripeReturn();
});
</script>
