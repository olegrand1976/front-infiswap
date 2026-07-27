<template>
    <div class="w-full min-w-0">
        <DashboardAdminPageHeader title="Suivi marketing & fréquentation" />

        <DashboardAdminPageContent class="overflow-hidden">
            <template v-if="canAccess">
                <div class="px-4 sm:px-5 py-4 space-y-5 min-w-0">
                    <!-- Toolbar période -->
                    <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Période d'analyse
                        </p>
                        <div
                            class="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5"
                            role="group"
                            aria-label="Période"
                        >
                            <button
                                v-for="option in MARKETING_ANALYTICS_PERIODS"
                                :key="option.value"
                                type="button"
                                class="rounded px-3 py-1.5 text-sm font-medium transition-colors"
                                :class="selectedPeriod === option.value
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-white'"
                                :aria-pressed="selectedPeriod === option.value"
                                @click="onPeriodChange(option.value)"
                            >
                                {{ option.shortLabel }}
                            </button>
                        </div>
                    </div>

                    <!-- Zone Scan -->
                    <section
                        class="space-y-4 min-w-0"
                        aria-label="Scan KPIs"
                    >
                        <MarketingAttendanceKpiCards
                            :attendance="overview?.attendance ?? null"
                            :loading="loading"
                        />

                        <MarketingStripeRevenueSummary
                            :kpis="overview?.revenue ?? null"
                            :loading="loading"
                        />

                        <MarketingFunnelPanel
                            :conversion="overview?.conversion ?? null"
                            :journey="overview?.journey_emails ?? null"
                            :partners="overview?.partners ?? null"
                            :acquisition="overview?.acquisition ?? null"
                            :period-days="overview?.period.days ?? 30"
                            :period="selectedPeriod"
                            :loading="loading"
                        />
                    </section>

                    <!-- Zone Tendances -->
                    <section
                        class="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0"
                        aria-label="Tendances"
                    >
                        <div class="min-w-0 rounded-md border border-gray-100 bg-white p-3 shadow-sm">
                            <h3 class="mb-2 font-semibold text-sm text-gray-800">
                                Connexions par jour
                            </h3>
                            <div
                                v-if="loading"
                                class="h-64 rounded-md bg-gray-100 animate-pulse"
                            />
                            <ClientOnly v-else-if="attendanceChartData.length > 0">
                                <LineChart
                                    :data="attendanceChartData"
                                    index="day"
                                    :categories="['logins', 'unique_users']"
                                    :colors="['var(--chart-1, #2563eb)', 'var(--chart-2, #16a34a)']"
                                    :legend-labels="['Connexions', 'Utilisateurs uniques']"
                                    class="w-full h-64 max-w-full"
                                />
                            </ClientOnly>
                            <p
                                v-else
                                class="text-sm text-gray-500 rounded-md border border-dashed p-4 h-64 flex items-center justify-center"
                            >
                                Aucune connexion enregistrée sur la période.
                            </p>
                        </div>

                        <div class="min-w-0 rounded-md border border-gray-100 bg-white p-3 shadow-sm">
                            <MarketingTopScreensChart
                                :screens="overview?.top_screens ?? []"
                                :loading="loading"
                            />
                        </div>
                    </section>

                    <!-- Zone Détail -->
                    <section
                        class="space-y-3 min-w-0"
                        aria-label="Détail"
                    >
                        <div class="rounded-md border border-gray-100 bg-white overflow-hidden shadow-sm">
                            <button
                                type="button"
                                class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                :aria-expanded="showUniqueUsers"
                                @click="showUniqueUsers = !showUniqueUsers"
                            >
                                <span class="font-semibold text-sm text-gray-800">Utilisateurs connectés</span>
                                <ChevronDown
                                    class="size-4 text-gray-400 transition-transform shrink-0"
                                    :class="showUniqueUsers ? 'rotate-180' : ''"
                                />
                            </button>
                            <div
                                v-if="showUniqueUsers"
                                class="border-t border-gray-100 p-4 min-w-0 overflow-x-auto"
                            >
                                <MarketingUniqueUsersPanel :period="selectedPeriod" />
                            </div>
                        </div>

                        <div
                            v-if="canManageUnverifiedEmails"
                            class="rounded-md border border-gray-100 bg-white overflow-hidden shadow-sm"
                        >
                            <button
                                type="button"
                                class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                :aria-expanded="showUnverified"
                                @click="showUnverified = !showUnverified"
                            >
                                <span class="font-semibold text-sm text-gray-800">Emails non vérifiés</span>
                                <ChevronDown
                                    class="size-4 text-gray-400 transition-transform shrink-0"
                                    :class="showUnverified ? 'rotate-180' : ''"
                                />
                            </button>
                            <div
                                v-if="showUnverified"
                                class="border-t border-gray-100 p-4 min-w-0 overflow-x-auto"
                            >
                                <MarketingUnverifiedEmailsPanel />
                            </div>
                        </div>
                    </section>
                </div>
            </template>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import MarketingAttendanceKpiCards from '@/components/admin/marketing-analytics/MarketingAttendanceKpiCards.vue';
import MarketingFunnelPanel from '@/components/admin/marketing-analytics/MarketingFunnelPanel.vue';
import MarketingStripeRevenueSummary from '@/components/admin/marketing-analytics/MarketingStripeRevenueSummary.vue';
import MarketingTopScreensChart from '@/components/admin/marketing-analytics/MarketingTopScreensChart.vue';
import MarketingUniqueUsersPanel from '@/components/admin/marketing-analytics/MarketingUniqueUsersPanel.vue';
import MarketingUnverifiedEmailsPanel from '@/components/admin/marketing-analytics/MarketingUnverifiedEmailsPanel.vue';
import { LineChart } from '@/components/ui/chart-line';
import {
    type MarketingAnalyticsOverview,
    type MarketingAnalyticsPeriod,
    useMarketingAnalytics,
} from '@/composables/useMarketingAnalytics';

useHead({ title: 'Suivi marketing' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const MARKETING_ANALYTICS_PERIODS = [
    { value: '7d' as const, label: '7 jours', shortLabel: '7 j' },
    { value: '30d' as const, label: '30 jours', shortLabel: '30 j' },
    { value: '90d' as const, label: '90 jours', shortLabel: '90 j' },
];

const { canAccessMarketingAnalytics } = useAuth();
const { getOverview } = useMarketingAnalytics();
const user = useUser();

const canAccess = canAccessMarketingAnalytics;
const canManageUnverifiedEmails = computed(() => user.value?.roles?.includes('administrator') ?? false);

const showUniqueUsers = ref(false);
const showUnverified = ref(false);

onMounted(() => {
    if (!canAccess.value) {
        void navigateTo('/dashboard/admin', { replace: true });
    }
});

const selectedPeriod = ref<MarketingAnalyticsPeriod>('30d');
const loading = ref(true);
const overview = ref<MarketingAnalyticsOverview | null>(null);

const attendanceChartData = computed(() =>
    (overview.value?.attendance.daily_series ?? []).map(row => ({
        day: row.day,
        logins: row.logins,
        unique_users: row.unique_users,
    })),
);

async function loadOverview() {
    if (!canAccess.value) {
        return;
    }

    loading.value = true;

    try {
        overview.value = await getOverview(selectedPeriod.value);
    }
    finally {
        loading.value = false;
    }
}

function onPeriodChange(value: MarketingAnalyticsPeriod) {
    if (selectedPeriod.value === value) {
        return;
    }

    selectedPeriod.value = value;
    void loadOverview();
}

await loadOverview();
</script>
