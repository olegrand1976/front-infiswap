<template>
    <div>
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-8">
            <div class="col-span-1 lg:col-span-2 mb-2 sm:mb-0">
                <div v-if="loading">
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
                <div v-if="loading">
                    <div class="mt-3 bg-white rounded-sm shadow-md">
                        <Skeleton class="w-full h-[400px] bg-gray-200 rounded-sm" />
                    </div>
                </div>
                <div
                    v-else-if="registrationDailyChartData.data.length > 0"
                    class="mt-3 bg-white rounded-sm shadow-md"
                >
                    <ClientOnly>
                        <BarChart
                            v-if="chartsLoaded.daily"
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
                        <div v-else class="w-full h-[400px] flex items-center justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    </ClientOnly>
                </div>
                <div
                    v-else
                    class="mt-3 bg-white rounded-sm shadow-md p-8 text-center text-gray-500"
                >
                    Aucune donnée disponible
                </div>
            </div>

            <div>
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des remplacements de cette semaine-ci
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
                            v-if="chartsLoaded.daily"
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
                        <div v-else class="w-full h-[400px] flex items-center justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    </ClientOnly>
                </div>
            </div>

            <div>
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des inscriptions de ce mois-ci
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
                            v-if="chartsLoaded.monthly"
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
                        <div v-else class="w-full h-[400px] flex items-center justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    </ClientOnly>
                </div>
            </div>

            <div>
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des remplacements de ce mois-ci
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
                            v-if="chartsLoaded.monthly"
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
                        <div v-else class="w-full h-[400px] flex items-center justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    </ClientOnly>
                </div>
            </div>

            <div>
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des inscriptions de l'année
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
                            v-if="chartsLoaded.yearly"
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
                        <div v-else class="w-full h-[400px] flex items-center justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    </ClientOnly>
                </div>
            </div>

            <div>
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des remplacements de l'année
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
                            v-if="chartsLoaded.yearly"
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
                        <div v-else class="w-full h-[400px] flex items-center justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
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
                            v-if="chartsLoaded.yearly"
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
                        <div v-else class="w-full h-[400px] flex items-center justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
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

                <div v-if="loading">
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
                            v-if="chartsLoaded.provinces"
                            index="name"
                            :data="userByProvince"
                            :categories="['inscrits']"
                            :y-formatter="yFormatter"
                            :rounded-corners="4"
                            :colors="chartLineColors"
                            class="pb-8 w-full"
                            :legend-labels="{ inscrits: 'Inscrits' }"
                        />
                        <div v-else class="w-full h-[300px] flex items-center justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
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

                <div v-if="loading">
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
                            v-if="chartsLoaded.zipCodes"
                            index="name"
                            :data="userByZipCode"
                            :categories="['inscrits']"
                            :y-formatter="yFormatter"
                            :rounded-corners="4"
                            :colors="chartAreaColors"
                            class="pb-8 w-full"
                            :legend-labels="{ inscrits: 'Inscrits' }"
                        />
                        <div v-else class="w-full h-[400px] flex items-center justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
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

const BarChart = defineAsyncComponent(() => import('@/components/ui/chart-bar').then(m => m.BarChart));
const AreaChart = defineAsyncComponent(() => import('@/components/ui/chart-area').then(m => m.AreaChart));
const LineChart = defineAsyncComponent(() => import('@/components/ui/chart-line').then(m => m.LineChart));
import { useReports } from '~/composables/useReports';

const { reports, loading } = useReports();

const { isAdmin, isCommunityManager, isDeveloper, isManager, isSaleRepresentative } = useAuth();
const { mapWeeklyStatistics, mapDailyStatistics, yFormatter } = useChart();

