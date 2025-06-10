<template>
    <div>
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
            <div>
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des inscriptions
                </p>
                <div class="mt-3 bg-white rounded-sm shadow-md">
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
                </div>
            </div>

            <div>
                <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
                    Évolution des remplacements
                </p>
                <div class="mt-3 bg-white rounded-sm shadow-md">
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
                </div>
            </div>
        </section>

        <DashboardStatCardAdminGroup
            v-for="(report, index) in adminReports"
            :key="index"
            :title="report.title"
            :items="report.items"
            class="mt-8"
        />
    </div>
</template>

<script lang="ts" setup>
import { UserGroupIcon, MapPinIcon, ArrowPathIcon, PaperAirplaneIcon, HeartIcon } from '@heroicons/vue/24/solid';
import { DashboardStatCardAdminGroup } from '#components';
import { BarChart } from '@/components/ui/chart-bar';
import { useReports } from '~/composables/useReports';

const { reports, getReports } = useReports();

const { isAdmin } = useAuth();
const { mapWeeklyStatistics, createXFormatter, yFormatter } = useChart();

useHead({ title: 'Tableau de bord' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

await getReports();

const registrationChartData = computed(() => {
    return mapWeeklyStatistics(reports.value?.registration_statistics?.weeks, 'Semaine', ['Total']);
});
const replacementChartData = computed(() => {
    return mapWeeklyStatistics(reports.value?.replacement_statistics?.weeks, 'Semaine', ['Total', 'Acceptés'], ['accepted']);
});

console.log(registrationChartData.value);

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
                    value: reports.value.registration_statistics.this_month + reports.value.registration_statistics.last_month,
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
        {
            title: 'Patient(s)',
            items: [
                {
                    value: reports.value.patient_by_nurse_statistics.today + reports.value.patient_by_nurse_statistics.yesterday,
                    label: `Ce jour `,
                    colorClass: 'bg-indigo-600',
                    icon: HeartIcon,
                    containerClass: 'string',
                },
                {
                    value: reports.value.patient_by_nurse_statistics.this_month + reports.value.patient_by_nurse_statistics.last_month,
                    label: 'Ce mois / Mois glissant',
                    colorClass: 'bg-orange-700',
                    icon: HeartIcon,
                    containerClass: 'string',
                },
                {
                    value: reports.value.patient_by_nurse_statistics.total,
                    label: 'Total ',
                    colorClass: 'bg-pink-600',
                    icon: HeartIcon,
                    containerClass: 'string',
                },
            ],
        },
        {
            title: 'Tournée(s)',
            items: [
                {
                    value: reports.value.tour_statistics.today + reports.value.tour_statistics.yesterday,
                    label: `Ce jour `,
                    colorClass: 'bg-indigo-600',
                    icon: MapPinIcon,
                    containerClass: 'string',
                },
                {
                    value: reports.value.tour_statistics.this_month + reports.value.tour_statistics.last_month,
                    label: 'Ce mois / Mois glissant',
                    colorClass: 'bg-orange-700',
                    icon: MapPinIcon,
                    containerClass: 'string',
                },
                {
                    value: reports.value.tour_statistics.total,
                    label: 'Total ',
                    colorClass: 'bg-pink-600',
                    icon: MapPinIcon,
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
                    value: reports.value.accepted_replacement_statistics.this_month + reports.value.accepted_replacement_statistics.last_month,
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
                    value: reports.value.replacement_response_statistics.this_month + reports.value.replacement_response_statistics.last_month,
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
