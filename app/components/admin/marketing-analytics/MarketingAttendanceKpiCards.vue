<template>
    <div class="space-y-4">
        <div>
            <h3 class="mb-2 text-sm font-semibold text-gray-800">
                Aujourd'hui
            </h3>
            <div
                v-if="loading"
                class="grid grid-cols-2 lg:grid-cols-4 gap-3"
            >
                <div
                    v-for="i in 4"
                    :key="i"
                    class="h-20 rounded-md bg-gray-100 animate-pulse"
                />
            </div>
            <div
                v-else
                class="grid grid-cols-2 lg:grid-cols-4 gap-3"
            >
                <div
                    v-for="item in todayItems"
                    :key="item.label"
                    class="flex items-center gap-3 rounded-md border border-gray-100 bg-white p-3 shadow-sm min-w-0"
                >
                    <div
                        class="shrink-0 rounded-md p-2 text-white"
                        :class="item.colorClass"
                    >
                        <component
                            :is="item.icon"
                            class="size-4"
                        />
                    </div>
                    <div class="min-w-0">
                        <p class="text-xl font-bold tabular-nums text-gray-900 leading-tight">
                            {{ item.value }}
                        </p>
                        <p class="text-xs text-gray-500 truncate">
                            {{ item.label }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <h3 class="mb-2 text-sm font-semibold text-gray-800">
                Période
            </h3>
            <div
                v-if="loading"
                class="grid grid-cols-2 gap-3"
            >
                <div
                    v-for="i in 2"
                    :key="i"
                    class="h-20 rounded-md bg-gray-100 animate-pulse"
                />
            </div>
            <div
                v-else
                class="grid grid-cols-2 gap-3"
            >
                <div
                    v-for="item in periodItems"
                    :key="item.label"
                    class="flex items-center gap-3 rounded-md border border-gray-100 bg-white p-3 shadow-sm min-w-0"
                >
                    <div
                        class="shrink-0 rounded-md p-2 text-white"
                        :class="item.colorClass"
                    >
                        <component
                            :is="item.icon"
                            class="size-4"
                        />
                    </div>
                    <div class="min-w-0">
                        <p class="text-xl font-bold tabular-nums text-gray-900 leading-tight">
                            {{ item.value }}
                        </p>
                        <p class="text-xs text-gray-500 truncate">
                            {{ item.label }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
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
