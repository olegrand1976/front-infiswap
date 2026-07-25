<template>
    <div class="space-y-4">
        <!-- Bandeau KPI scan -->
        <section
            aria-label="Synthèse"
            class="space-y-3"
        >
            <div
                v-if="loading"
                class="space-y-3"
            >
                <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    <Skeleton
                        v-for="i in 6"
                        :key="`kpi-a-${i}`"
                        class="h-20 rounded-md bg-gray-200"
                    />
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    <Skeleton
                        v-for="i in 8"
                        :key="`kpi-b-${i}`"
                        class="h-20 rounded-md bg-gray-200"
                    />
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Skeleton
                        v-for="i in 4"
                        :key="`kpi-c-${i}`"
                        class="h-20 rounded-md bg-gray-200"
                    />
                </div>
            </div>
            <template v-else>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div class="bg-white rounded-md border border-gray-100 shadow-sm p-3">
                        <p class="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Users BE</p>
                        <p class="text-2xl font-bold text-primary tabular-nums mt-0.5">{{ userBelgianCount }}</p>
                    </div>
                    <div class="bg-white rounded-md border border-gray-100 shadow-sm p-3">
                        <p class="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Users FR</p>
                        <p class="text-2xl font-bold text-success tabular-nums mt-0.5">{{ userFrenchCount }}</p>
                    </div>
                    <div class="bg-white rounded-md border border-gray-100 shadow-sm p-3">
                        <p class="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Users total</p>
                        <p class="text-2xl font-bold text-gray-800 tabular-nums mt-0.5">{{ userTotal }}</p>
                    </div>
                    <div class="bg-white rounded-md border border-gray-100 shadow-sm p-3">
                        <p class="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Users 30 j</p>
                        <p class="text-2xl font-bold text-orange-600 tabular-nums mt-0.5">{{ userLast30 }}</p>
                    </div>
                    <div class="bg-white rounded-md border border-gray-100 shadow-sm p-3">
                        <p class="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Rempl. acceptés 30 j</p>
                        <p class="text-2xl font-bold text-indigo-600 tabular-nums mt-0.5">{{ acceptedLast30 }}</p>
                    </div>
                    <div class="bg-white rounded-md border border-gray-100 shadow-sm p-3">
                        <p class="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Réponses 30 j</p>
                        <p class="text-2xl font-bold text-pink-600 tabular-nums mt-0.5">{{ responsesLast30 }}</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    <div
                        v-for="kpi in peakKpiCards"
                        :key="kpi.label"
                        class="bg-white rounded-md border border-gray-100 shadow-sm p-3"
                    >
                        <p class="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">{{ kpi.label }}</p>
                        <p
                            class="text-2xl font-bold tabular-nums mt-0.5"
                            :class="kpi.valueClass"
                        >
                            {{ kpi.value }}
                        </p>
                        <p
                            v-if="kpi.hint"
                            class="text-[11px] text-gray-400 mt-0.5 tabular-nums"
                        >
                            {{ kpi.hint }}
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div class="bg-white rounded-md border border-gray-100 shadow-sm p-3">
                        <p class="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Institutions</p>
                        <p class="text-xl font-bold text-gray-800 tabular-nums mt-0.5">{{ institutionStats.total }}</p>
                    </div>
                    <div class="bg-white rounded-md border border-gray-100 shadow-sm p-3">
                        <p class="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Inst. BE</p>
                        <p class="text-xl font-bold text-primary tabular-nums mt-0.5">{{ institutionStats.total_belgian }}</p>
                    </div>
                    <div class="bg-white rounded-md border border-gray-100 shadow-sm p-3">
                        <p class="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Inst. FR</p>
                        <p class="text-xl font-bold text-success tabular-nums mt-0.5">{{ institutionStats.total_french }}</p>
                    </div>
                    <div class="bg-white rounded-md border border-gray-100 shadow-sm p-3">
                        <p class="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Inst. 30 j</p>
                        <p class="text-xl font-bold text-orange-600 tabular-nums mt-0.5">{{ institutionStats.last_30_days }}</p>
                    </div>
                </div>
            </template>
        </section>

        <!-- Statistiques générales -->
        <div>
            <button
                type="button"
                class="w-full flex items-center justify-between px-5 py-3.5 bg-white rounded-md shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                :aria-expanded="showStats"
                @click="showStats = !showStats"
            >
                <span class="font-semibold text-sm text-gray-800">Statistiques détaillées</span>
                <ChevronDown
                    class="size-4 text-gray-400 transition-transform duration-200"
                    :class="showStats ? 'rotate-180' : ''"
                />
            </button>
            <div
                v-show="showStats"
                class="mt-3 space-y-4"
            >
                <DashboardStatCardAdminGroup
                    v-for="(report, index) in adminReports"
                    :key="index"
                    :title="report.title"
                    :items="report.items"
                    :loading="loading"
                />

                <div>
                    <p class="mb-2 font-semibold text-sm text-gray-800">
                        Nouvelles institutions / semaine
                    </p>
                    <div
                        v-if="loading"
                        class="h-72 rounded-md bg-gray-100 animate-pulse"
                    />
                    <div
                        v-else
                        class="bg-white rounded-md shadow-sm border border-gray-100 p-2"
                    >
                        <ClientOnly>
                            <BarChart
                                :data="institutionWeeklyChartData.data"
                                index="name"
                                :categories="['Inscrits']"
                                :x-formatter="xInstitutionWeekFormatter"
                                :y-formatter="yFormatter"
                                :show-all-x-ticks="showAllXTicks(institutionWeeklyChartData.data)"
                                :colors="['var(--chart-3, #8b5cf6)']"
                                :legend-labels="institutionWeeklyChartData.legendLabels"
                                class="w-full"
                            />
                        </ClientOnly>
                    </div>
                </div>
            </div>
        </div>

        <!-- Évolutions -->
        <div>
            <button
                type="button"
                class="w-full flex items-center justify-between px-5 py-3.5 bg-white rounded-md shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                :aria-expanded="showRegistrations"
                @click="showRegistrations = !showRegistrations"
            >
                <span class="font-semibold text-sm text-gray-800">Évolutions</span>
                <ChevronDown
                    class="size-4 text-gray-400 transition-transform duration-200"
                    :class="showRegistrations ? 'rotate-180' : ''"
                />
            </button>
            <div
                class="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4 transition-none"
                :class="showRegistrations
                    ? ''
                    : 'pointer-events-none fixed -left-[10000px] top-0 z-[-1] w-full max-w-6xl opacity-0'"
                :aria-hidden="!showRegistrations"
            >
                <template v-if="loading">
                    <div
                        v-for="i in 4"
                        :key="i"
                    >
                        <Skeleton class="h-72 rounded-md bg-gray-200" />
                    </div>
                </template>
                <template v-else-if="!preloadCharts">
                    <div
                        v-for="i in 4"
                        :key="`preload-${i}`"
                    >
                        <Skeleton class="h-72 rounded-md bg-gray-200" />
                    </div>
                </template>
                <template v-else>
                    <div>
                        <p class="mb-1 font-semibold text-sm text-gray-800">Inscriptions — semaine</p>
                        <div class="bg-white rounded-md shadow-sm border border-gray-100 p-2">
                            <ClientOnly>
                                <BarChart
                                    :data="registrationDailyChartData.data"
                                    index="name"
                                    :categories="['count']"
                                    :x-formatter="xRegistrationDayFormatter"
                                    :y-formatter="yFormatter"
                                    :show-all-x-ticks="false"
                                    :colors="['var(--chart-2)']"
                                    :legend-labels="registrationDailyChartData.legendLabels"
                                    class="w-full"
                                />
                            </ClientOnly>
                        </div>
                    </div>

                    <div>
                        <p class="mb-1 font-semibold text-sm text-gray-800">Remplacements — semaine</p>
                        <div class="bg-white rounded-md shadow-sm border border-gray-100 p-2">
                            <ClientOnly>
                                <BarChart
                                    :data="replacementDailyChartData.data"
                                    index="name"
                                    :categories="['count', 'accepted']"
                                    :x-formatter="xReplacementDayFormatter"
                                    :y-formatter="yFormatter"
                                    :show-all-x-ticks="false"
                                    :colors="['var(--primary)', 'var(--success)']"
                                    :legend-labels="replacementDailyChartData.legendLabels"
                                    class="w-full"
                                />
                            </ClientOnly>
                        </div>
                    </div>

                    <div>
                        <p class="mb-1 font-semibold text-sm text-gray-800">Inscriptions — mois</p>
                        <div class="bg-white rounded-md shadow-sm border border-gray-100 p-2">
                            <ClientOnly>
                                <BarChart
                                    :data="registrationMonthlyChartData.data"
                                    index="name"
                                    :categories="['count']"
                                    :x-formatter="xRegistrationMonthFormatter"
                                    :y-formatter="yFormatter"
                                    :show-all-x-ticks="false"
                                    :colors="['var(--chart-2)']"
                                    :legend-labels="registrationMonthlyChartData.legendLabels"
                                    class="w-full"
                                />
                            </ClientOnly>
                        </div>
                    </div>

                    <div>
                        <p class="mb-1 font-semibold text-sm text-gray-800">Remplacements — mois</p>
                        <div class="bg-white rounded-md shadow-sm border border-gray-100 p-2">
                            <ClientOnly>
                                <BarChart
                                    :data="replacementMonthlyChartData.data"
                                    index="name"
                                    :categories="['count', 'accepted']"
                                    :x-formatter="xReplacementMonthFormatter"
                                    :y-formatter="yFormatter"
                                    :show-all-x-ticks="false"
                                    :colors="['var(--primary)', 'var(--success)']"
                                    :legend-labels="replacementMonthlyChartData.legendLabels"
                                    class="w-full"
                                />
                            </ClientOnly>
                        </div>
                    </div>

                    <div>
                        <p class="mb-1 font-semibold text-sm text-gray-800">Inscriptions — année</p>
                        <div class="bg-white rounded-md shadow-sm border border-gray-100 p-2">
                            <ClientOnly>
                                <BarChart
                                    :data="registrationChartData.data"
                                    index="name"
                                    :categories="['count']"
                                    :x-formatter="xRegistrationWeekYearFormatter"
                                    :y-formatter="yFormatter"
                                    :show-all-x-ticks="false"
                                    :colors="['var(--chart-2)']"
                                    :legend-labels="registrationChartData.legendLabels"
                                    class="w-full"
                                />
                            </ClientOnly>
                        </div>
                    </div>

                    <div>
                        <p class="mb-1 font-semibold text-sm text-gray-800">Remplacements — année</p>
                        <div class="bg-white rounded-md shadow-sm border border-gray-100 p-2">
                            <ClientOnly>
                                <BarChart
                                    :data="replacementChartData.data"
                                    index="name"
                                    :categories="['count', 'accepted']"
                                    :x-formatter="xReplacementWeekYearFormatter"
                                    :y-formatter="yFormatter"
                                    :show-all-x-ticks="false"
                                    :colors="['var(--primary)', 'var(--success)']"
                                    :legend-labels="replacementChartData.legendLabels"
                                    class="w-full"
                                />
                            </ClientOnly>
                        </div>
                    </div>

                    <div
                        v-if="deletedUserChartData.data.length > 0"
                        class="lg:col-span-2"
                    >
                        <p class="mb-1 font-semibold text-sm text-gray-800">Utilisateurs perdus</p>
                        <div class="bg-white rounded-md shadow-sm border border-gray-100 p-2">
                            <ClientOnly>
                                <BarChart
                                    :data="deletedUserChartData.data"
                                    index="name"
                                    :categories="['count']"
                                    :x-formatter="xDeletedUsersFormatter"
                                    :y-formatter="yFormatter"
                                    :show-all-x-ticks="false"
                                    :colors="['var(--chart-2)']"
                                    :legend-labels="deletedUserChartData.legendLabels"
                                    class="w-full"
                                />
                            </ClientOnly>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- Géographie -->
        <div>
            <button
                type="button"
                class="w-full flex items-center justify-between px-5 py-3.5 bg-white rounded-md shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                :aria-expanded="showGeography"
                @click="showGeography = !showGeography"
            >
                <span class="font-semibold text-sm text-gray-800">Géographie</span>
                <ChevronDown
                    class="size-4 text-gray-400 transition-transform duration-200"
                    :class="showGeography ? 'rotate-180' : ''"
                />
            </button>
            <div
                v-if="showGeography"
                class="mt-3 space-y-4"
            >
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div
                        class="inline-flex rounded-md border border-gray-200 bg-white p-0.5 shadow-sm"
                        role="group"
                        aria-label="Pays"
                    >
                        <button
                            type="button"
                            class="rounded px-3 py-1.5 text-sm font-medium transition-colors"
                            :class="selectedCountry === 'be'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'"
                            :aria-pressed="selectedCountry === 'be'"
                            @click="selectedCountry = 'be'"
                        >
                            Belgique
                        </button>
                        <button
                            type="button"
                            class="rounded px-3 py-1.5 text-sm font-medium transition-colors"
                            :class="selectedCountry === 'fr'
                                ? 'bg-success text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'"
                            :aria-pressed="selectedCountry === 'fr'"
                            @click="selectedCountry = 'fr'"
                        >
                            France
                        </button>
                    </div>

                    <div
                        class="inline-flex rounded-md border border-gray-200 bg-white p-0.5 shadow-sm"
                        role="group"
                        aria-label="Vue géographique"
                    >
                        <button
                            type="button"
                            class="rounded px-3 py-1.5 text-sm font-medium transition-colors"
                            :class="geoView === 'province'
                                ? 'bg-gray-800 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'"
                            :aria-pressed="geoView === 'province'"
                            @click="geoView = 'province'"
                        >
                            Provinces
                        </button>
                        <button
                            type="button"
                            class="rounded px-3 py-1.5 text-sm font-medium transition-colors"
                            :class="geoView === 'zip'
                                ? 'bg-gray-800 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'"
                            :aria-pressed="geoView === 'zip'"
                            @click="geoView = 'zip'"
                        >
                            Codes postaux
                        </button>
                    </div>
                </div>

                <div
                    v-if="loading"
                    class="h-72 rounded-md bg-gray-100 animate-pulse"
                />
                <div
                    v-else
                    class="bg-white rounded-md shadow-sm border border-gray-100 p-4"
                >
                    <ClientOnly>
                        <LineChart
                            v-if="geoView === 'province'"
                            index="name"
                            :data="userByProvince"
                            :categories="['inscrits']"
                            :x-formatter="xProvinceFormatter"
                            :y-formatter="yFormatter"
                            :rounded-corners="4"
                            :colors="chartLineColors"
                            class="pb-8 w-full"
                            :legend-labels="{ inscrits: 'Inscrits' }"
                        />
                        <AreaChart
                            v-else
                            index="name"
                            :data="userByZipCode"
                            :show-all-x-ticks="false"
                            :categories="['inscrits']"
                            :x-formatter="xZipCodeFormatter"
                            :y-formatter="yFormatter"
                            :rounded-corners="4"
                            :colors="chartAreaColors"
                            class="pb-8 w-full"
                            :legend-labels="{ inscrits: 'Inscrits' }"
                        />
                    </ClientOnly>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ChevronDown, RefreshCw, Send, Users } from 'lucide-vue-next';
