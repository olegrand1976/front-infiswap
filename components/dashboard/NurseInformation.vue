<template>
    <div class="space-y-6">
        <section class="grid grid-cols-1 items-center gap-4">
            <NurstechPresentation />

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
                    <CarouselPrevious class="2xl:hidden" />
                    <CarouselNext class="2xl:hidden" />
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
        </section>

        <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="grid">
                <div class="bg-gray-100 rounded p-4 mb-4">
                    <div class="text-primary flex justify-between items-center">
                        <h2>
                            Mes préférences
                        </h2>
                        <Button
                            variant="none"
                            class="font-bold text-xs mt-2"
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
                        <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full mb-4">
                            <label class="ml-3 sm:ml-0 text-primary font-semibold sm:font-normal sm:text-white">
                                <span>Rayon de recherche</span>
                            </label>
                        </div>

                        <div class="-mt-1 sm:mt-0 relative flex items-center border border-gray-400 focus-within:border-primary rounded-full sm:border-none sm:rounded-none">
                            <InputIcon
                                v-model="radiusInput"
                                type="number"
                                title="Appuyer sur l'icône pour valider"
                                class="text-sm h-2 sm:h-8 indent-3 bg-transparent border-none rounded w-full pr-10"
                                min="1"
                            />

                            <button
                                class="absolute top-2 right-4 sm:right-2 text-primary hover:text-green-600 transition"
                                @click="onUpdateRadius"
                            >
                                <CheckIcon class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-100 flex gap-6 items-center rounded p-4">
                    <div class="bg-gray-200 p-4 rounded">
                        <UserIcon class="w-8 opacity-80" />
                    </div>
                    <div>
                        <h3 class="text-sm text-gray-900">
                            Nombre d'affiliés à votre compte
                        </h3>
                        <p class="text-3xl font-bold text-primary">
                            {{ reports.referrals }}
                        </p>
                    </div>
                </div>
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
