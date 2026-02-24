<template>
    <div>
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-8">
            <div class="col-span-1 lg:col-span-2 mb-2 sm:mb-0">
                <div v-if="loading || !isDataFormatted">
                    <Skeleton class="mt-3 bg-gray-200 rounded-sm h-96" />
                </div>
                <div
                    v-else
                    class="mt-3 grid sm:grid-cols-2 gap-4 sm:gap-8 items-center"
                >
                    <div class="p-8 bg-white rounded-sm shadow-md flex justify-between items-center gap-2">
                        <div>
                            <h3 class="text-sm font-semibold">
                                Utilisateur en Belgique
                            </h3>
                            <p class="font-semibold text-primary text-3xl">
                                {{ userBelgianCount }}
                            </p>
                        </div>
                        <LayoutsAppImage
                            :src="'/icons/belgium.png'"
                            alt="Belgium flag"
                            class="w-8 sm:w-12"
                        />
                    </div>

                    <div class="p-8 bg-white rounded-sm shadow-md flex justify-between items-center gap-4">
                        <div>
                            <h3 class="text-sm font-semibold">
                                Utilisateur en France
                            </h3>
                            <p class="font-semibold text-success text-3xl">
                                {{ userFrenchCount }}
                            </p>
                        </div>
                        <LayoutsAppImage
                            :src="'/icons/fr.png'"
                            alt="France flag"
                            class="w-8 sm:w-12"
                        />
                    </div>
                </div>
            </div>

            <div>
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des inscriptions de cette semaine-ci
                </p>
                <div v-if="loading || !isDataFormatted || registrationDailyChartData.data.length === 0">
                    <div class="mt-3 bg-white rounded-sm shadow-md">
                        <Skeleton class="w-full h-[400px] bg-gray-200 rounded-sm" />
                    </div>
                </div>
                <div
                    v-else
                    class="mt-3 bg-white rounded-sm shadow-md"
                >
                    <ClientOnly>
                        <BarChart
                            :data="registrationDailyChartData.data"
                            index="name"
                            :categories="['count']"
                            :x-formatter="xRegistrationDayFormatter"
                            :y-formatter="yFormatter"
                            :show-all-x-ticks="true"
                            :colors="['var(--chart-1)']"
                            :legend-labels="registrationDailyChartData.legendLabels"
                            class="w-full"
                        />
                    </ClientOnly>
                </div>
            </div>

            <div>
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des remplacements de cette semaine-ci
                </p>
                <div v-if="loading || !isDataFormatted || replacementDailyChartData.data.length === 0">
                    <div class="mt-3 bg-white rounded-sm shadow-md">
                        <Skeleton class="w-full h-[400px] bg-gray-200 rounded-sm" />
                    </div>
                </div>
                <div
                    v-else
                    class="mt-3 bg-white rounded-sm shadow-md"
                >
                    <ClientOnly>
                        <BarChart
                            :data="replacementDailyChartData.data"
                            index="name"
                            :categories="['count', 'accepted']"
                            :x-formatter="xReplacementDayFormatter"
                            :y-formatter="yFormatter"
                            :show-all-x-ticks="true"
                            :colors="['var(--primary)', 'var(--success)']"
                            :legend-labels="replacementDailyChartData.legendLabels"
                            class="w-full"
                        />
                    </ClientOnly>
                </div>
            </div>

            <div>
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des inscriptions de ce mois-ci
                </p>
                <div v-if="loading || !isDataFormatted || registrationMonthlyChartData.data.length === 0">
                    <div class="mt-3 bg-white rounded-sm shadow-md">
                        <Skeleton class="w-full h-[400px] bg-gray-200 rounded-sm" />
                    </div>
                </div>
                <div
                    v-else
                    class="mt-3 bg-white rounded-sm shadow-md"
                >
                    <ClientOnly>
                        <BarChart
                            :data="registrationMonthlyChartData.data"
                            index="name"
                            :categories="['count']"
                            :x-formatter="xRegistrationMonthFormatter"
                            :y-formatter="yFormatter"
                            :show-all-x-ticks="true"
                            :colors="['var(--chart-1)']"
                            :legend-labels="registrationMonthlyChartData.legendLabels"
                            class="w-full"
                        />
                    </ClientOnly>
                </div>
            </div>

            <div>
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des remplacements de ce mois-ci
                </p>
                <div v-if="loading || !isDataFormatted || replacementMonthlyChartData.data.length === 0">
                    <div class="mt-3 bg-white rounded-sm shadow-md">
                        <Skeleton class="w-full h-[400px] bg-gray-200 rounded-sm" />
                    </div>
                </div>
                <div
                    v-else
                    class="mt-3 bg-white rounded-sm shadow-md"
                >
                    <ClientOnly>
                        <BarChart
                            :data="replacementMonthlyChartData.data"
                            index="name"
                            :categories="['count', 'accepted']"
                            :x-formatter="xReplacementMonthFormatter"
                            :y-formatter="yFormatter"
                            :show-all-x-ticks="true"
                            :colors="['var(--primary)', 'var(--success)']"
                            :legend-labels="replacementMonthlyChartData.legendLabels"
                            class="w-full"
                        />
                    </ClientOnly>
                </div>
            </div>

            <div>
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des inscriptions de l'année
                </p>
                <div v-if="loading || !isDataFormatted || registrationChartData.data.length === 0">
                    <div class="mt-3 bg-white rounded-sm shadow-md">
                        <Skeleton class="w-full h-[400px] bg-gray-200 rounded-sm" />
                    </div>
                </div>
                <div
                    v-else
                    class="mt-3 bg-white rounded-sm shadow-md"
                >
                    <ClientOnly>
                        <BarChart
                            :data="registrationChartData.data"
                            index="name"
                            :categories="['count']"
                            :x-formatter="xRegistrationWeekYearFormatter"
                            :y-formatter="yFormatter"
                            :show-all-x-ticks="true"
                            :colors="['var(--chart-1)']"
                            :legend-labels="registrationChartData.legendLabels"
                            class="w-full"
                        />
                    </ClientOnly>
                </div>
            </div>

            <div>
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des remplacements de l'année
                </p>
                <div v-if="loading || !isDataFormatted || replacementChartData.data.length === 0">
                    <div class="mt-3 bg-white rounded-sm shadow-md">
                        <Skeleton class="w-full h-[400px] bg-gray-200 rounded-sm" />
                    </div>
                </div>
                <div
                    v-else
                    class="mt-3 bg-white rounded-sm shadow-md"
                >
                    <ClientOnly>
                        <BarChart
                            :data="replacementChartData.data"
                            index="name"
                            :categories="['count', 'accepted']"
                            :x-formatter="xReplacementWeekYearFormatter"
                            :y-formatter="yFormatter"
                            :show-all-x-ticks="true"
                            :colors="['var(--primary)', 'var(--success)']"
                            :legend-labels="replacementChartData.legendLabels"
                            class="w-full"
                        />
                    </ClientOnly>
                </div>
            </div>

            <div
                v-if="deletedUserChartData.data.length > 0"
                class="col-span-1 lg:col-span-2"
            >
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des utilisateurs perdus
                </p>
                <div v-if="loading">
                    <div class="mt-3 bg-white rounded-sm shadow-md">
                        <Skeleton class="w-full h-[400px] bg-gray-200 rounded-sm" />
                    </div>
                </div>
                <div
                    v-else
                    class="mt-3 bg-white rounded-sm shadow-md"
                >
                    <ClientOnly>
                        <BarChart
                            :data="deletedUserChartData.data"
                            index="name"
                            :categories="['count']"
                            :x-formatter="xDeletedUsersFormatter"
                            :y-formatter="yFormatter"
                            :show-all-x-ticks="true"
                            :colors="['var(--chart-5)']"
                            :legend-labels="deletedUserChartData.legendLabels"
                            class="w-full"
                        />
                    </ClientOnly>
                </div>
            </div>

            <div class="col-span-1 lg:col-span-2">
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des inscriptions par province
                </p>

                <div class="mt-4 flex gap-8 items-center">
                    <div class="flex gap-3 items-center">
                        <input
                            v-model="selectedCountryForProvince"
                            type="radio"
                            value="be"
                        >
                        <label
                            class="font-medium text-sm"
                        >
                            Belgique
                        </label>
                    </div>

                    <div class="flex gap-3 items-center">
                        <input
                            v-model="selectedCountryForProvince"
                            type="radio"
                            value="fr"
                        >
                        <label
                            class="font-medium text-sm"
                        >
                            France
                        </label>
                    </div>
                </div>

                <div v-if="loading || !isDataFormatted || userByProvince.length === 0">
                    <div class="mt-6 bg-white rounded-sm shadow-md p-4">
                        <Skeleton class="w-full h-[300px] bg-gray-200 rounded-sm" />
                    </div>
                </div>
                <div
                    v-else
                    class="mt-6 bg-white rounded-sm shadow-md p-4"
                >
                    <ClientOnly>
                        <LineChart
                            index="name"
                            :data="userByProvince"
                            :categories="['inscrits']"
                            :y-formatter="yFormatter"
                            :rounded-corners="4"
                            :colors="chartLineColors"
                            class="pb-8 w-full"
                            :legend-labels="{ inscrits: 'Inscrits' }"
                        />
                    </ClientOnly>
                </div>
            </div>

            <div class="col-span-1 lg:col-span-2">
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des inscriptions par zone de code postal
                </p>

                <div class="mt-4 flex gap-8 items-center">
                    <div class="flex gap-3 items-center">
                        <input
                            v-model="selectedCountryForZipCode"
                            type="radio"
                            value="be"
                        >
                        <label
                            class="font-medium text-sm"
                        >
                            Belgique
                        </label>
                    </div>

                    <div class="flex gap-3 items-center">
                        <input
                            v-model="selectedCountryForZipCode"
                            type="radio"
                            value="fr"
                        >
                        <label
                            class="font-medium text-sm"
                        >
                            France
                        </label>
                    </div>
                </div>

                <div v-if="loading || !isDataFormatted || userByZipCode.length === 0">
                    <div class="mt-6 bg-white rounded-sm shadow-md p-4">
                        <Skeleton class="w-full h-[400px] bg-gray-200 rounded-sm" />
                    </div>
                </div>
                <div
                    v-else
                    class="mt-6 bg-white rounded-sm shadow-md p-4"
                >
                    <ClientOnly>
                        <AreaChart
                            index="name"
                            :data="userByZipCode"
                            :categories="['inscrits']"
                            :y-formatter="yFormatter"
                            :rounded-corners="4"
                            :colors="chartAreaColors"
                            class="pb-8 w-full"
                            :legend-labels="{ inscrits: 'Inscrits' }"
                        />
                    </ClientOnly>
                </div>
            </div>
        </section>

        <DashboardStatCardAdminGroup
            v-for="(report, index) in adminReports"
            :key="index"
            :title="report.title"
            :items="report.items"
            :loading="loading"
            class="mt-8"
        />
    </div>
