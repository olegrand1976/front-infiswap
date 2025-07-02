<template>
    <div class="space-y-6">
        <section class="grid grid-cols-1 items-center gap-4">
            <div class="hidden lg:block mx-8">
                <Carousel :opts="{ slidesToScroll: 1, slidesToShow: 4 }">
                    <CarouselContent>
                        <CarouselItem class="basis-1/3 2xl:basis-1/4">
                            <div class="rounded-lg overflow-hidden border-2 border-primary flex flex-col h-full">
                                <div class="bg-primary text-white p-2 md:p-3 text-center text-base md:text-sm font-bold tracking-wide uppercase">
                                    Rechercher un remplacement
                                </div>
                                <div class="bg-white text-gray-700 p-3 md:p-5 flex flex-col flex-grow">
                                    <p class="mb-2 md:mb-3 text-primary text-center text-sm md:text-base font-medium">
                                        Rechercher un remplacement
                                    </p>
                                    <ul class="mb-2 md:mb-4 space-y-1 text-xs md:text-sm flex-grow">
                                        <li class="flex items-start">
                                            <span class="text-primary font-bold mr-1 md:mr-2">•</span>
                                            <span>Vous cherchez un remplaçant pour compléter votre tournée ?</span>
                                        </li>
                                    </ul>
                                    <div class="pt-2 md:pt-4">
                                        <NuxtLink to="/dashboard/replacements">
                                            <button class="bg-primary text-white w-full py-1 md:py-2 rounded text-sm md:text-sm font-semibold hover:bg-primary/90 transition">
                                                Rechercher
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>

                        <CarouselItem class="basis-1/3 2xl:basis-1/4">
                            <div class="rounded-lg overflow-hidden border-2 border-success flex flex-col h-full">
                                <div class="bg-success text-white p-2 md:p-3 text-center text-base md:text-sm font-bold tracking-wide uppercase">
                                    Me faire remplacer
                                </div>
                                <div class="bg-white text-gray-700 p-3 md:p-5 flex flex-col flex-grow">
                                    <p class="mb-2 md:mb-3 text-success text-center text-sm md:text-base font-medium">
                                        Me faire remplacer
                                    </p>
                                    <ul class="mb-2 md:mb-4 space-y-1 text-xs md:text-sm flex-grow">
                                        <li class="flex items-start">
                                            <span class="text-success font-bold mr-1 md:mr-2">•</span>
                                            <span>Vous voulez vous faire remplacer sur votre tournée ?</span>
                                        </li>
                                    </ul>
                                    <div class="pt-2 md:pt-4">
                                        <NuxtLink to="/dashboard/replacements/create">
                                            <button class="bg-success text-white w-full py-1 md:py-2 rounded text-sm md:text-sm font-semibold hover:bg-success/90 transition">
                                                Demander
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>

                        <CarouselItem class="basis-1/3 2xl:basis-1/4">
                            <div class="rounded-lg overflow-hidden border-2 border-indigo-600 flex flex-col h-full">
                                <div class="bg-indigo-600 text-white p-2 md:p-3 text-center text-base md:text-sm font-bold tracking-wide uppercase">
                                    Voir les intéressés
                                </div>
                                <div class="bg-white text-gray-700 p-3 md:p-5 flex flex-col flex-grow">
                                    <p class="mb-2 md:mb-3 text-indigo-600 text-center text-sm md:text-base font-medium">
                                        Candidats à mes remplacements
                                    </p>
                                    <ul class="mb-2 md:mb-4 space-y-1 text-xs md:text-sm flex-grow">
                                        <li class="flex items-start">
                                            <span class="text-indigo-600 font-bold mr-1 md:mr-2">•</span>
                                            <span>Consultez les utilisateurs ayant répondu positivement à vos offres de remplacement.</span>
                                        </li>
                                    </ul>
                                    <div class="pt-2 md:pt-4">
                                        <NuxtLink to="/dashboard/replacements/responses">
                                            <button class="bg-indigo-600 text-white w-full py-1 md:py-2 rounded text-sm md:text-sm font-semibold hover:bg-indigo-600/90 transition">
                                                Consulter
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>

                        <CarouselItem class="basis-1/3 2xl:basis-1/4">
                            <div class="rounded-lg overflow-hidden border-2 border-orange-700 bg-orange-700 flex flex-col h-full">
                                <div class="bg-orange-700 text-white p-2 md:p-3 text-center text-base md:text-sm font-bold tracking-wide uppercase">
                                    Mes accords de remplacement
                                </div>
                                <div class="bg-white text-gray-700 p-3 md:p-5 flex flex-col flex-grow">
                                    <p class="mb-2 md:mb-3 text-orange-700 text-center text-sm md:text-base font-medium">
                                        Accords de remplacement
                                    </p>
                                    <ul class="mb-2 md:mb-4 space-y-1 text-xs md:text-sm flex-grow">
                                        <li class="flex items-start">
                                            <span class="text-orange-700 font-bold mr-1 md:mr-2">•</span>
                                            <span>Accédez à la liste des remplacements pour lesquels vous avez candidaté.</span>
                                        </li>
                                    </ul>
                                    <div class="pt-2 md:pt-4">
                                        <NuxtLink to="/dashboard/replacements/applied">
                                            <button class="bg-orange-700 text-white w-full py-1 md:py-2 rounded text-sm md:text-sm font-semibold hover:bg-orange-700/90 transition">
                                                Accéder
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>

            <div class="relative lg:hidden mx-8">
                <Carousel>
                    <CarouselContent>
                        <CarouselItem>
                            <div class="rounded-lg overflow-hidden border-2 border-primary flex flex-col h-full">
                                <div class="bg-primary text-white p-2 md:p-3 text-center text-base md:text-sm font-bold tracking-wide uppercase">
                                    Rechercher un remplacement
                                </div>
                                <div class="bg-white text-gray-700 p-3 md:p-5 flex flex-col flex-grow">
                                    <p class="mb-2 md:mb-3 text-primary text-center text-sm md:text-base font-medium">
                                        Rechercher un remplacement
                                    </p>
                                    <ul class="mb-2 md:mb-4 space-y-1 text-xs md:text-sm flex-grow">
                                        <li class="flex items-start">
                                            <span class="text-primary font-bold mr-1 md:mr-2">•</span>
                                            <span>Vous cherchez un remplaçant pour compléter votre tournée ?</span>
                                        </li>
                                    </ul>
                                    <div class="pt-2 md:pt-4">
                                        <NuxtLink to="/dashboard/replacements">
                                            <button class="bg-primary text-white w-full py-1 md:py-2 rounded text-sm md:text-sm font-semibold hover:bg-primary/90 transition">
                                                Rechercher
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div class="rounded-lg overflow-hidden border-2 border-success flex flex-col h-full">
                                <div class="bg-success text-white p-2 md:p-3 text-center text-base md:text-sm font-bold tracking-wide uppercase">
                                    Me faire remplacer
                                </div>
                                <div class="bg-white text-gray-700 p-3 md:p-5 flex flex-col flex-grow">
                                    <p class="mb-2 md:mb-3 text-success text-center text-sm md:text-base font-medium">
                                        Me faire remplacer
                                    </p>
                                    <ul class="mb-2 md:mb-4 space-y-1 text-xs md:text-sm flex-grow">
                                        <li class="flex items-start">
                                            <span class="text-success font-bold mr-1 md:mr-2">•</span>
                                            <span>Vous voulez vous faire remplacer sur votre tournée ?</span>
                                        </li>
                                    </ul>
                                    <div class="pt-2 md:pt-4">
                                        <NuxtLink to="/dashboard/replacements/create">
                                            <button class="bg-success text-white w-full py-1 md:py-2 rounded text-sm md:text-sm font-semibold hover:bg-success/90 transition">
                                                Demander
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div class="rounded-lg overflow-hidden border-2 border-indigo-600 flex flex-col h-full">
                                <div class="bg-indigo-600 text-white p-2 md:p-3 text-center text-base md:text-sm font-bold tracking-wide uppercase">
                                    Voir les intéressés
                                </div>
                                <div class="bg-white text-gray-700 p-3 md:p-5 flex flex-col flex-grow">
                                    <p class="mb-2 md:mb-3 text-indigo-600 text-center text-sm md:text-base font-medium">
                                        Candidats à mes remplacements
                                    </p>
                                    <ul class="mb-2 md:mb-4 space-y-1 text-xs md:text-sm flex-grow">
                                        <li class="flex items-start">
                                            <span class="text-indigo-600 font-bold mr-1 md:mr-2">•</span>
                                            <span>Consultez les utilisateurs ayant répondu positivement à vos offres de remplacement.</span>
                                        </li>
                                    </ul>
                                    <div class="pt-2 md:pt-4">
                                        <NuxtLink to="/dashboard/replacements/responses">
                                            <button class="bg-indigo-600 text-white w-full py-1 md:py-2 rounded text-sm md:text-sm font-semibold hover:bg-indigo-600/90 transition">
                                                Consulter
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div class="rounded-lg overflow-hidden border-2 border-orange-700 flex flex-col h-full">
                                <div class="bg-orange-700 text-white p-2 md:p-3 text-center text-base md:text-sm font-bold tracking-wide uppercase">
                                    Mes accords de remplacement
                                </div>
                                <div class="bg-white text-gray-700 p-3 md:p-5 flex flex-col flex-grow">
                                    <p class="mb-2 md:mb-3 text-orange-700 text-center text-sm md:text-base font-medium">
                                        Accords de remplacement
                                    </p>
                                    <ul class="mb-2 md:mb-4 space-y-1 text-xs md:text-sm flex-grow">
                                        <li class="flex items-start">
                                            <span class="text-orange-700 font-bold mr-1 md:mr-2">•</span>
                                            <span>Accédez à la liste des remplacements pour lesquels vous avez candidaté.</span>
                                        </li>
                                    </ul>
                                    <div class="pt-2 md:pt-4">
                                        <NuxtLink to="/dashboard/replacements/applied">
                                            <button class="bg-orange-700 text-white w-full py-1 md:py-2 rounded text-sm md:text-sm font-semibold hover:bg-orange-700/90 transition">
                                                Accéder
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>

            <div class="bg-gray-100 rounded-b-lg">
                <div class="p-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    <DashboardReportSection
                        title="Demandes de remplacement"
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

        <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="bg-gray-100 h-80 sm:h-full rounded p-4 mb-4">
                <div class="text-primary flex justify-between items-center">
                    <h2>
                        Mes préférences
                    </h2>
                    <Button
                        variant="inline"
                        class="font-bold text-xs mt-2"
                        @click="proposalDialog = true"
                    >
                        Boost IA
                    </Button>
                </div>
                <div class="sm:mt-10">
                    <InputPreferences
                        :initial-zip-codes="zipCodes"
                        :initial-cities="cities"
                        @update:initial-zip-codes="updateZipCodes"
                        @update:initial-cities="updateCities"
                    />
                </div>

                <ProposalLocationModal
                    v-model="proposalDialog"
                    :initial-zip-codes="zipCodes"
                    :initial-cities="cities"
                    :is-preference-mode="true"
                    @update:initial-zip-codes="updateZipCodes"
                    @update:initial-cities="updateCities"
                />
            </div>

            <div class="bg-gray-100 rounded-b-lg relative">
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
        </section>
    </div>
</template>

<script setup lang="ts">
import { LineChart } from '@/components/ui/chart-line';
import InputPreferences from '@/components/InputPreferences.vue';
import type { UserSettings, Patient } from '~/lib/types';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

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
const proposalDialog = ref(false);

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

const zipCodes = ref<string[]>([]);
const cities = ref<string[]>([]);

const updateFromSettings = () => {
    const settings: UserSettings = JSON.parse(user.value.settings || '{}');
    zipCodes.value = settings.replacement?.zip_codes?.filter(zip => zip) ?? [];
    cities.value = settings.replacement?.cities?.filter(city => city) ?? [];
};

updateFromSettings();

watch(
    () => user.value.settings,
    () => {
        updateFromSettings();
    },
    { deep: true },
);

const updateZipCodes = async (newZipCodes: string[]) => {
    zipCodes.value = newZipCodes.filter(zip => zip);
    await nextTick();
};

const updateCities = async (newCities: string[]) => {
    cities.value = newCities.filter(city => city);
    await nextTick();
};

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

<style scoped>
.carousel-container {
    max-width: 100%;
    overflow: hidden;
}
.relative {
    padding-bottom: 20px;
}
</style>
