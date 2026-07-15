<template>
    <DashboardStatCardAdminGroup
        title="Fréquentation"
        :items="items"
        :loading="loading"
        parent-class="px-4 pb-2"
    />
</template>

<script setup lang="ts">
import { Building2, LogIn, Stethoscope, Users } from 'lucide-vue-next';
import type { MarketingAttendance } from '@/composables/useMarketingAnalytics';

const props = defineProps<{
    attendance: MarketingAttendance | null;
    loading?: boolean;
}>();

const items = computed(() => {
    const data = props.attendance;

    return [
        {
            value: data?.today.logins ?? 0,
            label: 'Connexions aujourd\'hui',
            colorClass: 'bg-emerald-700',
            icon: LogIn,
        },
        {
            value: data?.today.unique_users ?? 0,
            label: 'Utilisateurs uniques (jour)',
            colorClass: 'bg-blue-600',
            icon: Users,
        },
        {
            value: data?.today.by_account_type.nurse.unique_users ?? 0,
            label: 'Infirmières connectées (jour)',
            colorClass: 'bg-violet-600',
            icon: Stethoscope,
        },
        {
            value: data?.today.by_account_type.institution.unique_users ?? 0,
            label: 'Institutions connectées (jour)',
            colorClass: 'bg-amber-600',
            icon: Building2,
        },
        {
            value: data?.period.unique_users ?? 0,
            label: `Utilisateurs uniques (${data?.period.logins ?? 0} connexions période)`,
            colorClass: 'bg-slate-600',
            icon: Users,
        },
    ];
});
</script>
