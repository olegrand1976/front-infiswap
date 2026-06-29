<template>
    <DashboardStatCardAdminGroup
        title="Indicateurs d'activité"
        :items="items"
        :loading="loading"
        parent-class="px-4 pb-2"
    />
</template>

<script setup lang="ts">
import { CalendarDays, CalendarRange, PhoneOff, ShieldCheck, ShoppingBag, TrendingUp, Users } from 'lucide-vue-next';
import type { CrmActivityKpis } from '@/composables/useCrm';

const props = defineProps<{
    kpis: CrmActivityKpis | null;
    scope: 'users' | 'institutions';
    loading?: boolean;
}>();

const items = computed(() => {
    const data = props.kpis;
    if (props.scope === 'institutions') {
        return [
            {
                value: data?.total ?? 0,
                label: 'Institutions (filtre actif)',
                colorClass: 'bg-blue-600',
                icon: Users,
            },
            {
                value: data?.registered_this_month ?? 0,
                label: 'Inscriptions ce mois',
                colorClass: 'bg-emerald-600',
                icon: CalendarDays,
            },
            {
                value: data?.registered_previous_month ?? 0,
                label: 'Inscriptions mois précédent',
                colorClass: 'bg-slate-500',
                icon: CalendarRange,
            },
            {
                value: data?.with_active_subscription ?? 0,
                label: 'Abonnement actif',
                colorClass: 'bg-indigo-600',
                icon: TrendingUp,
            },
            {
                value: data?.with_signed_bc ?? 0,
                label: 'BC signés',
                colorClass: 'bg-violet-600',
                icon: ShieldCheck,
            },
            {
                value: data?.without_contact_30_days ?? 0,
                label: 'Sans contact 30 j+',
                colorClass: 'bg-amber-500',
                icon: PhoneOff,
            },
        ];
    }

    return [
        {
            value: data?.total ?? 0,
            label: 'Contacts (filtre actif)',
            colorClass: 'bg-blue-600',
            icon: Users,
        },
        {
            value: data?.registered_this_month ?? 0,
            label: 'Inscriptions ce mois',
            colorClass: 'bg-emerald-600',
            icon: CalendarDays,
        },
        {
            value: data?.registered_previous_month ?? 0,
            label: 'Inscriptions mois précédent',
            colorClass: 'bg-slate-500',
            icon: CalendarRange,
        },
        {
            value: data?.with_insurance ?? 0,
            label: 'Avec Nursassur',
            colorClass: 'bg-indigo-600',
            icon: ShieldCheck,
        },
        {
            value: data?.total_sales ?? 0,
            label: 'Ventes cumulées',
            colorClass: 'bg-violet-600',
            icon: ShoppingBag,
        },
        {
            value: data?.without_contact_30_days ?? 0,
            label: 'Sans contact 30 j+',
            colorClass: 'bg-amber-500',
            icon: PhoneOff,
        },
    ];
});
</script>