</template>

<script lang="ts" setup>
import { UserGroupIcon, ArrowPathIcon, PaperAirplaneIcon } from '@heroicons/vue/24/solid';
import { DashboardStatCardAdminGroup } from '#components';
import { useReports } from '~/composables/useReports';

const BarChart = defineAsyncComponent(() => import('@/components/ui/chart-bar').then(m => m.BarChart));
const AreaChart = defineAsyncComponent(() => import('@/components/ui/chart-area').then(m => m.AreaChart));
const LineChart = defineAsyncComponent(() => import('@/components/ui/chart-line').then(m => m.LineChart));

const { reports, loading } = useReports();

const { isAdmin, isCommunityManager, isDeveloper, isManager, isSaleRepresentative } = useAuth();
const { mapWeeklyStatistics, mapDailyStatistics, yFormatter } = useChart();

// State pour stocker les données formatées
const chartDataState = useState('adminDashboardChartData', () => ({
    registrationDaily: { data: [], legendLabels: ['Total'] },
    registrationMonthly: { data: [], legendLabels: ['Total'] },
    registrationYearly: { data: [], legendLabels: ['Total'] },
    deletedUsers: { data: [], legendLabels: ['Total'] },
    replacementDaily: { data: [], legendLabels: ['Total', 'Acceptés'] },
    replacementMonthly: { data: [], legendLabels: ['Total', 'Acceptés'] },
    replacementYearly: { data: [], legendLabels: ['Total', 'Acceptés'] },
    userByProvince: [],
    userByZipCode: [],
    adminReports: [],
    userBelgianCount: 0,
    userFrenchCount: 0,
}));

