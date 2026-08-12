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
                                Infiswap Premium
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

                <ul class="flex flex-wrap gap-x-4 gap-y-2">
                    <li
                        v-for="benefit in proBenefits"
                        :key="benefit.title"
                        class="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
                    >
                        <component
                            :is="benefit.icon"
                            class="size-4 shrink-0 text-success"
                        />
                        <span class="font-medium text-foreground">{{ benefit.title }}</span>
                    </li>
                </ul>
            </div>

            <div
                v-else
                class="space-y-8"
            >
                <div class="space-y-2 text-center">
                    <div class="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        <Crown class="size-3.5" />
                        {{ badge }}
                    </div>
                    <h1 class="text-3xl font-semibold sm:text-4xl">
                        {{ title }}
                    </h1>
                    <p class="mx-auto max-w-xl text-muted-foreground">
                        {{ subtitle }}
                    </p>
                </div>

                <section
                    class="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 sm:p-5 dark:border-amber-500/30 dark:bg-amber-500/5"
                    aria-label="Avantages Premium"
                >
                    <p class="text-center text-sm font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                        Ce que change Premium vs gratuit
                    </p>
                    <ul class="mt-4 grid gap-3 sm:grid-cols-3">
                        <li
                            v-for="row in benefitContrasts"
                            :key="row.title"
                            class="rounded-lg border border-amber-200/60 bg-white/90 p-3.5 dark:border-amber-500/20 dark:bg-background/70"
                        >
                            <div class="flex items-center gap-2">
                                <component
                                    :is="row.icon"
                                    class="size-5 shrink-0 text-amber-600 dark:text-amber-400"
                                    aria-hidden="true"
                                />
                                <p class="font-semibold text-foreground">
                                    {{ row.title }}
                                </p>
                            </div>
                            <p class="mt-2 text-sm leading-snug text-foreground">
                                {{ row.premium }}
                            </p>
                            <p class="mt-1.5 text-xs text-muted-foreground line-through decoration-muted-foreground/50">
                                Gratuit : {{ row.free }}
                            </p>
                        </li>
                    </ul>
                </section>

                <div
                    v-if="catalogLoading"
                    class="grid gap-4 md:grid-cols-2"
                    aria-busy="true"
                    aria-label="Chargement des formules"
                >
                    <div
                        v-for="n in 2"
                        :key="n"
                        class="h-64 animate-pulse rounded-xl border bg-muted/40 dark:border-gray-700"
                    />
                </div>

                <div
                    v-else-if="plans.length > 0"
                    class="grid gap-4 md:grid-cols-2"
                >
                    <SubscriptionProPlanCard
                        v-for="plan in plans"
                        :key="plan.lookup_key"
                        :plan="plan"
                        :benefits="proBenefits"
                        :highlighted="plan.interval === 'year'"
                        :loading="loading"
                        @subscribe="subscribe(plan)"
                    />
                </div>

                <div
                    v-else
                    class="rounded-xl border border-dashed p-6 text-center dark:border-gray-700"
                >
                    <p class="text-sm text-muted-foreground">
                        Les formules Premium sont temporairement indisponibles.
                    </p>
                    <Button
                        variant="outline"
                        class="mt-4 min-h-11"
                        :disabled="catalogLoading"
                        @click="retryCatalog"
                    >
                        Réessayer
                    </Button>
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
import { Crown, Sparkles } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import type { ProPlan } from '~/composables/useProSubscription';
import { buildProCelebrationDedupeKey } from '~/utils/purchaseCelebration';
import {
    buildLoginRedirectWithStripeReturn,
    extractStripeSessionId,
    isStripeCheckoutSessionId,
    parseStripeProductReturn,
    stripStripeReturnQuery,
} from '~/utils/accessReturn';

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

useHead({
    title: 'Infiswap Premium',
});

const { badge, title, subtitle, benefits: proBenefits } = usePremiumMarketing();

/** Contraste vendeur Gratuit vs Premium (page abonnement uniquement). */
const benefitContrasts = computed(() => [
    {
        icon: proBenefits.value[0]?.icon,
        title: 'Alerte instantanée',
        premium: 'Prévenue dès la publication — vous répondez avant les autres.',
        free: 'un récap le soir seulement',
    },
    {
        icon: proBenefits.value[1]?.icon,
        title: 'Boost 7 jours offert / mois',
        premium: 'Votre annonce en tête de liste, chaque mois, sans payer le boost à part.',
        free: 'boost payant (2 € ou 4,40 €)',
    },
    {
        icon: proBenefits.value[2]?.icon,
        title: 'Contrats illimités inclus',
        premium: 'Signature et archivage compris — plus de 3 € par contrat.',
        free: '3 € par contrat de remplacement',
    },
]);

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

const catalogLoading = ref(true);

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

async function loadCatalog(): Promise<void> {
    catalogLoading.value = true;
    try {
        await fetchCatalog();
    }
    finally {
        catalogLoading.value = false;
    }
}

async function retryCatalog(): Promise<void> {
    await loadCatalog();
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
    const query = route.query as Record<string, unknown>;
    const stripeReturn = parseStripeProductReturn(query);

    if (stripeReturn?.zone === 'pro' && stripeReturn.outcome === 'cancel') {
        await router.replace({ query: stripStripeReturnQuery(query) });
        $toast({ description: 'Paiement annulé. Aucun montant n\'a été débité.' });

        return;
    }

    if (route.query.pro !== 'success') {
        return;
    }

    const sessionId = extractStripeSessionId(query);

    if (!sessionId || !isStripeCheckoutSessionId(sessionId)) {
        await router.replace({ query: stripStripeReturnQuery(query) });

        return;
    }

    const outcome = await confirm(sessionId);

    await router.replace({ query: stripStripeReturnQuery(query) });

    if (outcome === 'active') {
        trackEvent('pro_checkout_success', { session_id: sessionId });
        triggerCelebration({
            variant: 'pro',
            dedupeKey: buildProCelebrationDedupeKey(sessionId),
        });

        return;
    }

    if (outcome === 'pending') {
        $toast({
            description: 'Paiement enregistré : votre abonnement s\'activera dans quelques instants.',
        });

        return;
    }

    if (outcome === 'auth_error') {
        await navigateTo(buildLoginRedirectWithStripeReturn('/dashboard/subscriptions', {
            pro: 'success',
            session_id: sessionId,
        }));

        return;
    }

    $toast({
        variant: 'destructive',
        description: 'Impossible de confirmer l\'abonnement. Contactez le support si le prélèvement apparaît.',
    });
}

onMounted(async () => {
    await Promise.all([fetchStatus(), loadCatalog()]);
    await processStripeReturn();
});
</script>
