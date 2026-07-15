<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Suivi marketing & fréquentation" />

        <DashboardAdminPageContent>
            <template v-if="canAccess">
                <div class="px-4 pb-4 flex flex-wrap gap-3 items-center">
                    <Select
                        :model-value="selectedPeriod"
                        @update:model-value="onPeriodChange"
                    >
                        <SelectTrigger class="max-w-xs rounded-md">
                            <span>{{ periodLabel }}</span>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="option in MARKETING_ANALYTICS_PERIODS"
                                :key="option.value"
                                :value="option.value"
                            >
                                {{ option.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <MarketingAttendanceKpiCards
                    :attendance="overview?.attendance ?? null"
                    :loading="loading"
                />

                <MarketingUniqueUsersPanel :period="selectedPeriod" />

                <MarketingUnverifiedEmailsPanel v-if="canManageUnverifiedEmails" />

                <DashboardStatCardAdminGroup
                    title="Acquisition"
                    :items="acquisitionItems"
                    :loading="loading"
                    parent-class="px-4 pb-2"
                />

                <div class="px-4 pb-4">
                    <p class="mb-2 font-semibold text-sm text-gray-800">
                        Connexions par jour
                    </p>
                    <div
                        v-if="loading"
                        class="h-72 rounded-md bg-gray-100 animate-pulse"
                    />
                    <ClientOnly v-else-if="attendanceChartData.length > 0">
                        <LineChart
                            :data="attendanceChartData"
                            index="day"
                            :categories="['logins', 'unique_users']"
                            :colors="['var(--chart-1, #2563eb)', 'var(--chart-2, #16a34a)']"
                            :legend-labels="['Connexions', 'Utilisateurs uniques']"
                            class="w-full bg-white rounded-md shadow-sm border border-gray-100 p-2"
                        />
                    </ClientOnly>
                    <p
                        v-else
                        class="text-sm text-gray-500 rounded-md border border-dashed p-4"
                    >
                        Aucune connexion enregistrée sur la période.
                    </p>
                </div>

                <MarketingTopScreensChart
                    :screens="overview?.top_screens ?? []"
                    :loading="loading"
                />

                <MarketingFunnelPanel
                    :conversion="overview?.conversion ?? null"
                    :journey="overview?.journey_emails ?? null"
                    :partners="overview?.partners ?? null"
                    :loading="loading"
                />

                <MarketingStripeRevenueSummary
                    :kpis="overview?.revenue ?? null"
                    :loading="loading"
                />
            </template>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { UserPlus } from 'lucide-vue-next';
import MarketingAttendanceKpiCards from '@/components/admin/marketing-analytics/MarketingAttendanceKpiCards.vue';
import MarketingFunnelPanel from '@/components/admin/marketing-analytics/MarketingFunnelPanel.vue';
import MarketingStripeRevenueSummary from '@/components/admin/marketing-analytics/MarketingStripeRevenueSummary.vue';
import MarketingTopScreensChart from '@/components/admin/marketing-analytics/MarketingTopScreensChart.vue';
import MarketingUniqueUsersPanel from '@/components/admin/marketing-analytics/MarketingUniqueUsersPanel.vue';
import MarketingUnverifiedEmailsPanel from '@/components/admin/marketing-analytics/MarketingUnverifiedEmailsPanel.vue';
import { LineChart } from '@/components/ui/chart-line';
import {
    MARKETING_ANALYTICS_PERIODS,
    type MarketingAnalyticsOverview,
    type MarketingAnalyticsPeriod,
    useMarketingAnalytics,
} from '@/composables/useMarketingAnalytics';

useHead({ title: 'Suivi marketing' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { canAccessMarketingAnalytics } = useAuth();
const { getOverview } = useMarketingAnalytics();
const user = useUser();

const canAccess = canAccessMarketingAnalytics;
const canManageUnverifiedEmails = computed(() => user.value?.roles?.includes('administrator') ?? false);

onMounted(() => {
    if (!canAccess.value) {
        void navigateTo('/dashboard/admin', { replace: true });
    }
});

const selectedPeriod = ref<MarketingAnalyticsPeriod>('30d');
const loading = ref(true);
const overview = ref<MarketingAnalyticsOverview | null>(null);

const periodLabel = computed(() =>
    MARKETING_ANALYTICS_PERIODS.find(option => option.value === selectedPeriod.value)?.label ?? '30 jours',
);

const attendanceChartData = computed(() =>
    (overview.value?.attendance.daily_series ?? []).map(row => ({
        day: row.day,
        logins: row.logins,
        unique_users: row.unique_users,
    })),
);

const acquisitionItems = computed(() => {
    const acquisition = overview.value?.acquisition;

    return [
        {
            value: acquisition?.registrations ?? 0,
            label: 'Inscriptions',
            colorClass: 'bg-emerald-700',
            icon: UserPlus,
        },
        {
            value: acquisition?.email_verified ?? 0,
            label: 'Emails vérifiés',
            colorClass: 'bg-blue-600',
            icon: UserPlus,
        },
        {
            value: acquisition?.belgium ?? 0,
            label: 'Belgique',
            colorClass: 'bg-amber-600',
            icon: UserPlus,
        },
        {
            value: acquisition?.france ?? 0,
            label: 'France',
            colorClass: 'bg-indigo-600',
            icon: UserPlus,
        },
    ];
});

async function loadOverview() {
    if (!canAccess.value) {
        return;
    }

    loading.value = true;

    try {
        overview.value = await getOverview(selectedPeriod.value);
    } finally {
        loading.value = false;
    }
}

function onPeriodChange(value: unknown) {
    if (value !== '7d' && value !== '30d' && value !== '90d') {
        return;
    }

    selectedPeriod.value = value;
    void loadOverview();
}

await loadOverview();
</script>
