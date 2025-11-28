<template>
    <div>
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-8">
            <div>
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des inscriptions
                </p>
                <div v-if="loading">
                    <Skeleton class="mt-3 bg-gray-200 rounded-sm h-96" />
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
                            :x-formatter="xRegistrationFormatter"
                            :y-formatter="yFormatter"
                            :show-all-x-ticks="true"
                            :colors="['hsl(var(--tertiary))']"
                            :legend-labels="registrationChartData.legendLabels"
                            class="w-full"
                        />
                    </ClientOnly>
                </div>
            </div>

            <div>
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des remplacements
                </p>
                <div v-if="loading">
                    <Skeleton class="mt-3 bg-gray-200 rounded-sm h-96" />
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
                            :x-formatter="xReplacementFormatter"
                            :y-formatter="yFormatter"
                            :show-all-x-ticks="true"
                            :colors="['hsl(var(--primary))', 'hsl(var(--success))']"
                            :legend-labels="replacementChartData.legendLabels"
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

                <div v-if="loading">
                    <Skeleton class="mt-6 bg-gray-200 rounded-sm h-64" />
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

                <div v-if="loading">
                    <Skeleton class="mt-6 bg-gray-200 rounded-sm h-96" />
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
import { BarChart } from '@/components/ui/chart-bar';
import { AreaChart } from '@/components/ui/chart-area';
import { useReports } from '~/composables/useReports';

const { reports } = useReports();

const { isAdmin } = useAuth();
const loading = ref(true);
const { mapWeeklyStatistics, createXFormatter, yFormatter } = useChart();

useHead({ title: 'Tableau de bord' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

onMounted(() => {
    loading.value = false;
});

const selectedCountryForProvince = ref('be');
const selectedCountryForZipCode = ref('be');

const userByProvince = computed(() => {
    const userByProvinces = reports.value?.registration_statistics?.group_by_province ?? [];

    const countryData = userByProvinces.find(item => item.country === (selectedCountryForProvince.value === 'be' ? 'Belgique' : 'France'))?.data ?? [];

    return countryData.map((item: { province: string; total: number }) => ({
        name: item.province,
        inscrits: item.total,
    }));
});

const userByZipCode = computed(() => {
    const userByZipCodes = reports.value?.registration_statistics?.group_by_zip_code ?? [];

    const countryData = userByZipCodes.find(item => item.country === (selectedCountryForZipCode.value === 'be' ? 'Belgique' : 'France'))?.data ?? [];

    return countryData.map((item: { zip_code: string; total: number }) => ({
        name: item.zip_code,
        inscrits: item.total,
    }));
});

const chartLineColors = computed(() => {
    return [selectedCountryForProvince.value === 'be' ? 'hsl(var(--primary))' : 'hsl(var(--success))'];
});

const chartAreaColors = computed(() => {
    return [selectedCountryForZipCode.value === 'be' ? 'hsl(var(--primary))' : 'hsl(var(--success))'];
});

const registrationChartData = computed(() => {
    return mapWeeklyStatistics(reports.value?.registration_statistics?.weeks, 'Semaine', ['Total']);
});

const replacementChartData = computed(() => {
    return mapWeeklyStatistics(reports.value?.replacement_statistics?.weeks, 'Semaine', ['Total', 'Acceptés'], ['accepted']);
});

const xRegistrationFormatter = computed(() => createXFormatter(computed(() => registrationChartData.value.data)));
const xReplacementFormatter = computed(() => createXFormatter(computed(() => replacementChartData.value.data)));

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
                    value: reports.value.registration_statistics.this_month + reports.value.registration_statistics.last_30_days,
                    label: 'Ce mois / Mois glissant',
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
        // {
        //     title: 'Patient(s)',
        //     items: [
        //         {
        //             value: reports.value.patient_by_nurse_statistics.today + reports.value.patient_by_nurse_statistics.yesterday,
        //             label: `Ce jour `,
        //             colorClass: 'bg-indigo-600',
        //             icon: HeartIcon,
        //             containerClass: 'string',
        //         },
        //         {
        //             value: reports.value.patient_by_nurse_statistics.this_month + reports.value.patient_by_nurse_statistics.last_30_days,
        //             label: 'Ce mois / Mois glissant',
        //             colorClass: 'bg-orange-700',
        //             icon: HeartIcon,
        //             containerClass: 'string',
        //         },
        //         {
        //             value: reports.value.patient_by_nurse_statistics.total,
        //             label: 'Total ',
        //             colorClass: 'bg-pink-600',
        //             icon: HeartIcon,
        //             containerClass: 'string',
        //         },
        //     ],
        // },
        // {
        //     title: 'Tournée(s)',
        //     items: [
        //         {
        //             value: reports.value.tour_statistics.today + reports.value.tour_statistics.yesterday,
        //             label: `Ce jour `,
        //             colorClass: 'bg-indigo-600',
        //             icon: MapPinIcon,
        //             containerClass: 'string',
        //         },
        //         {
        //             value: reports.value.tour_statistics.this_month + reports.value.tour_statistics.last_30_days,
        //             label: 'Ce mois / Mois glissant',
        //             colorClass: 'bg-orange-700',
        //             icon: MapPinIcon,
        //             containerClass: 'string',
        //         },
        //         {
        //             value: reports.value.tour_statistics.total,
        //             label: 'Total ',
        //             colorClass: 'bg-pink-600',
        //             icon: MapPinIcon,
        //             containerClass: 'string',
        //         },
        //     ],
        // },
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
                    value: reports.value.accepted_replacement_statistics.this_month + reports.value.accepted_replacement_statistics.last_30_days,
                    label: 'Ce mois / Mois glissant',
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
                    value: reports.value.replacement_response_statistics.this_month + reports.value.replacement_response_statistics.last_30_days,
                    label: 'Ce mois / Mois glissant',
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