import { DashboardStatCardAdminGroup } from '#components';
import { BarChart } from '@/components/ui/chart-bar';
import { AreaChart } from '@/components/ui/chart-area';
import { LineChart } from '@/components/ui/chart-line';
import { Skeleton } from '@/components/ui/skeleton';
import { useReports } from '~/composables/useReports';

const { reports, loading: reportsLoading } = useReports();

const { isAdmin, isCommunityManager } = useAuth();
const loading = computed(() => reportsLoading.value || !reports.value);
const { mapWeeklyStatistics, mapDailyStatistics, createXFormatter, yFormatter } = useChart();

const showStats = ref(false);
const showRegistrations = ref(false);
const showGeography = ref(false);
const preloadCharts = ref(false);
const selectedCountry = ref<'be' | 'fr'>('be');
const geoView = ref<'province' | 'zip'>('province');

watch(() => reports.value, (data) => {
    if (!data || preloadCharts.value) {
        return;
    }

    nextTick(() => {
        const schedule = typeof requestIdleCallback !== 'undefined'
            ? (callback: () => void) => requestIdleCallback(callback, { timeout: 800 })
            : (callback: () => void) => setTimeout(callback, 50);

        schedule(() => {
            preloadCharts.value = true;
        });
    });
}, { immediate: true });