const selectedCountryForProvince = ref('be');
const selectedCountryForZipCode = ref('be');

// Fonction pour formater et stocker toutes les données dans le state
const formatAndStoreData = () => {
    if (!reports.value) return;

    const regStats = reports.value.registration_statistics;
    const repStats = reports.value.replacement_statistics;
    const acceptedStats = reports.value.accepted_replacement_statistics;
    const responseStats = reports.value.replacement_response_statistics;

    if (regStats) {
        chartDataState.value.userBelgianCount = regStats.total_belgian ?? 0;
        chartDataState.value.userFrenchCount = regStats.total_french ?? 0;

        if (regStats.week) {
            chartDataState.value.registrationDaily = mapDailyStatistics(regStats.week, '', ['Total']);
        }
        if (regStats.month) {
            chartDataState.value.registrationMonthly = mapWeeklyStatistics(regStats.month, 'Semaine', ['Total']);
        }
        if (regStats.weeks_year) {
            chartDataState.value.registrationYearly = mapWeeklyStatistics(regStats.weeks_year, 'Semaine', ['Total']);
        }
        if (regStats.total_deleted) {
            chartDataState.value.deletedUsers = mapWeeklyStatistics(regStats.total_deleted, 'Semaine', ['Total']);
        }

        if (regStats.group_by_province) {
            const countryName = selectedCountryForProvince.value === 'be' ? 'Belgique' : 'France';
            const countryData = regStats.group_by_province.find(item => item.country === countryName)?.data ?? [];
            chartDataState.value.userByProvince = countryData.map((item: { province: string; total: number }) => ({
                name: item.province,
                inscrits: item.total,
            }));
        }

        if (regStats.group_by_zip_code) {
            const countryName = selectedCountryForZipCode.value === 'be' ? 'Belgique' : 'France';
            const countryData = regStats.group_by_zip_code.find(item => item.country === countryName)?.data ?? [];
            chartDataState.value.userByZipCode = countryData.map((item: { zip_code: string; total: number }) => ({
                name: item.zip_code,
                inscrits: item.total,
            }));
        }
    }

    if (repStats) {
        if (repStats.week) {
            chartDataState.value.replacementDaily = mapDailyStatistics(repStats.week, '', ['Total', 'Acceptés'], ['accepted']);
        }
        if (repStats.month) {
            chartDataState.value.replacementMonthly = mapWeeklyStatistics(repStats.month, 'Semaine', ['Total', 'Acceptés'], ['accepted']);
        }
        if (repStats.weeks_year) {
            chartDataState.value.replacementYearly = mapWeeklyStatistics(repStats.weeks_year, 'Semaine', ['Total', 'Acceptés'], ['accepted']);
        }
    }

    if (isAdmin.value && regStats && acceptedStats && responseStats) {
        chartDataState.value.adminReports = [
            {
                title: 'Utilisateur(s)',
                items: [
                    {
                        value: (regStats.today || 0) + (regStats.yesterday || 0),
                        label: `Ce jour `,
                        colorClass: 'bg-indigo-600',
                        icon: UserGroupIcon,
                        containerClass: 'string',
                    },
                    {
                        value: regStats.last_30_days || 0,
                        label: 'Mois glissant',
                        colorClass: 'bg-orange-700',
                        icon: UserGroupIcon,
                        containerClass: 'string',
                    },
                    {
                        value: regStats.total || 0,
                        label: 'Total ',
                        colorClass: 'bg-pink-600',
                        icon: UserGroupIcon,
                        containerClass: 'string',
                    },
                ],
            },
            {
                title: 'Remplacement(s) acceptée(s)',
                items: [
                    {
                        value: (acceptedStats?.today || 0) + (acceptedStats?.yesterday || 0),
                        label: `Ce jour `,
                        colorClass: 'bg-indigo-600',
                        icon: ArrowPathIcon,
                        containerClass: 'string',
                    },
                    {
                        value: acceptedStats?.last_30_days || 0,
                        label: 'Mois glissant',
                        colorClass: 'bg-orange-700',
                        icon: ArrowPathIcon,
                        containerClass: 'string',
                    },
                    {
                        value: acceptedStats?.total || 0,
                        label: 'Total ',
                        colorClass: 'bg-pink-600',
                        icon: ArrowPathIcon,
                        containerClass: 'string',
                    },
                ],
            },
            {
                title: 'Réponse(s) remplacement(s)',
                items: [
                    {
                        value: (responseStats?.today || 0) + (responseStats?.yesterday || 0),
                        label: `Ce jour `,
                        colorClass: 'bg-indigo-600',
                        icon: PaperAirplaneIcon,
                        containerClass: 'string',
                    },
                    {
                        value: responseStats?.last_30_days || 0,
                        label: 'Mois glissant',
                        colorClass: 'bg-orange-700',
                        icon: PaperAirplaneIcon,
                        containerClass: 'string',
                    },
                    {
                        value: responseStats?.total || 0,
                        label: 'Total ',
                        colorClass: 'bg-pink-600',
                        icon: PaperAirplaneIcon,
                        containerClass: 'string',
                    },
                ],
            },
        ];
    }
};

