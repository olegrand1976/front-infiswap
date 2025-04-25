<template>
    <div class="space-y-6">
        <section class="grid grid-cols-1 items-center gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
                <div class="rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col">
                    <div class="bg-primary text-white p-3 text-center text-sm font-bold tracking-wide uppercase">
                        ETAPE 1
                    </div>
                    <div class="bg-white text-gray-700 p-5 flex flex-col flex-grow">
                        <p class="mb-3 text-primary text-center font-medium">Pré-enregistrer mes patients</p>
                        <ul class="mb-4 space-y-1 text-sm flex-grow">
                            <li class="flex items-start">
                                <span class="text-primary font-bold mr-2">•</span>Je créer les fiches dès maintenant pour passer le relais en 2 clics
                            </li>
                        </ul>
                        <div class="pt-4">
                            <button class="bg-primary text-white w-full py-2 rounded-md text-sm font-semibold hover:bg-primary/90 transition">
                                Pré-enregistrer maintenant
                            </button>
                        </div>
                    </div>
                </div>

                <div class="rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col">
                    <div class="bg-primary text-white p-3 text-center text-sm font-bold tracking-wide uppercase">
                        ETAPE 2
                    </div>
                    <div class="bg-white text-gray-700 p-5 flex flex-col flex-grow">
                        <p class="mb-3 text-primary text-center font-medium">Planifier ma tournée</p>
                        <ul class="mb-4 space-y-1 text-sm flex-grow">
                            <li class="flex items-start">
                                <span class="text-primary font-bold mr-2">•</span>J'organise mon parcours à l'avance; mon remplaçant n'a plus qu'à suivre l'itinéraire
                            </li>
                        </ul>
                        <div class="pt-4">
                            <button class="bg-primary text-white w-full py-2 rounded-md text-sm font-semibold hover:bg-primary/90 transition">
                                Planifier maintenant
                            </button>
                        </div>
                    </div>
                </div>

                <div class="rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col">
                    <div class="bg-primary text-white p-3 text-center text-sm font-bold tracking-wide uppercase">
                        ETAPE 3
                    </div>
                    <div class="bg-white text-gray-700 p-5 flex flex-col flex-grow">
                        <p class="mb-3 text-primary text-center font-medium">Proposer mes disponibilités</p>
                        <ul class="mb-4 space-y-1 text-sm flex-grow">
                            <li class="flex items-start">
                                <span class="text-primary font-bold mr-2">•</span>Je recherche des missions de remplacement
                            </li>
                        </ul>
                        <div class="pt-4">
                            <button class="bg-primary text-white w-full py-2 rounded-md text-sm font-semibold hover:bg-primary/90 transition">
                                Proposer maintenant
                            </button>
                        </div>
                    </div>
                </div>

                <div class="rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col">
                    <div class="bg-success text-white p-3 text-center text-sm font-bold tracking-wide uppercase">
                        ETAPE 4
                    </div>
                    <div class="bg-white text-gray-700 p-5 flex flex-col flex-grow">
                        <p class="mb-3 text-primary text-center font-medium">Demander un remplaçant</p>
                        <ul class="mb-4 space-y-1 text-sm flex-grow">
                            <li class="flex items-start">
                                <span class="text-primary font-bold mr-2">•</span>J'ai besoin d'un remplaçant planifié ou en urgence
                            </li>
                        </ul>
                        <div class="pt-4">
                            <button class="bg-success text-white w-full py-2 rounded-md text-sm font-semibold hover:bg-success/90 transition">
                                Demander maintenant
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-100 rounded-b-lg">
                <!-- <div class="bg-primary h-6 rounded-t-lg" /> -->
                <div class="p-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    <DashboardReportSection
                        title="Remplacement(s) crée(s)"
                        :count="reports.me"
                    />
                    <DashboardReportSection
                        title="Annonce(s) repondue(s)"
                        :count="reports.total"
                    />
                    <DashboardReportSection
                        title="Réponse(s) accepté(s)"
                        :count="reports.accepted"
                    />
                </div>
            </div>
        </section>

        <section class="grid grid-cols-1 xl:grid-cols-[45%_53%] gap-4">
            <div class="flex flex-col space-y-4">
                <div class="bg-gray-100 h-72 sm:h-full rounded p-4 mb-4">
                    <h3 class="text-primary">
                        Mes préférences
                    </h3>
                    <InputPreferences
                        :initial-zip-codes="zipCodes"
                        :initial-cities="cities"
                    />
                </div>

                <div class="bg-gray-100 rounded-b-lg relative mt-24">
                    <h3 class="text-white bg-primary p-3 rounded-t-lg">
                        Nombres d'annonces auxquelles j'ai répondu sur InfiSwap par mois
                    </h3>
                    <div class="p-4">
                        <LineChart
                            :data="formattedData"
                            index="month"
                            :categories="['annonces']"
                            :colors="['hsl(var(--primary))']"
                            :y-formatter="(tick) => `${tick}`"
                        />
                    </div>
                </div>
            </div>

            <div class="sm:bg-gray-100 sm:rounded sm:p-4 mt-4 sm:mt-0">
                <h3 class="text-primary font-bold sm:font-normal">
                    Tournée du jour
                </h3>
                <div class="my-3 hidden sm:block">
                    <Table>
                        <TableHeader>
                            <TableRow class="w-full grid grid-cols-3 justify-between items-center gap-x-4 2xl:gap-x-16 border-gray-300">
                                <TableHead class="p-3 text-center flex h-10 justify-center items-center bg-primary text-white">
                                    Patient
                                </TableHead>
                                <TableHead class="p-3 text-center flex h-10 justify-center items-center bg-primary text-white">
                                    Code postal
                                </TableHead>
                                <TableHead class="p-3 text-center flex h-10 justify-center items-center bg-primary text-white">
                                    Ville
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <template v-if="props.tours.length != 0">
                                <div
                                    v-for="(tour, index) in props.tours"
                                    :key="index"
                                >
                                    <TableRow class="cursor-pointer w-full grid grid-cols-3 justify-between items-center gap-x-4 2xl:gap-x-16 border border-gray-300">
                                        <TableCell class="py-3 text-center bg-gray-100">
                                            <div class="flex h-10 justify-center items-center bg-gray-200">
                                                <span class="truncate w-full px-2 text-center">
                                                    {{ tour.lastname }} {{ tour.firstname }}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell class="py-3 text-center bg-gray-100">
                                            <div class="flex h-10 justify-center items-center bg-gray-200">
                                                <span class="truncate w-full px-2 text-center">
                                                    {{ tour.profile.zip_code }}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell class="py-3 text-center bg-gray-100">
                                            <div class="flex h-10 justify-center items-center bg-gray-200">
                                                <span class="truncate w-full px-2 text-center">
                                                    {{ tour.profile.city }}
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </div>
                            </template>
                            <template v-else>
                                <p class="text-center text-black/70 mt-6">
                                    Aucune tournée à afficher pour le moment
                                </p>
                                <p>
                                    <Button
                                        class="w-64 flex justify-center mx-auto text-wrap mt-8 h-24 rounded"
                                        disabled
                                    >
                                        Enregistrer votre tournée sur InfiSwap pour bénéficier de toutes les fonctionnalités
                                    </Button>
                                </p>
                            </template>
                        </TableBody>
                    </Table>
                </div>

                <div class="sm:hidden my-4">
                    <template v-if="props.tours.length !== 0">
                        <div
                            v-for="(tour, index) in props.tours"
                            :key="index"
                            class="bg-gray-100 p-3 rounded-lg space-y-4"
                        >
                            <div class="space-y-2">
                                <h3 class="text-center text-white font-semibold bg-primary py-3 px-3 rounded">
                                    Patient
                                </h3>
                                <p class="text-center bg-gray-200 py-3 px-3 rounded">
                                    {{ tour.lastname }} {{ tour.firstname }}
                                </p>
                            </div>
                            <div class="space-y-2">
                                <h3 class="text-center text-white font-semibold bg-primary py-3 px-3 rounded">
                                    Code postal
                                </h3>
                                <p class="text-center bg-gray-200 py-3 px-3 rounded">
                                    {{ tour.profile.zip_code }}
                                </p>
                            </div>
                            <div class="space-y-2">
                                <h3 class="text-center text-white font-semibold bg-primary py-3 px-3 rounded">
                                    Ville
                                </h3>
                                <p class="text-center bg-gray-200 py-3 px-3 rounded">
                                    {{ tour.profile.city }}
                                </p>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <p class="text-center text-xs text-black/50 mt-6">
                            Aucune tournée à afficher pour le moment
                        </p>
                        <p>
                            <Button
                                class="w-64 flex justify-center mx-auto text-wrap mt-8 h-24 rounded"
                                disabled
                            >
                                Enregistrer votre tournée sur InfiSwap pour bénéficier de toutes les fonctionnalités
                            </Button>
                        </p>
                    </template>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { LineChart } from '@/components/ui/chart-line';
import InputPreferences from '@/components/InputPreferences.vue';
import type { UserSettings, Patient } from '~/lib/types';

type MonthlyReport = {
    month: string;
    count: number;
};

type NurseReport = {
    me: number;
    accepted: number;
    total: number;
    reponded_per_month: MonthlyReport[];
};

const props = defineProps<{
    reports: NurseReport;
    tours: Patient[];
}>();

const user = useUser();

const formatDate = (dateString: string) => {
    const [year, month] = dateString.split('-');
    return `${month}/${year}`;
};

const formattedData = computed(() => {
    if (!props.reports) return [];

    return props.reports.reponded_per_month.map(item => ({
        month: formatDate(item.month),
        annonces: item.count,
    }));
});

const settings: UserSettings = JSON.parse(user.value.settings);
const zipCodes = ref<string[]>(settings.replacement?.zip_codes ?? []);
const cities = ref<string[]>(settings.replacement?.cities ?? []);

const previousMonth = ref('');

const currentDate = new Date();

const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const currentMonthIndex = currentDate.getMonth();
const previousMonthIndex = (currentMonthIndex - 1 + 12) % 12;
previousMonth.value = months[previousMonthIndex];
</script>
