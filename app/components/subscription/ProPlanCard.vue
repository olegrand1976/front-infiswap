<script setup lang="ts">
import { Button } from '@/components/ui/button';
import type { ProPlan } from '~/composables/useProSubscription';

const props = withDefaults(
    defineProps<{
        plan: ProPlan;
        highlighted?: boolean;
        loading?: boolean;
    }>(),
    { highlighted: false, loading: false },
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

function formatEuro(amount: number): string {
    return new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(amount);
}
</script>

<template>
    <div
        class="flex h-full flex-col rounded-xl border p-6 dark:border-gray-700"
        :class="highlighted ? 'border-primary ring-1 ring-primary/30' : ''"
    >
        <div class="flex items-start justify-between gap-3">
            <h2 class="text-lg font-semibold">
                {{ plan.name }}
            </h2>
            <span
                v-if="savingLabel"
                class="rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success"
            >
                {{ savingLabel }}
            </span>
        </div>

        <div class="mt-4 flex items-baseline gap-1">
            <span class="text-4xl font-bold">{{ priceLabel }}</span>
            <span class="text-sm text-muted-foreground">{{ periodLabel }}</span>
        </div>

        <p
            v-if="monthlyEquivalentLabel"
            class="mt-1 text-sm text-muted-foreground"
        >
            {{ monthlyEquivalentLabel }}
        </p>

        <p
            v-if="plan.description"
            class="mt-4 text-sm text-muted-foreground"
        >
            {{ plan.description }}
        </p>

        <Button
            class="mt-6 min-h-11 w-full font-semibold"
            :variant="highlighted ? 'default' : 'outline'"
            :disabled="loading"
            @click="$emit('subscribe')"
        >
            Choisir cette formule
        </Button>
    </div>
</template>
