<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Suivi marketing & fréquentation" />

        <DashboardAdminPageContent>
            <template v-if="canAccess">
                <!-- Toolbar période -->
                <div class="sticky top-0 z-10 px-4 pb-3 pt-1 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100 mb-3">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Période d'analyse
                        </p>
                        <div
                            class="inline-flex rounded-md border border-gray-200 bg-white p-0.5 shadow-sm"
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
                                    : 'text-gray-600 hover:bg-gray-50'"
                                :aria-pressed="selectedPeriod === option.value"
                                @click="onPeriodChange(option.value)"
                            >
                                {{ option.shortLabel }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Zone Scan -->
                <section aria-label="Scan KPIs">
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
                        :loading="loading"
                    />
                </section>

                <!-- Zone Tendances -->
                <section
                    class="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 pb-4"
                    aria-label="Tendances"
                >
                    <div class="bg-white rounded-md shadow-sm border border-gray-100 p-3">
                        <h3 class="mb-2 font-semibold text-sm text-gray-800">
                            Connexions par jour
                        </h3>
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
                                class="w-full h-72"
                            />
                        </ClientOnly>
                        <p
                            v-else
                            class="text-sm text-gray-500 rounded-md border border-dashed p-4 h-72 flex items-center justify-center"
                        >
                            Aucune connexion enregistrée sur la période.
                        </p>
                    </div>

                    <div class="bg-white rounded-md shadow-sm border border-gray-100 p-3">
                        <MarketingTopScreensChart
                            :screens="overview?.top_screens ?? []"
                            :loading="loading"
                        />
                    </div>
                </section>

                <!-- Zone Détail -->
                <section
                    class="px-4 pb-6 space-y-3"
                    aria-label="Détail"
                >
                    <div class="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
                        <button
                            type="button"
                            class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            :aria-expanded="showUniqueUsers"
                            @click="showUniqueUsers = !showUniqueUsers"
                        >
                            <span class="font-semibold text-sm text-gray-800">Utilisateurs connectés</span>
                            <ChevronDown
                                class="size-4 text-gray-400 transition-transform"
                                :class="showUniqueUsers ? 'rotate-180' : ''"
                            />
                        </button>
                        <div
                            v-if="showUniqueUsers"
                            class="border-t border-gray-100 pt-3"
                        >
                            <MarketingUniqueUsersPanel :period="selectedPeriod" />
                        </div>
                    </div>

                    <div
                        v-if="canManageUnverifiedEmails"
                        class="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <button
                            type="button"
                            class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            :aria-expanded="showUnverified"
                            @click="showUnverified = !showUnverified"
                        >
                            <span class="font-semibold text-sm text-gray-800">Emails non vérifiés</span>
                            <ChevronDown
                                class="size-4 text-gray-400 transition-transform"
                                :class="showUnverified ? 'rotate-180' : ''"
                            />
                        </button>
                        <div
                            v-if="showUnverified"
                            class="border-t border-gray-100 pt-3"
                        >
                            <MarketingUnverifiedEmailsPanel />
                        </div>
                    </div>
                </section>
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
