<template>
    <div class="space-y-6">
        <section class="grid grid-cols-1 items-center gap-4">
            <div class="hidden md:grid grid-cols-2 gap-3 p-4 md:grid-cols-4 md:gap-6">
                <div class="rounded-lg overflow-hidden border-2 border-primary flex flex-col h-full">
                    <div class="bg-primary text-white p-2 md:p-3 text-center text-xs md:text-base font-bold tracking-wide uppercase">
                        ETAPE 1
                    </div>
                    <div class="bg-white text-gray-700 p-3 md:p-5 flex flex-col flex-grow">
                        <p class="mb-2 md:mb-3 text-primary text-center text-sm md:text-base font-medium">
                            Pré-enregistrer mes patients
                        </p>
                        <ul class="mb-2 md:mb-4 space-y-1 text-xs md:text-sm flex-grow">
                            <li class="flex items-start">
                                <span class="text-primary font-bold mr-1 md:mr-2">•</span>
                                <span>Je créer les fiches dès maintenant pour passer le relais en 2 clics</span>
                            </li>
                        </ul>
                        <div class="pt-2 md:pt-4">
                            <a href="/dashboard/patients/create">
                                <button class="bg-primary text-white w-full py-1 md:py-2 rounded text-xs md:text-sm font-semibold hover:bg-primary/90 transition">
                                    Pré-enregistrer
                                </button>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="rounded-lg overflow-hidden border-2 border-primary flex flex-col h-full">
                    <div class="bg-primary text-white p-2 md:p-3 text-center text-xs md:text-base font-bold tracking-wide uppercase">
                        ETAPE 2
                    </div>
                    <div class="bg-white text-gray-700 p-3 md:p-5 flex flex-col flex-grow">
                        <p class="mb-2 md:mb-3 text-primary text-center text-sm md:text-base font-medium">
                            Planifier ma tournée
                        </p>
                        <ul class="mb-2 md:mb-4 space-y-1 text-xs md:text-sm flex-grow">
                            <li class="flex items-start">
                                <span class="text-primary font-bold mr-1 md:mr-2">•</span>
                                <span>J'organise mon parcours à l'avance ; mon remplaçant n’a plus qu’à suivre l’itinéraire</span>
                            </li>
                        </ul>
                        <div class="pt-2 md:pt-4">
                            <a href="/dashboard/patients/create">
                                <button class="bg-primary text-white w-full py-1 md:py-2 rounded text-xs md:text-sm font-semibold hover:bg-primary/90 transition">
                                    Planifier
                                </button>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="rounded-lg overflow-hidden border-2 border-primary flex flex-col h-full">
                    <div class="bg-primary text-white p-2 md:p-3 text-center text-xs md:text-base font-bold tracking-wide uppercase">
                        ETAPE 3
                    </div>
                    <div class="bg-white text-gray-700 p-3 md:p-5 flex flex-col flex-grow">
                        <p class="mb-2 md:mb-3 text-primary text-center text-sm md:text-base font-medium">
                            Proposer mes disponibilités
                        </p>
                        <ul class="mb-2 md:mb-4 space-y-1 text-xs md:text-sm flex-grow">
                            <li class="flex items-start">
                                <span class="text-primary font-bold mr-1 md:mr-2">•</span>
                                <span>Je recherche des missions de remplacement</span>
                            </li>
                        </ul>
                        <div class="pt-2 md:pt-4">
                            <a href="/dashboard/replacements">
                                <button class="bg-primary text-white w-full py-1 md:py-2 rounded text-xs md:text-sm font-semibold hover:bg-primary/90 transition">
                                    Proposer
                                </button>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="rounded-lg overflow-hidden border-2 border-success flex flex-col h-full">
                    <div class="bg-success text-white p-2 md:p-3 text-center text-xs md:text-base font-bold tracking-wide uppercase">
                        ETAPE 4
                    </div>
                    <div class="bg-white text-gray-700 p-3 md:p-5 flex flex-col flex-grow">
                        <p class="mb-2 md:mb-3 text-success text-center text-sm md:text-base font-medium">
                            Demander un remplaçant
                        </p>
                        <ul class="mb-2 md:mb-4 space-y-1 text-xs md:text-sm flex-grow">
                            <li class="flex items-start">
                                <span class="text-primary font-bold mr-1 md:mr-2">•</span>
                                <span>Besoin d'un remplaçant planifié ou en urgence</span>
                            </li>
                        </ul>
                        <div class="pt-2 md:pt-4">
                            <a href="/dashboard/replacements/create">
                                <button class="bg-success text-white w-full py-1 md:py-2 rounded text-xs md:text-sm font-semibold hover:bg-success/90 transition">
                                    Demander
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="relative sm:hidden">
                <div
                    ref="carousel"
                    class="flex overflow-hidden w-full mb-16"
                >
                    <div class="min-w-full flex justify-center items-center p-4 rounded-md">
                        <div class="rounded-lg overflow-hidden border-2 border-primary flex flex-col h-full">
                            <div class="bg-primary text-white p-2 md:p-3 text-center text-base md:text-sm font-bold tracking-wide uppercase">
                                ETAPE 1
                            </div>
                            <div class="bg-white text-gray-700 p-3 md:p-5 flex flex-col flex-grow">
                                <p class="mb-2 md:mb-3 text-primary text-center text-sm md:text-base font-medium">
                                    Pré-enregistrer mes patients
                                </p>
                                <ul class="mb-2 md:mb-4 space-y-1 text-xs md:text-sm flex-grow">
                                    <li class="flex items-start">
                                        <span class="text-primary font-bold mr-1 md:mr-2">•</span>
                                        <span>Je créer les fiches dès maintenant pour passer le relais en 2 clics</span>
                                    </li>
                                </ul>
                                <div class="pt-2 md:pt-4">
                                    <a href="/dashboard/patients/create">
                                        <button class="bg-primary text-white w-full py-1 md:py-2 rounded text-sm md:text-sm font-semibold hover:bg-primary/90 transition">
                                            Pré-enregistrer
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="min-w-full flex justify-center items-center p-4 rounded-md">
                        <div class="rounded-lg overflow-hidden border-2 border-primary flex flex-col h-full">
                            <div class="bg-primary text-white p-2 md:p-3 text-center text-base md:text-sm font-bold tracking-wide uppercase">
                                ETAPE 2
                            </div>
                            <div class="bg-white text-gray-700 p-3 md:p-5 flex flex-col flex-grow">
                                <p class="mb-2 md:mb-3 text-primary text-center text-sm md:text-base font-medium">
                                    Planifier ma tournée
                                </p>
                                <ul class="mb-2 md:mb-4 space-y-1 text-xs md:text-sm flex-grow">
                                    <li class="flex items-start">
                                        <span class="text-primary font-bold mr-1 md:mr-2">•</span>
                                        <span>J'organise mon parcours à l'avance ; mon remplaçant n’a plus qu’à suivre l’itinéraire</span>
                                    </li>
                                </ul>
                                <div class="pt-2 md:pt-4">
                                    <a href="/dashboard/patients/create">
                                        <button class="bg-primary text-white w-full py-1 md:py-2 rounded text-sm md:text-sm font-semibold hover:bg-primary/90 transition">
                                            Planifier
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="min-w-full flex justify-center items-center p-4 rounded-md">
                        <div class="rounded-lg overflow-hidden border-2 border-primary flex flex-col h-full">
                            <div class="bg-primary text-white p-2 md:p-3 text-center text-base md:text-sm font-bold tracking-wide uppercase">
                                ETAPE 3
                            </div>
                            <div class="bg-white text-gray-700 p-3 md:p-5 flex flex-col flex-grow">
                                <p class="mb-2 md:mb-3 text-primary text-center text-sm md:text-base font-medium">
                                    Proposer mes disponibilités
                                </p>
                                <ul class="mb-2 md:mb-4 space-y-1 text-xs md:text-sm flex-grow">
                                    <li class="flex items-start">
                                        <span class="text-primary font-bold mr-1 md:mr-2">•</span>
                                        <span>Je recherche des missions de remplacement</span>
                                    </li>
                                </ul>
                                <div class="pt-2 md:pt-4">
                                    <a href="/dashboard/replacements">
                                        <button class="bg-primary text-white w-full py-1 md:py-2 rounded text-sm md:text-sm font-semibold hover:bg-primary/90 transition">
                                            Proposer
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="min-w-full flex justify-center items-center p-4 rounded-md">
                        <div class="rounded-lg overflow-hidden border-2 border-success flex flex-col h-full">
                            <div class="bg-success text-white p-2 md:p-3 text-center text-base md:text-sm font-bold tracking-wide uppercase">
                                ETAPE 4
                            </div>
                            <div class="bg-white text-gray-700 p-3 md:p-5 flex flex-col flex-grow">
                                <p class="mb-2 md:mb-3 text-success text-center text-sm md:text-base font-medium">
                                    Demander un remplaçant
                                </p>
                                <ul class="mb-2 md:mb-4 space-y-1 text-xs md:text-sm flex-grow">
                                    <li class="flex items-start">
                                        <span class="text-primary font-bold mr-1 md:mr-2">•</span>
                                        <span>Besoin d'un remplaçant planifié ou en urgence</span>
                                    </li>
                                </ul>
                                <div class="pt-2 md:pt-4">
                                    <a href="/dashboard/replacements/create">
                                        <button class="bg-success text-white w-full py-1 md:py-2 rounded text-sm md:text-sm font-semibold hover:bg-success/90 transition">
                                            Demander
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-md"
                    @click="nextStep"
                >
                    Étape suivante
                </button>
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
                <p class="mt-4">
                    Liste patient du jour
                </p>

                <div class="my-3">
                    <template v-if="tours.length > 0">
                        <div
                            v-for="tour in tours"
                            :key="tour.id"
                            class="bg-white rounded-lg shadow-md p-4 mb-4"
                        >
                            <div class="flex justify-between items-center mb-3">
                                <div class="flex items-center">
                                    <!-- <div class="flex-shrink-0">
                                        <img
                                            :src="$config.public.API_URL + tour.profile.profil_url"
                                            alt="image"
                                            class="w-16 h-16 rounded-full object-cover border-2"
                                        >
                                    </div> -->

                                    <span class="font-bold text-lg">{{ tour.firstname }} {{ tour.lastname }}</span>
                                </div>
                                <div
                                    v-for="(visitTime, idx) in tour.visit_times"
                                    :key="visitTime.id"
                                >
                                    <button
                                        class="w-8 h-8 flex items-center justify-center bg-gray-400 text-white rounded-full"
                                        @click="openDialog(tour.id, visitTime.id)"
                                    >
                                        ✖
                                    </button>
                                </div>

                                <Dialog v-model:open="isDialogOpen">
                                    <DialogContent class="h-[28vh]">
                                        <DialogHeader>
                                            <DialogTitle>Confirmer la suppression</DialogTitle>
                                            <DialogDescription>
                                                Êtes-vous sûr de vouloir supprimer ce patient ?
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div class="flex space-x-8 justify-end items-center">
                                            <Button
                                                variant="secondary"
                                                @click="closeDialog"
                                            >
                                                Annuler
                                            </Button>
                                            <Button @click="submitDelete()">
                                                Oui
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div class="flex gap-2">
                                <div class="flex-1">
                                    <div class="bg-gray-200 text-black font-semibold text-center py-2 rounded-md">
                                        Code postaux
                                    </div>
                                    <div class="mt-2 text-center bg-white p-2 rounded-md border">
                                        {{ tour.profile.zip_code }}
                                    </div>
                                </div>

                                <div class="flex-1">
                                    <div class="bg-gray-200 text-black font-semibold text-center py-2 rounded-md">
                                        Ville
                                    </div>
                                    <div class="mt-2 text-center bg-white p-2 rounded-md border">
                                        {{ tour.profile.city }}
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-200 text-black font-semibold text-center py-2 mt-4 rounded-md">
                                Types de soins à pratiquer
                            </div>

                            <div v-if="tour?.visit_times?.length">
                                <div
                                    v-for="(visitTimes, idx1) in tour.visit_times"
                                    :key="'vt-' + idx1"
                                >
                                    <div
                                        v-for="(visit, idx2) in visitTimes.visits"
                                        :key="'v-' + idx2"
                                    >
                                        <div v-if="visit.care_types && visit.care_types.length">
                                            <div
                                                v-for="(careType, idx3) in visit.care_types"
                                                :key="'ct-' + idx3"
                                                class="bg-white p-2 rounded-md border mt-2"
                                            >
                                                <span>{{ careType }}</span>
                                            </div>
                                        </div>
                                        <div
                                            v-else
                                            class="text-gray-500"
                                        >
                                            Aucun soin spécifié
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <p class="text-center text-black/70 mt-6">
                            Aucune tournée à afficher pour le moment
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

const carousel = ref<HTMLElement | null>(null);
const currentStep = ref(0);

function nextStep() {
    if (!carousel.value) return;
    const items = carousel.value.children;
    currentStep.value = (currentStep.value + 1) % items.length;
    const target = items[currentStep.value] as HTMLElement;
    carousel.value.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
}
const isDialogOpen = ref(false);
const patientToDelete = ref<{ patientId: number; visitId: number } | null>(null);

const openDialog = (patientId: number, visitId: number) => {
    patientToDelete.value = { patientId, visitId };
    isDialogOpen.value = true;
};

const closeDialog = () => {
    isDialogOpen.value = false;
    patientToDelete.value = null;
};

const submitDelete = async () => {
    if (!patientToDelete.value) return;

    const { patientId, visitId } = patientToDelete.value;

    try {
        await deleteTour(patientId, visitId).catch((error) => {
            console.error('Erreur API, rollback:', error);
            // tours.value = currentTours;
        });
    }
    catch (error) {
        console.error('Erreur lors de la suppression:', error);
    }
    finally {
        closeDialog();
    }
};
</script>

<style scoped>
.carousel-container {
  max-width: 100%;
  overflow: hidden;
}
.relative {
  padding-bottom: 20px;
}
</style>
