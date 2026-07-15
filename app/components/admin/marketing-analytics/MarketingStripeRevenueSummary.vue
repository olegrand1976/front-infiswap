<template>
    <section class="px-4 pb-4">
        <h3 class="font-semibold text-sm text-gray-800 mb-3">
            Indicateurs paiements Stripe
        </h3>

        <div
            v-if="loading"
            class="h-24 rounded-md bg-gray-100 animate-pulse"
        />
        <div
            v-else
            class="bg-white rounded-md shadow-sm border border-gray-100 p-4 space-y-3"
        >
            <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                <div
                    v-for="metric in metrics"
                    :key="metric.label"
                    class="rounded-md border border-gray-100 p-3"
                >
                    <p class="text-xs text-gray-500">
                        {{ metric.label }}
                    </p>
                    <p class="text-base font-semibold text-gray-900 mt-1 break-words">
                        {{ metric.value }}
                    </p>
                </div>
            </div>

            <div
                v-if="productBreakdown.length > 0"
                class="flex flex-wrap items-center gap-2"
            >
                <span class="text-sm font-medium text-gray-700">Répartition :</span>
                <Badge
                    v-for="item in productBreakdown"
                    :key="item.product_type"
                    variant="secondary"
                    class="rounded-md"
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

const metrics = computed(() => {
    const data = props.kpis;

    const latestLabel = data?.latest_payment?.user?.full_name
        ? `${data.latest_payment.user.full_name} · ${formatStripePaymentAmount(data.latest_payment.amount_cents)}`
        : '—';

    const topPayerLabel = data?.top_payer?.user?.full_name
        ? `${data.top_payer.user.full_name} · ${formatStripePaymentAmount(data.top_payer.total_amount_cents)}`
        : '—';

    return [
        {
            label: 'Encaissements (période)',
            value: formatStripePaymentAmount(data?.total_amount_cents ?? 0),
        },
        {
            label: 'Paiements',
            value: String(data?.payment_count ?? 0),
        },
        {
            label: 'Ce mois',
            value: `${data?.payments_this_month?.count ?? 0} · ${formatStripePaymentAmount(data?.payments_this_month?.amount_cents ?? 0)}`,
        },
        {
            label: 'Dernier paiement',
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