watch([reports, selectedCountryForProvince, selectedCountryForZipCode], () => {
    if (reports.value) {
        formatAndStoreData();
    }
}, { immediate: true });

const isDataFormatted = computed(() => {
    if (loading.value) {
        const hasCachedData = chartDataState.value.registrationDaily.data.length > 0
            || chartDataState.value.registrationMonthly.data.length > 0
            || chartDataState.value.userBelgianCount > 0;
        return hasCachedData;
    }
    return !!reports.value;
});

useHead({ title: 'Tableau de bord' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

const userBelgianCount = computed(() => chartDataState.value.userBelgianCount);
const userFrenchCount = computed(() => chartDataState.value.userFrenchCount);

const userByProvince = computed(() => chartDataState.value.userByProvince);
const userByZipCode = computed(() => chartDataState.value.userByZipCode);

const chartLineColors = computed(() => {
    return [selectedCountryForProvince.value === 'be' ? 'var(--primary)' : 'var(--success)'];
});

const chartAreaColors = computed(() => {
    return [selectedCountryForZipCode.value === 'be' ? 'var(--primary)' : 'var(--success)'];
});

const registrationDailyChartData = computed(() => chartDataState.value.registrationDaily);
const registrationMonthlyChartData = computed(() => chartDataState.value.registrationMonthly);
const registrationChartData = computed(() => chartDataState.value.registrationYearly);
const deletedUserChartData = computed(() => chartDataState.value.deletedUsers);
const replacementDailyChartData = computed(() => chartDataState.value.replacementDaily);
const replacementMonthlyChartData = computed(() => chartDataState.value.replacementMonthly);
const replacementChartData = computed(() => chartDataState.value.replacementYearly);

const xRegistrationDayFormatter = computed(() => {
    const data = registrationDailyChartData.value.data;
    return (tick: number) => data[tick]?.name || '';
});

const xRegistrationMonthFormatter = computed(() => {
    const data = registrationMonthlyChartData.value.data;
    return (tick: number) => data[tick]?.name || '';
});

const xRegistrationWeekYearFormatter = computed(() => {
    const data = registrationChartData.value.data;
    return (tick: number) => data[tick]?.name || '';
});

const xDeletedUsersFormatter = computed(() => {
    const data = deletedUserChartData.value.data;
    return (tick: number) => data[tick]?.name || '';
});

const xReplacementDayFormatter = computed(() => {
    const data = replacementDailyChartData.value.data;
    return (tick: number) => data[tick]?.name || '';
});

const xReplacementMonthFormatter = computed(() => {
    const data = replacementMonthlyChartData.value.data;
    return (tick: number) => data[tick]?.name || '';
});

const xReplacementWeekYearFormatter = computed(() => {
    const data = replacementChartData.value.data;
    return (tick: number) => data[tick]?.name || '';
});

const adminReports = computed(() => {
    if (!isAdmin.value) return [];
    return chartDataState.value.adminReports;
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    width: 4px;
    height: 1px;
}

.no-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}

.no-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.no-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}
</style>
