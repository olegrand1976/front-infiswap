<template>
    <DashboardStatCardAdminGroup
        title="Indicateurs BC institution"
        :items="items"
        :loading="loading"
        parent-class="px-4 pb-2"
    />
</template>

<script setup lang="ts">
import { Banknote, CalendarDays, CalendarRange, FileCheck, FileClock, FilePen, FileText, TrendingUp } from 'lucide-vue-next';
import type { InstitutionSubscriptionKpis } from '@/composables/useInstitutionSubscription';

const props = defineProps<{
    kpis: InstitutionSubscriptionKpis | null;
    loading?: boolean;
}>();

const items = computed(() => {
    const data = props.kpis;

    return [
        {
            value: data?.total ?? 0,
            label: 'BC (filtre actif)',
            colorClass: 'bg-blue-600',
            icon: FileText,
        },
        {
            value: data?.created_this_month ?? 0,
            label: 'Créés ce mois',
            colorClass: 'bg-emerald-600',
            icon: CalendarDays,
        },
        {
            value: data?.created_previous_month ?? 0,
            label: 'Créés mois précédent',
            colorClass: 'bg-slate-500',
            icon: CalendarRange,
        },
        {
            value: data?.signed ?? 0,
            label: 'BC signés',
            colorClass: 'bg-violet-600',
            icon: FileCheck,
        },
        {
            value: data?.pending_signature ?? 0,
            label: 'En attente signature',
            colorClass: 'bg-amber-500',
            icon: FileClock,
        },
        {
            value: data?.active ?? 0,
            label: 'Abonnements actifs',
            colorClass: 'bg-indigo-600',
            icon: TrendingUp,
        },
        {
            value: data?.draft ?? 0,
            label: 'Brouillons',
            colorClass: 'bg-slate-600',
            icon: FilePen,
        },
        {
            value: Math.round(data?.total_received ?? 0),
            label: 'Encaissements (€)',
            colorClass: 'bg-emerald-700',
            icon: Banknote,
        },
    ];
});
</script>
