<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import type { ProPlan } from '~/composables/useProSubscription';
import type { PremiumBenefit } from '~/composables/usePremiumMarketing';

const props = withDefaults(
    defineProps<{
        plan: ProPlan;
        benefits?: PremiumBenefit[];
        highlighted?: boolean;
        loading?: boolean;
    }>(),
    { benefits: () => [], highlighted: false, loading: false },
);

defineEmits<{ subscribe: [] }>();

const priceLabel = computed(() => formatEuro(props.plan.amount));

const periodLabel = computed(() => {
    if (props.plan.interval === 'month') {
        return '/ mois';
    }

    return props.plan.interval_count > 1 ? `/ ${props.plan.interval_count} ans` : '/ an';
});

const monthlyEquivalentLabel = computed(() => {
    if (props.plan.interval === 'month' || !props.plan.monthly_equivalent) {
        return null;
    }

    return `soit ${formatEuro(props.plan.monthly_equivalent)} par mois`;
});

const savingLabel = computed(() => {
    const free = props.plan.free_months;

    if (!free) {
        return null;
    }

    return free === 1 ? '1 mois offert' : `${free} mois offerts`;
});

const ctaLabel = computed(() => {
    if (props.plan.interval === 'year' && props.plan.free_months) {
        return `Profiter de ${props.plan.free_months} mois offerts`;
    }

    return 'Passer en Premium';
});

function formatEuro(amount: number): string {
    return new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(amount);
}
</script>

<template>
    <div
        class="flex h-full flex-col rounded-xl border p-6 dark:border-gray-700"
        :class="highlighted ? 'border-primary bg-primary/[0.03] ring-1 ring-primary/30' : ''"
    >
        <div class="flex items-start justify-between gap-3">
            <h2 class="text-lg font-semibold">
                {{ plan.name }}
            </h2>
            <span
                v-if="savingLabel"
                class="shrink-0 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success"
            >
                {{ savingLabel }}
            </span>
        </div>

        <div class="mt-4 flex items-baseline gap-1">
            <span class="text-4xl font-bold tracking-tight">{{ priceLabel }}</span>
            <span class="text-sm text-muted-foreground">{{ periodLabel }}</span>
        </div>

        <p
            v-if="monthlyEquivalentLabel"
            class="mt-1 text-sm font-medium text-foreground"
        >
            {{ monthlyEquivalentLabel }}
        </p>

        <p
            v-if="plan.free_months && plan.billed_months && plan.covered_months"
            class="mt-1 text-sm text-success"
        >
            {{ plan.billed_months }} mois facturés au lieu de {{ plan.covered_months }} :
            {{ plan.free_months }} mois offerts.
        </p>

        <ul
            v-if="benefits.length"
            class="mt-5 space-y-2.5 border-t pt-5 dark:border-gray-700"
        >
            <li
                v-for="benefit in benefits"
                :key="benefit.title"
                class="flex gap-2.5 text-sm"
            >
                <Check
                    class="mt-0.5 size-4 shrink-0 text-success"
                    aria-hidden="true"
                />
                <span>
                    <span class="font-semibold text-foreground">{{ benefit.title }}</span>
                    <span class="text-muted-foreground"> — {{ benefit.description }}</span>
                </span>
            </li>
        </ul>

        <div class="mt-auto pt-6">
            <Button
                class="min-h-11 w-full font-semibold"
                :variant="highlighted ? 'default' : 'outline'"
                :disabled="loading"
                @click="$emit('subscribe')"
            >
                {{ ctaLabel }}
            </Button>
        </div>
    </div>
</template>