useHead({ title: 'Tableau de bord' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

const selectedCountryForProvince = ref('be');
const selectedCountryForZipCode = ref('be');

// Lazy loading pour les graphiques - charger progressivement
const chartsLoaded = ref({
    daily: false,
    monthly: false,
    yearly: false,
    provinces: false,
    zipCodes: false,
});

// Utiliser requestIdleCallback si disponible, sinon setTimeout pour optimiser le chargement
const scheduleLoad = (callback: () => void, delay: number) => {
    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(callback, { timeout: delay });
    } else {
        setTimeout(callback, delay);
    }
};

// Charger les graphiques visibles avec un délai minimum pour que les loaders soient visibles
onMounted(() => {
    // Attendre que les données soient chargées avant d'afficher les graphiques
    watchEffect(() => {
        if (!loading.value && reports.value) {
            // Charger les graphiques de la première ligne après un court délai
            scheduleLoad(() => {
                chartsLoaded.value.daily = true;
            }, 200);
            
            // Charger les autres graphiques avec un délai pour éviter de bloquer le rendu
            scheduleLoad(() => {
                chartsLoaded.value.monthly = true;
            }, 300);
            
            scheduleLoad(() => {
                chartsLoaded.value.yearly = true;
            }, 400);
            
            scheduleLoad(() => {
                chartsLoaded.value.provinces = true;
                chartsLoaded.value.zipCodes = true;
            }, 500);
        }
    });
});

const userBelgianCount = computed(() => reports.value.registration_statistics?.total_belgian);
const userFrenchCount = computed(() => reports.value.registration_statistics?.total_french);

// Utiliser shallowRef pour éviter les recalculs profonds
const userByProvince = computed(() => {
    if (!reports.value?.registration_statistics?.group_by_province) return [];

    const userByProvinces = reports.value.registration_statistics.group_by_province;
    const countryName = selectedCountryForProvince.value === 'be' ? 'Belgique' : 'France';
    const countryData = userByProvinces.find(item => item.country === countryName)?.data ?? [];

    return countryData.map((item: { province: string; total: number }) => ({
        name: item.province,
        inscrits: item.total,
    }));
});

const userByZipCode = computed(() => {
    if (!reports.value?.registration_statistics?.group_by_zip_code) return [];

    const userByZipCodes = reports.value.registration_statistics.group_by_zip_code;
    const countryName = selectedCountryForZipCode.value === 'be' ? 'Belgique' : 'France';
    const countryData = userByZipCodes.find(item => item.country === countryName)?.data ?? [];

    return countryData.map((item: { zip_code: string; total: number }) => ({
        name: item.zip_code,
        inscrits: item.total,
    }));
});

const chartLineColors = computed(() => {
    return [selectedCountryForProvince.value === 'be' ? 'var(--primary)' : 'var(--success)'];
});

const chartAreaColors = computed(() => {
    return [selectedCountryForZipCode.value === 'be' ? 'var(--primary)' : 'var(--success)'];
});

// Utiliser shallowRef pour éviter les recalculs profonds
const registrationDailyChartData = computed(() => {
    if (!reports.value?.registration_statistics?.week) return { data: [], legendLabels: ['Total'] };
    return mapDailyStatistics(reports.value.registration_statistics.week, '', ['Total']);
});

const registrationMonthlyChartData = computed(() => {
    if (!reports.value?.registration_statistics?.month) return { data: [], legendLabels: ['Total'] };
    return mapWeeklyStatistics(reports.value.registration_statistics.month, 'Semaine', ['Total']);
});

const registrationChartData = computed(() => {
    if (!reports.value?.registration_statistics?.weeks_year) return { data: [], legendLabels: ['Total'] };
    return mapWeeklyStatistics(reports.value.registration_statistics.weeks_year, 'Semaine', ['Total']);
});

const deletedUserChartData = computed(() => {
    if (!reports.value?.registration_statistics?.total_deleted) return { data: [], legendLabels: ['Total'] };
    return mapWeeklyStatistics(reports.value.registration_statistics.total_deleted, 'Semaine', ['Total']);
});

const replacementDailyChartData = computed(() => {
    if (!reports.value?.replacement_statistics?.week) return { data: [], legendLabels: ['Total', 'Acceptés'] };
    return mapDailyStatistics(reports.value.replacement_statistics.week, '', ['Total', 'Acceptés'], ['accepted']);
});

const replacementMonthlyChartData = computed(() => {
    if (!reports.value?.replacement_statistics?.month) return { data: [], legendLabels: ['Total', 'Acceptés'] };
    return mapWeeklyStatistics(reports.value.replacement_statistics.month, 'Semaine', ['Total', 'Acceptés'], ['accepted']);
});

const replacementChartData = computed(() => {
    if (!reports.value?.replacement_statistics?.weeks_year) return { data: [], legendLabels: ['Total', 'Acceptés'] };
    return mapWeeklyStatistics(reports.value.replacement_statistics.weeks_year, 'Semaine', ['Total', 'Acceptés'], ['accepted']);
});

// Optimiser les formatters - éviter les computed imbriqués
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
    if (!isAdmin.value || !reports.value) return [];

    return [
        {
            title: 'Utilisateur(s)',
            items: [
                {
                    value: reports.value.registration_statistics.today + reports.value.registration_statistics.yesterday,
                    label: `Ce jour `,
                    colorClass: 'bg-indigo-600',
                    icon: UserGroupIcon,
                    containerClass: 'string',
                },
                {
                    value: reports.value.registration_statistics.last_30_days,
                    label: 'Mois glissant',
                    colorClass: 'bg-orange-700',
                    icon: UserGroupIcon,
                    containerClass: 'string',
                },
                {
                    value: reports.value.registration_statistics.total,
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
                    value: reports.value.accepted_replacement_statistics.today + reports.value.accepted_replacement_statistics.yesterday,
                    label: `Ce jour `,
                    colorClass: 'bg-indigo-600',
                    icon: ArrowPathIcon,
                    containerClass: 'string',
                },
                {
                    value: reports.value.accepted_replacement_statistics.last_30_days,
                    label: 'Mois glissant',
                    colorClass: 'bg-orange-700',
                    icon: ArrowPathIcon,
                    containerClass: 'string',
                },
                {
                    value: reports.value.accepted_replacement_statistics.total,
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
                    value: reports.value.replacement_response_statistics.today + reports.value.replacement_response_statistics.yesterday,
                    label: `Ce jour `,
                    colorClass: 'bg-indigo-600',
                    icon: PaperAirplaneIcon,
                    containerClass: 'string',
                },
                {
                    value: reports.value.replacement_response_statistics.last_30_days,
                    label: 'Mois glissant',
                    colorClass: 'bg-orange-700',
                    icon: PaperAirplaneIcon,
                    containerClass: 'string',
                },
                {
                    value: reports.value.replacement_response_statistics.total,
                    label: 'Total ',
                    colorClass: 'bg-pink-600',
                    icon: PaperAirplaneIcon,
                    containerClass: 'string',
                },
            ],
        },
    ];
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
