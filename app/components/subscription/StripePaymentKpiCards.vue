<template>
    <DashboardStatCardAdminGroup
        title="Indicateurs paiements Stripe"
        :items="items"
        :loading="loading"
        parent-class="px-4 pb-2"
    />
</template>

<script setup lang="ts">
import { Banknote, CalendarDays, Crown, Layers, Receipt, TrendingUp } from 'lucide-vue-next';
import type { StripePaymentKpis } from '@/composables/useStripePaymentsAdmin';
import { formatStripePaymentAmount, stripePaymentProductLabel } from '@/composables/useStripePaymentsAdmin';

const props = defineProps<{
    kpis: StripePaymentKpis | null;
    loading?: boolean;
}>();

const items = computed(() => {
    const data = props.kpis;

    const latestLabel = data?.latest_payment?.user?.full_name
        ? `${data.latest_payment.user.full_name} · ${formatStripePaymentAmount(data.latest_payment.amount_cents)}`
        : '—';

    const topPayerLabel = data?.top_payer?.user?.full_name
        ? `${data.top_payer.user.full_name} · ${formatStripePaymentAmount(data.top_payer.total_amount_cents)}`
        : '—';

    const breakdownLabel = (data?.by_product_type ?? [])
        .map(item => `${stripePaymentProductLabel(item.product_type)}: ${item.count}`)
        .join(' · ') || '—';

    return [
        {
            value: formatStripePaymentAmount(data?.total_amount_cents ?? 0),
            label: 'Encaissements (filtre actif)',
            colorClass: 'bg-emerald-700',
            icon: Banknote,
        },
        {
            value: data?.payment_count ?? 0,
            label: 'Nombre de paiements',
            colorClass: 'bg-blue-600',
            icon: Receipt,
        },
        {
            value: `${data?.payments_this_month?.count ?? 0} · ${formatStripePaymentAmount(data?.payments_this_month?.amount_cents ?? 0)}`,
            label: 'Ce mois',
            colorClass: 'bg-indigo-600',
            icon: CalendarDays,
        },
        {
            value: latestLabel,
            label: 'Dernier paiement',
            colorClass: 'bg-violet-600',
            icon: TrendingUp,
        },
        {
            value: topPayerLabel,
            label: 'Top payeur',
            colorClass: 'bg-amber-600',
            icon: Crown,
        },
        {
            value: breakdownLabel,
            label: 'Répartition par produit',
            colorClass: 'bg-slate-600',
            icon: Layers,
        },
    ];
});
</script>
