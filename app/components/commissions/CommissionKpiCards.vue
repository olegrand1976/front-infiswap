<template>
    <DashboardStatCardAdminGroup
        title="Indicateurs commissions"
        :items="items"
        :loading="loading"
    />
</template>

<script setup lang="ts">
import { Banknote, CircleDollarSign, FileCheck, Percent, Users } from 'lucide-vue-next';
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
            value: Math.round(data?.commission_due ?? 0),
            label: 'Commissions dues (€)',
            colorClass: 'bg-amber-500',
            icon: CircleDollarSign,
        },
        {
            value: Math.round(data?.commission_paid ?? 0),
            label: 'Commissions versées (€)',
            colorClass: 'bg-indigo-600',
            icon: CircleDollarSign,
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
            colorClass: 'bg-violet-600',
            icon: Users,
        },
        {
            value: data?.payout_rate ?? 0,
            label: 'Taux de versement (%)',
            colorClass: 'bg-slate-600',
            icon: Percent,
        },
    ];
});
</script>
