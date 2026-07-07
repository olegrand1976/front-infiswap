<template>
    <DashboardStatCardAdminGroup
        title="Indicateurs commissions"
        :items="items"
        :loading="loading"
    />
</template>

<script setup lang="ts">
import { AlertTriangle, Banknote, CircleDollarSign, FileCheck, Scale, TrendingDown, Users } from 'lucide-vue-next';
import type { CommissionKpis } from '@/composables/useInstitutionCommissionTracking';

const props = defineProps<{
    kpis: CommissionKpis | null;
    loading?: boolean;
}>();

const items = computed(() => {
    const data = props.kpis;
    return [
        {
            value: Math.round(data?.total_received ?? 0),
            label: 'Encaissements clients (€)',
            colorClass: 'bg-emerald-600',
            icon: Banknote,
        },
        {
            value: Math.round(data?.commission_net ?? data?.commission_due ?? 0),
            label: 'Net acquise (€)',
            colorClass: 'bg-indigo-600',
            icon: CircleDollarSign,
        },
        {
            value: Math.round(data?.commission_paid ?? 0),
            label: 'Commissions versées (€)',
            colorClass: 'bg-violet-600',
            icon: CircleDollarSign,
        },
        {
            value: Math.round(data?.commission_reversed ?? 0),
            label: 'Reprises (€)',
            colorClass: 'bg-red-600',
            icon: TrendingDown,
        },
        {
            value: Math.round(data?.commission_at_risk ?? 0),
            label: 'À risque (€)',
            colorClass: 'bg-amber-500',
            icon: AlertTriangle,
        },
        {
            value: Math.round(data?.net_remuneration_impact ?? 0),
            label: 'Impact net rémunération (€)',
            colorClass: 'bg-slate-700',
            icon: Scale,
        },
        {
            value: data?.signed_contracts ?? 0,
            label: 'BC signés',
            colorClass: 'bg-blue-600',
            icon: FileCheck,
        },
        {
            value: data?.active_vendors ?? 0,
            label: 'Commerciaux actifs',
            colorClass: 'bg-slate-600',
            icon: Users,
        },
    ];
});
</script>
