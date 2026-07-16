<template>
    <section class="min-w-0">
        <div
            v-if="loading"
            class="h-24 rounded-md bg-gray-100 animate-pulse"
        />
        <div
            v-else
            class="rounded-md border border-gray-100 bg-gray-50/60 p-4"
        >
            <div class="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <h3 class="font-semibold text-sm text-gray-800">
                    Revenus Stripe
                </h3>
                <p class="text-2xl font-bold text-emerald-700 tabular-nums">
                    {{ formatStripePaymentAmount(kpis?.total_amount_cents ?? 0) }}
                    <span class="text-xs font-medium text-gray-500 ml-1">période</span>
                </p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div
                    v-for="metric in secondaryMetrics"
                    :key="metric.label"
                    class="rounded-md border border-gray-100 px-2.5 py-2"
                >
                    <p class="text-[11px] text-gray-500">
                        {{ metric.label }}
                    </p>
                    <p class="text-sm font-semibold text-gray-900 mt-0.5 break-words">
                        {{ metric.value }}
                    </p>
                </div>
            </div>

            <div
                v-if="productBreakdown.length > 0"
                class="mt-3 flex flex-wrap items-center gap-1.5"
            >
                <span class="text-xs font-medium text-gray-500">Répartition</span>
                <Badge
                    v-for="item in productBreakdown"
                    :key="item.product_type"
                    variant="secondary"
                    class="rounded-md text-xs"
                >
                    {{ item.label }} {{ item.count }}
                </Badge>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import type { StripePaymentKpis } from '@/composables/useStripePaymentsAdmin';
import { formatStripePaymentAmount, stripePaymentProductLabel } from '@/composables/useStripePaymentsAdmin';

const props = defineProps<{
    kpis: StripePaymentKpis | null;
    loading?: boolean;
}>();

const secondaryMetrics = computed(() => {
    const data = props.kpis;

    const latestLabel = data?.latest_payment?.user?.full_name
        ? `${data.latest_payment.user.full_name} · ${formatStripePaymentAmount(data.latest_payment.amount_cents)}`
        : '—';

    const topPayerLabel = data?.top_payer?.user?.full_name
        ? `${data.top_payer.user.full_name} · ${formatStripePaymentAmount(data.top_payer.total_amount_cents)}`
        : '—';

    return [
        {
            label: 'Paiements',
            value: String(data?.payment_count ?? 0),
        },
        {
            label: 'Ce mois',
            value: `${data?.payments_this_month?.count ?? 0} · ${formatStripePaymentAmount(data?.payments_this_month?.amount_cents ?? 0)}`,
        },
        {
            label: 'Dernier',
            value: latestLabel,
        },
        {
            label: 'Top payeur',
            value: topPayerLabel,
        },
    ];
});

const productBreakdown = computed(() => {
    const items = props.kpis?.by_product_type ?? [];

    return items.map(item => ({
        product_type: item.product_type,
        label: stripePaymentProductLabel(item.product_type),
        count: item.count,
    }));
});
</script>
