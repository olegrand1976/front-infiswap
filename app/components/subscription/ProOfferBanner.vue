<script setup lang="ts">
import { Crown } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import type { ProOffer } from '~/composables/useProSubscription';

const props = withDefaults(
    defineProps<{
        offer: ProOffer;
        loading?: boolean;
        compact?: boolean;
    }>(),
    { loading: false, compact: false },
);

defineEmits<{ subscribe: [] }>();

const priceLabel = computed(() =>
    props.offer.plan
        ? new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(props.offer.plan.amount)
        : null,
);

const durationLabel = computed(() => props.offer.plan?.label ?? null);

const monthlyEquivalentLabel = computed(() => {
    const monthly = props.offer.plan?.monthly_equivalent;

    if (!monthly) {
        return null;
    }

    return `${new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(monthly)} par mois`;
});

const expiryLabel = computed(() =>
    new Date(props.offer.expires_at).toLocaleString('fr-BE', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    }),
);
</script>

<template>
    <section
        class="rounded-xl border border-amber-300 bg-amber-50 p-4 sm:p-6 dark:border-amber-500/40 dark:bg-amber-500/10"
        aria-labelledby="pro-offer-title"
    >
        <div class="inline-flex items-center gap-2 rounded-full bg-amber-400/25 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
            <Crown class="size-3.5" />
            Offre réservée
        </div>

        <h2
            id="pro-offer-title"
            class="mt-3 text-xl font-semibold sm:text-2xl"
        >
            Infiswap Pro {{ durationLabel }} à {{ priceLabel }}
        </h2>

        <p class="mt-1 text-sm text-muted-foreground">
            <span v-if="monthlyEquivalentLabel">{{ monthlyEquivalentLabel }}, payés en une fois. </span>
            Offre nominative valable jusqu'au {{ expiryLabel }}.
        </p>

        <Button
            class="mt-4 min-h-12 w-full text-base font-semibold sm:w-auto sm:min-w-64"
            :disabled="loading"
            @click="$emit('subscribe')"
        >
            Activer mon abonnement
        </Button>

        <p
            v-if="!compact"
            class="mt-3 text-xs text-muted-foreground"
        >
            Paiement sécurisé par Stripe. Rétractation possible dans les 14 jours.
        </p>
    </section>
</template>
