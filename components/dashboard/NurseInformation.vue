<template>
    <div class="space-y-6">
        <section class="grid items-center grid-cols-1 gap-4">
            <NurstechPresentation />

            <div class="hidden mx-8 lg:block">
                <Carousel :opts="{ slidesToScroll: 1, slidesToShow: 4 }">
                    <CarouselContent>
                        <CarouselItem class="basis-1/3 2xl:basis-1/4">
                            <div class="flex flex-col h-full overflow-hidden border-2 rounded-lg border-primary">
                                <div class="p-2 text-base font-bold tracking-wide text-center text-white uppercase bg-primary md:p-3 md:text-sm">
                                    Rechercher un remplacement
                                </div>
                                <div class="flex flex-col flex-grow p-3 text-gray-700 bg-white md:p-5">
                                    <p class="mb-2 text-sm font-medium text-center md:mb-3 text-primary md:text-base">
                                        Rechercher un remplacement
                                    </p>
                                    <ul class="flex-grow mb-2 space-y-1 text-xs md:mb-4 md:text-sm">
                                        <li class="flex items-start">
                                            <span class="mr-1 font-bold text-primary md:mr-2">•</span>
                                            <span>Vous cherchez à complèter votre tournée.</span>
                                        </li>
                                    </ul>
                                    <div class="pt-2 md:pt-4">
                                        <NuxtLink to="/dashboard/replacements">
                                            <button class="w-full py-1 text-sm font-semibold text-white transition rounded bg-primary md:py-2 md:text-sm hover:bg-primary/90">
                                                Rechercher
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>

                        <CarouselItem class="basis-1/3 2xl:basis-1/4">
                            <div class="flex flex-col h-full overflow-hidden border-2 rounded-lg border-success">
                                <div class="p-2 text-base font-bold tracking-wide text-center text-white uppercase bg-success md:p-3 md:text-sm">
                                    Me faire remplacer
                                </div>
                                <div class="flex flex-col flex-grow p-3 text-gray-700 bg-white md:p-5">
                                    <p class="mb-2 text-sm font-medium text-center md:mb-3 text-success md:text-base">
                                        Me faire remplacer
                                    </p>
                                    <ul class="flex-grow mb-2 space-y-1 text-xs md:mb-4 md:text-sm">
                                        <li class="flex items-start">
                                            <span class="mr-1 font-bold text-success md:mr-2">•</span>
                                            <span>Vous voulez vous faire remplacer sur votre tournée ?</span>
                                        </li>
                                    </ul>
                                    <div class="pt-2 md:pt-4">
                                        <NuxtLink to="/dashboard/replacements/create">
                                            <button class="w-full py-1 text-sm font-semibold text-white transition rounded bg-success md:py-2 md:text-sm hover:bg-success/90">
                                                Demander
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>

                        <CarouselItem class="basis-1/3 2xl:basis-1/4">
                            <div class="flex flex-col h-full overflow-hidden border-2 border-indigo-600 rounded-lg">
                                <div class="p-2 text-base font-bold tracking-wide text-center text-white uppercase bg-indigo-600 md:p-3 md:text-sm">
                                    Voir les intéressés
                                </div>
                                <div class="flex flex-col flex-grow p-3 text-gray-700 bg-white md:p-5">
                                    <p class="mb-2 text-sm font-medium text-center text-indigo-600 md:mb-3 md:text-base">
                                        Candidats à mes remplacements
                                    </p>
                                    <ul class="flex-grow mb-2 space-y-1 text-xs md:mb-4 md:text-sm">
                                        <li class="flex items-start">
                                            <span class="mr-1 font-bold text-indigo-600 md:mr-2">•</span>
                                            <span>Consultez les utilisateurs ayant répondu positivement à vos offres de remplacement.</span>
                                        </li>
                                    </ul>
                                    <div class="pt-2 md:pt-4">
                                        <NuxtLink to="/dashboard/replacements/responses">
                                            <button class="w-full py-1 text-sm font-semibold text-white transition bg-indigo-600 rounded md:py-2 md:text-sm hover:bg-indigo-600/90">
                                                Consulter
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>

                        <CarouselItem class="basis-1/3 2xl:basis-1/4">
                            <div class="flex flex-col h-full overflow-hidden bg-orange-700 border-2 border-orange-700 rounded-lg">
                                <div class="p-2 text-base font-bold tracking-wide text-center text-white uppercase bg-orange-700 md:p-3 md:text-sm">
                                    Mes accords de remplacement
                                </div>
                                <div class="flex flex-col flex-grow p-3 text-gray-700 bg-white md:p-5">
                                    <p class="mb-2 text-sm font-medium text-center text-orange-700 md:mb-3 md:text-base">
                                        Accords de remplacement
                                    </p>
                                    <ul class="flex-grow mb-2 space-y-1 text-xs md:mb-4 md:text-sm">
                                        <li class="flex items-start">
                                            <span class="mr-1 font-bold text-orange-700 md:mr-2">•</span>
                                            <span>Accédez à la liste des remplacements où vous avez postulés.</span>
                                        </li>
                                    </ul>
                                    <div class="pt-2 md:pt-4">
                                        <NuxtLink to="/dashboard/replacements/applied">
                                            <button class="w-full py-1 text-sm font-semibold text-white transition bg-orange-700 rounded md:py-2 md:text-sm hover:bg-orange-700/90">
                                                Accéder
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious class="2xl:hidden" />
                    <CarouselNext class="2xl:hidden" />
                </Carousel>
            </div>

            <div class="relative mx-8 lg:hidden">
                <Carousel>
                    <CarouselContent>
                        <CarouselItem>
                            <div class="flex flex-col h-full overflow-hidden border-2 rounded-lg border-primary">
                                <div class="p-2 text-base font-bold tracking-wide text-center text-white uppercase bg-primary md:p-3 md:text-sm">
                                    Rechercher un remplacement
                                </div>
                                <div class="flex flex-col flex-grow p-3 text-gray-700 bg-white md:p-5">
                                    <p class="mb-2 text-sm font-medium text-center md:mb-3 text-primary md:text-base">
                                        Rechercher un remplacement
                                    </p>
                                    <ul class="flex-grow mb-2 space-y-1 text-xs md:mb-4 md:text-sm">
                                        <li class="flex items-start">
                                            <span class="mr-1 font-bold text-primary md:mr-2">•</span>
                                            <span>Vous cherchez à complèter votre tournée.</span>
                                        </li>
                                    </ul>
                                    <div class="pt-2 md:pt-4">
                                        <NuxtLink to="/dashboard/replacements">
                                            <button class="w-full py-1 text-sm font-semibold text-white transition rounded bg-primary md:py-2 md:text-sm hover:bg-primary/90">
                                                Rechercher
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div class="flex flex-col h-full overflow-hidden border-2 rounded-lg border-success">
                                <div class="p-2 text-base font-bold tracking-wide text-center text-white uppercase bg-success md:p-3 md:text-sm">
                                    Me faire remplacer
                                </div>
                                <div class="flex flex-col flex-grow p-3 text-gray-700 bg-white md:p-5">
                                    <p class="mb-2 text-sm font-medium text-center md:mb-3 text-success md:text-base">
                                        Me faire remplacer
                                    </p>
                                    <ul class="flex-grow mb-2 space-y-1 text-xs md:mb-4 md:text-sm">
                                        <li class="flex items-start">
                                            <span class="mr-1 font-bold text-success md:mr-2">•</span>
                                            <span>Vous voulez vous faire remplacer sur votre tournée ?</span>
                                        </li>
                                    </ul>
                                    <div class="pt-2 md:pt-4">
                                        <NuxtLink to="/dashboard/replacements/create">
                                            <button class="w-full py-1 text-sm font-semibold text-white transition rounded bg-success md:py-2 md:text-sm hover:bg-success/90">
                                                Demander
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div class="flex flex-col h-full overflow-hidden border-2 border-indigo-600 rounded-lg">
                                <div class="p-2 text-base font-bold tracking-wide text-center text-white uppercase bg-indigo-600 md:p-3 md:text-sm">
                                    Voir les intéressés
                                </div>
                                <div class="flex flex-col flex-grow p-3 text-gray-700 bg-white md:p-5">
                                    <p class="mb-2 text-sm font-medium text-center text-indigo-600 md:mb-3 md:text-base">
                                        Candidats à mes remplacements
                                    </p>
                                    <ul class="flex-grow mb-2 space-y-1 text-xs md:mb-4 md:text-sm">
                                        <li class="flex items-start">
                                            <span class="mr-1 font-bold text-indigo-600 md:mr-2">•</span>
                                            <span>Consultez les utilisateurs ayant répondu positivement à vos offres de remplacement.</span>
                                        </li>
                                    </ul>
                                    <div class="pt-2 md:pt-4">
                                        <NuxtLink to="/dashboard/replacements/responses">
                                            <button class="w-full py-1 text-sm font-semibold text-white transition bg-indigo-600 rounded md:py-2 md:text-sm hover:bg-indigo-600/90">
                                                Consulter
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div class="flex flex-col h-full overflow-hidden bg-orange-700 border-2 border-orange-700 rounded-lg">
                                <div class="p-2 text-base font-bold tracking-wide text-center text-white uppercase bg-orange-700 md:p-3 md:text-sm">
                                    Mes accords de remplacement
                                </div>
                                <div class="flex flex-col flex-grow p-3 text-gray-700 bg-white md:p-5">
                                    <p class="mb-2 text-sm font-medium text-center text-orange-700 md:mb-3 md:text-base">
                                        Accords de remplacement
                                    </p>
                                    <ul class="flex-grow mb-2 space-y-1 text-xs md:mb-4 md:text-sm">
                                        <li class="flex items-start">
                                            <span class="mr-1 font-bold text-orange-700 md:mr-2">•</span>
                                            <span>Accédez à la liste des remplacements où vous avez postulés.</span>
                                        </li>
                                    </ul>
                                    <div class="pt-2 md:pt-4">
                                        <NuxtLink to="/dashboard/replacements/applied">
                                            <button class="w-full py-1 text-sm font-semibold text-white transition bg-orange-700 rounded md:py-2 md:text-sm hover:bg-orange-700/90">
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
        </section>

        <section class="flex flex-col items-stretch w-full lg:flex-row gap-6">
            <div class="w-full bg-white rounded-lg shadow-lg lg:w-1/2">
                <div class="p-4 bg-gray-100 rounded">
                    <div class="flex items-center justify-between text-primary">
                        <h2>
                            Mes préférences
                        </h2>
                        <Button
                            variant="none"
                            class="mt-2 text-xs font-bold"
                            @click="proposalDialog = true"
                        >
                            Boost IA
                        </Button>
                    </div>
                    <div class="sm:mt-4">
                        <InputPreferences
                            :initial-zip-codes="zipCodes"
                            :initial-cities="cities"
                            @update:initial-zip-codes="updateZipCodes"
                            @update:initial-cities="updateCities"
                            @open-proposal="openProposalDialog"
                        />
                    </div>

                    <ProposalLocationModal
                        v-model="proposalDialog"
                        v-model:newly-added-value="newlyAddedValue"
                        title="Préférences"
                        description="Sélectionnez uniquement les codes postaux/villes que vous souhaitez conserver parmi ceux déjà cochés pour l'encodage de vos préférences"
                        :initial-zip-codes="zipCodes"
                        :initial-cities="cities"
                        :is-preference-mode="true"
                        @update:initial-zip-codes="updateZipCodes"
                        @update:initial-cities="updateCities"
                    />

                    <div class="relative block sm:grid sm:grid-cols-[40%_60%] sm:border sm:border-primary sm:h-9 sm:rounded-full mt-16 sm:mt-4 overflow-hidden">
                        <div class="flex flex-col mb-4 sm:bg-primary sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                            <label class="ml-3 font-semibold sm:ml-0 text-primary sm:font-normal sm:text-white">
                                <span>Rayon de recherche</span>
                            </label>
                        </div>

                        <div class="relative flex items-center -mt-1 border border-gray-400 rounded-full sm:mt-0 focus-within:border-primary sm:border-none sm:rounded-none">
                            <InputIcon
                                v-model="radiusInput"
                                type="number"
                                title="Appuyer sur l'icône pour valider"
                                class="w-full h-2 pr-10 text-sm bg-transparent border-none rounded sm:h-8 indent-3"
                                min="1"
                            />

                            <button
                                class="absolute transition top-2 right-4 sm:right-2 text-primary hover:text-green-600"
                                @click="onUpdateRadius"
                            >
                                <CheckIcon class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col w-full bg-white rounded-lg shadow-lg">
                    <div class="p-5 mt-8 bg-gray-200 rounded">
                        <UserIcon class="w-8 opacity-80 " />
                    </div>
                    <div class="p-4">
                        <h3 class="text-sm text-gray-900">
                            Nombre d'affiliés à votre compte
                        </h3>
                        <p class="text-3xl font-bold text-primary">
                            {{ reports?.referrals }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="w-full bg-white rounded-lg shadow-lg lg:w-1/2">
                <h3 class="p-3 text-white rounded-t-lg bg-primary">
                    Nombres d'annonces auxquelles j'ai répondu sur InfiSwap par mois
                </h3>
                <div v-if="loading">
                    <Skeleton class="h-64 m-8 bg-gray-200" />
                </div>
                <div
                    v-else
                    class="p-4"
                >
                    <ClientOnly>
                        <LineChart
                            :data="formattedData"
                            index="month"
                            :categories="['annonces']"
                            :colors="['hsl(var(--primary))']"
                            :y-formatter="(tick) => `${tick}`"
                        />
                    </ClientOnly>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import {
    CheckIcon,
    UserIcon,
} from '@heroicons/vue/24/outline';
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
    referrals: number;
    reponded_per_month: MonthlyReport[];
};

const props = defineProps<{
    reports: NurseReport;
    tours: Patient[];
}>();

const loading = ref(true);
const { updateRadiusKm } = useAuth();
const user = useUser();
const proposalDialog = ref(false);
const newlyAddedValue = ref<string>('');

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

const radiusKm = computed(() => {
    const settings: UserSettings = JSON.parse(user.value.settings || '{}');
    return settings.radius_km ?? '5';
});

const radiusInput = ref(Number(radiusKm.value));

const onUpdateRadius = async () => {
    await updateRadiusKm(radiusInput.value);
};

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

const openProposalDialog = (value: string) => {
    newlyAddedValue.value = value;
    proposalDialog.value = true;
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

onMounted(() => {
    loading.value = false;
});
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
