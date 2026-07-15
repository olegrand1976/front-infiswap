<template>
    <div class="px-4 pb-2 space-y-3">
        <DashboardStatCardAdminGroup
            title="Aujourd'hui"
            :items="todayItems"
            :loading="loading"
            parent-class=""
        />
        <DashboardStatCardAdminGroup
            title="Période"
            :items="periodItems"
            :loading="loading"
            parent-class=""
        />
    </div>
</template>

<script setup lang="ts">
import { Building2, LogIn, Stethoscope, Users } from 'lucide-vue-next';
import type { MarketingAttendance } from '@/composables/useMarketingAnalytics';

const props = defineProps<{
    attendance: MarketingAttendance | null;
    loading?: boolean;
}>();

const todayItems = computed(() => {
    const data = props.attendance;

    return [
        {
            value: data?.today.logins ?? 0,
            label: 'Connexions',
            colorClass: 'bg-emerald-700',
            icon: LogIn,
        },
        {
            value: data?.today.unique_users ?? 0,
            label: 'Utilisateurs uniques',
            colorClass: 'bg-blue-600',
            icon: Users,
        },
        {
            value: data?.today.by_account_type.nurse.unique_users ?? 0,
            label: 'Infirmières',
            colorClass: 'bg-violet-600',
            icon: Stethoscope,
        },
        {
            value: data?.today.by_account_type.institution.unique_users ?? 0,
            label: 'Institutions',
            colorClass: 'bg-amber-600',
            icon: Building2,
        },
    ];
});

const periodItems = computed(() => {
    const data = props.attendance;

    return [
        {
            value: data?.period.unique_users ?? 0,
            label: 'Utilisateurs uniques',
            colorClass: 'bg-slate-600',
            icon: Users,
        },
        {
            value: data?.period.logins ?? 0,
            label: 'Connexions',
            colorClass: 'bg-slate-500',
            icon: LogIn,
        },
    ];
});
</script>