const currentYear = new Date().getFullYear();

function weeksForCurrentYear<T extends { year: number }>(weeks: T[] = []): T[] {
    return weeks.filter(item => item.year === currentYear);
}

function showAllXTicks(data: unknown[] = []) {
    return data.length > 0 && data.length <= 12;
}

const userBelgianCount = computed(() => reports.value.registration_statistics?.total_belgian);
const userFrenchCount = computed(() => reports.value.registration_statistics?.total_french);
const userTotal = computed(() => reports.value.registration_statistics?.total ?? 0);
const userLast30 = computed(() => reports.value.registration_statistics?.last_30_days ?? 0);
const acceptedLast30 = computed(() => reports.value.accepted_replacement_statistics?.last_30_days ?? 0);
const responsesLast30 = computed(() => reports.value.replacement_response_statistics?.last_30_days ?? 0);
const acceptedTotal = computed(() => reports.value.accepted_replacement_statistics?.total ?? 0);
const responsesTotal = computed(() => reports.value.replacement_response_statistics?.total ?? 0);

function formatPeakDay(peak?: { count?: number; date?: string | null }) {
    if (!peak?.date) return '—';
    const d = new Date(`${peak.date}T00:00:00`);
    if (Number.isNaN(d.getTime())) return peak.date;
    return d.toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatPeakWeek(peak?: { week?: number | null; year?: number | null }) {
    if (peak?.week == null || peak?.year == null) return '—';
    return `S${String(peak.week).padStart(2, '0')}/${peak.year}`;
}

const peakKpiCards = computed(() => {
    const peaks = reports.value?.peak_kpis ?? {};
    const reg = peaks.registrations ?? {};
    const repl = peaks.replacements ?? {};
    const accepted = peaks.accepted_replacements ?? {};

    return [
        {
            label: 'Max inscrits / j',
            value: reg.max_day?.count ?? 0,
            hint: formatPeakDay(reg.max_day),
            valueClass: 'text-primary',
        },
        {
            label: 'Max inscrits / sem.',
            value: reg.max_week?.count ?? 0,
            hint: formatPeakWeek(reg.max_week),
            valueClass: 'text-primary',
        },
        {
            label: 'Max rempl. créés / j',
            value: repl.max_day?.count ?? 0,
            hint: formatPeakDay(repl.max_day),
            valueClass: 'text-indigo-600',
        },
        {
            label: 'Max rempl. créés / sem.',
            value: repl.max_week?.count ?? 0,
            hint: formatPeakWeek(repl.max_week),
            valueClass: 'text-indigo-600',
        },
        {
            label: 'Max rempl. acceptés / j',
            value: accepted.max_day?.count ?? 0,
            hint: formatPeakDay(accepted.max_day),
            valueClass: 'text-success',
        },
        {
            label: 'Max rempl. acceptés / sem.',
            value: accepted.max_week?.count ?? 0,
            hint: formatPeakWeek(accepted.max_week),
            valueClass: 'text-success',
        },
        {
            label: 'Rempl. acceptés',
            value: acceptedTotal.value,
            hint: null,
            valueClass: 'text-indigo-600',
        },
        {
            label: 'Réponses postées',
            value: responsesTotal.value,
            hint: null,
            valueClass: 'text-pink-600',
        },
    ];
});

const userByProvince = computed(() => {
    const userByProvinces = reports.value?.registration_statistics?.group_by_province ?? [];

    const countryData = userByProvinces.find(item => item.country === (selectedCountry.value === 'be' ? 'Belgique' : 'France'))?.data ?? [];

    return countryData.map((item: { province: string; total: number }) => ({
        name: item.province,
        inscrits: item.total,
    }));
});

const userByZipCode = computed(() => {
    const userByZipCodes = reports.value?.registration_statistics?.group_by_zip_code ?? [];

    const countryData = userByZipCodes.find(item => item.country === (selectedCountry.value === 'be' ? 'Belgique' : 'France'))?.data ?? [];

    return countryData.map((item: { zip_code: string; total: number }) => ({
        name: item.zip_code,
        inscrits: item.total,
    }));
});

const chartLineColors = computed(() => {
    return [selectedCountry.value === 'be' ? 'var(--primary)' : 'var(--success)'];
});

const chartAreaColors = computed(() => {
    return [selectedCountry.value === 'be' ? 'var(--primary)' : 'var(--success)'];
});

const registrationDailyChartData = computed(() => {
    return mapDailyStatistics(reports.value?.registration_statistics?.week, '', ['Total']);
});

const registrationMonthlyChartData = computed(() => {
    return mapWeeklyStatistics(reports.value?.registration_statistics?.month, 'Semaine', ['Total']);
});

const registrationChartData = computed(() => {
    const weeks = weeksForCurrentYear(reports.value?.registration_statistics?.weeks_year);
    return mapWeeklyStatistics(weeks, 'Semaine', ['Total']);
});

const deletedUserChartData = computed(() => {
    const weeks = weeksForCurrentYear(reports.value?.registration_statistics?.total_deleted);
    return mapWeeklyStatistics(weeks, 'Semaine', ['Total']);
});

const replacementDailyChartData = computed(() => {
    return mapDailyStatistics(reports.value?.replacement_statistics?.week, '', ['Total', 'Acceptés'], ['accepted']);
});

const replacementMonthlyChartData = computed(() => {
    return mapWeeklyStatistics(reports.value?.replacement_statistics?.month, 'Semaine', ['Total', 'Acceptés'], ['accepted']);
});

const replacementChartData = computed(() => {
    const weeks = weeksForCurrentYear(reports.value?.replacement_statistics?.weeks_year);
    return mapWeeklyStatistics(weeks, 'Semaine', ['Total', 'Acceptés'], ['accepted']);
});

const xRegistrationDayFormatter = computed(() => createXFormatter(computed(() => registrationDailyChartData.value.data)));
const xRegistrationMonthFormatter = computed(() => createXFormatter(computed(() => registrationMonthlyChartData.value.data)));
const xRegistrationWeekYearFormatter = computed(() => createXFormatter(computed(() => registrationChartData.value.data)));
const xDeletedUsersFormatter = computed(() => createXFormatter(computed(() => deletedUserChartData.value.data)));
const xReplacementDayFormatter = computed(() => createXFormatter(computed(() => replacementDailyChartData.value.data)));
const xReplacementMonthFormatter = computed(() => createXFormatter(computed(() => replacementMonthlyChartData.value.data)));
const xReplacementWeekYearFormatter = computed(() => createXFormatter(computed(() => replacementChartData.value.data)));
const xZipCodeFormatter = computed(() => createXFormatter(computed(() => userByZipCode.value)));
const xProvinceFormatter = computed(() => createXFormatter(computed(() => userByProvince.value)));

const adminReports = computed(() => {
    if (!(isAdmin.value || isCommunityManager) || !reports.value) return [];

    return [
        {
            title: 'Utilisateur(s)',
            items: [
                {
                    value: reports.value.registration_statistics.today + reports.value.registration_statistics.yesterday,
                    label: `Ce jour `,
                    colorClass: 'bg-indigo-600',
                    icon: Users,
                    containerClass: 'string',
                },
                {
                    value: reports.value.registration_statistics.last_30_days,
                    label: 'Mois glissant',
                    colorClass: 'bg-orange-700',
                    icon: Users,
                    containerClass: 'string',
                },
                {
                    value: reports.value.registration_statistics.total,
                    label: 'Total ',
                    colorClass: 'bg-pink-600',
                    icon: Users,
                    containerClass: 'string',
                },
            ],
        },
        {
            title: 'Remplacement(s) acceptée(s)',
            items: [
                {
                    value: reports.value.accepted_replacement_statistics.today + reports.value.accepted_replacement_statistics.yesterday,
                    label: `Ce jour `,
                    colorClass: 'bg-indigo-600',
                    icon: RefreshCw,
                    containerClass: 'string',
                },
                {
                    value: reports.value.accepted_replacement_statistics.last_30_days,
                    label: 'Mois glissant',
                    colorClass: 'bg-orange-700',
                    icon: RefreshCw,
                    containerClass: 'string',
                },
                {
                    value: reports.value.accepted_replacement_statistics.total,
                    label: 'Total ',
                    colorClass: 'bg-pink-600',
                    icon: RefreshCw,
                    containerClass: 'string',
                },
            ],
        },
        {
            title: 'Réponse(s) remplacement(s)',
            items: [
                {
                    value: reports.value.replacement_response_statistics.today + reports.value.replacement_response_statistics.yesterday,
                    label: `Ce jour `,
                    colorClass: 'bg-indigo-600',
                    icon: Send,
                    containerClass: 'string',
                },
                {
                    value: reports.value.replacement_response_statistics.last_30_days,
                    label: 'Mois glissant',
                    colorClass: 'bg-orange-700',
                    icon: Send,
                    containerClass: 'string',
                },
                {
                    value: reports.value.replacement_response_statistics.total,
                    label: 'Total ',
                    colorClass: 'bg-pink-600',
                    icon: Send,
                    containerClass: 'string',
                },
            ],
        },
    ];
});
const institutionStats = computed(() => {
    const stats = reports.value?.institution_statistics;
    return stats ?? { total: 0, total_belgian: 0, total_french: 0, last_30_days: 0, weeks_year: [] };
});

const institutionWeeklyChartData = computed(() => {
    const raw = institutionStats.value.weeks_year ?? [];
    const data = raw.map((item: { name: number; count: number }) => ({
        name: item.name,
        Inscrits: item.count,
    }));

    return {
        data,
        legendLabels: { Inscrits: 'Institutions' },
    };
});

const xInstitutionWeekFormatter = computed(() =>
    createXFormatter(computed(() => institutionWeeklyChartData.value.data)),
);
</script>
