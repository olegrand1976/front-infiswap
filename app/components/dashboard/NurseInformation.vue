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
                                <div class="flex flex-col grow p-3 text-gray-700 bg-white md:p-5">
                                    <p class="mb-2 text-sm font-medium text-center md:mb-3 text-primary md:text-base">
                                        Rechercher un remplacement
                                    </p>
                                    <ul class="grow mb-2 space-y-1 text-xs md:mb-4 md:text-sm">
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
                                <div class="flex flex-col grow p-3 text-gray-700 bg-white md:p-5">
                                    <p class="mb-2 text-sm font-medium text-center md:mb-3 text-success md:text-base">
                                        Me faire remplacer
                                    </p>
                                    <ul class="grow mb-2 space-y-1 text-xs md:mb-4 md:text-sm">
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
                                <div class="flex flex-col grow p-3 text-gray-700 bg-white md:p-5">
                                    <p class="mb-2 text-sm font-medium text-center text-indigo-600 md:mb-3 md:text-base">
                                        Candidats à mes remplacements
                                    </p>
                                    <ul class="grow mb-2 space-y-1 text-xs md:mb-4 md:text-sm">
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
                                <div class="flex flex-col grow p-3 text-gray-700 bg-white md:p-5">
                                    <p class="mb-2 text-sm font-medium text-center text-orange-700 md:mb-3 md:text-base">
                                        Accords de remplacement
                                    </p>
                                    <ul class="grow mb-2 space-y-1 text-xs md:mb-4 md:text-sm">
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
                                <div class="flex flex-col grow p-3 text-gray-700 bg-white md:p-5">
                                    <p class="mb-2 text-sm font-medium text-center md:mb-3 text-primary md:text-base">
                                        Rechercher un remplacement
                                    </p>
                                    <ul class="grow mb-2 space-y-1 text-xs md:mb-4 md:text-sm">
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
                                <div class="flex flex-col grow p-3 text-gray-700 bg-white md:p-5">
                                    <p class="mb-2 text-sm font-medium text-center md:mb-3 text-success md:text-base">
                                        Me faire remplacer
                                    </p>
                                    <ul class="grow mb-2 space-y-1 text-xs md:mb-4 md:text-sm">
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
                                <div class="flex flex-col grow p-3 text-gray-700 bg-white md:p-5">
                                    <p class="mb-2 text-sm font-medium text-center text-indigo-600 md:mb-3 md:text-base">
                                        Candidats à mes remplacements
                                    </p>
                                    <ul class="grow mb-2 space-y-1 text-xs md:mb-4 md:text-sm">
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
                                <div class="flex flex-col grow p-3 text-gray-700 bg-white md:p-5">
                                    <p class="mb-2 text-sm font-medium text-center text-orange-700 md:mb-3 md:text-base">
                                        Accords de remplacement
                                    </p>
                                    <ul class="grow mb-2 space-y-1 text-xs md:mb-4 md:text-sm">
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
            <div class="w-full bg-gray-100 rounded-lg shadow-lg lg:w-1/2">
                <div class="p-4 rounded">
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

                    <p class="hidden mt-4 text-sm text-gray-600 2xl:block">
                        Entrez vos codes postaux et villes préférés afin de personnaliser vos résultats. Vous pouvez ajuster vos préférences à tout moment pour que les suggestions correspondent exactement à vos besoins.
                    </p>

                    <div class="sm:mt-4 2xl:mt-6">
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

                    <p class="hidden mt-8 text-sm text-gray-600 2xl:block">
                        Indiquez la distance autour de votre localisation pour vos recherches.
                    </p>

                    <div class="relative block sm:grid sm:grid-cols-[40%_60%] sm:border sm:border-primary sm:h-9 sm:rounded-full mt-8 sm:mt-8 2xl:mt-6 overflow-hidden">
                        <div class="flex flex-col mb-4 sm:bg-primary sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                            <label class="ml-3 font-semibold sm:ml-0 text-primary sm:font-normal sm:text-white">
                                <span>Rayon de recherche</span>
                            </label>
                        </div>

                        <div class="relative flex items-center -mt-1 border border-gray-400 rounded-full sm:-mt-0 focus-within:border-primary sm:border-none sm:rounded-none">
                            <InputIcon
                                v-model="radiusInput"
                                type="number"
                                title="Appuyer sur l'icône pour valider"
                                class="w-full h-2 pr-10 text-sm bg-transparent border-none sm:h-8 rounded indent-3"
                                :input-class="true"
                                min="1"
                            />

                            <button
                                class="absolute transition top-2 right-4 sm:right-2 text-primary hover:text-green-600"
                                @click="onUpdateRadius"
                            >
                                <Check class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-full lg:w-1/2 space-y-8">
                <div class="flex flex-col w-full bg-white rounded-lg shadow-lg">
                    <div class="p-5 bg-gray-200 rounded">
                        <User class="w-8 opacity-80 " />
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

                <div class=" bg-white rounded-lg shadow-lg ">
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
                                :colors="['var(--primary)']"
                                :y-formatter="(tick) => `${tick}`"
                            />
                        </ClientOnly>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <Dialog v-model:open="configDialog">
        <DialogContent class="max-w-2xl h-[60vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle class="text-xl text-primary">
                    Préférences de recherche
                </DialogTitle>
            </DialogHeader>

            <div class="space-y-6 mt-4">
                <div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700">
                            Quel rayon de recherche préférez-vous ?
                        </label>

                        <InputIcon
                            v-model="formData.radiusKm"
                            :icon="Map"
                            class="w-full"
                            size="md"
                            :placeholder="'5 km'"
                        />

                        <label class="text-[0.65rem]"> Ce rayon s’applique aux recherches de remplacement autour de vos codes postaux préférés.</label>
                    </div>
                </div>

                <div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700">
                            Quels sont vos préférences pour une remplacement ?
                        </label>

                        <div class="hidden lg:flex space-x-4">
                            <div class="flex-1">
                                <InputTagManager
                                    v-model="formData.zipCodesArray"
                                    :icon="Inbox"
                                    label="Codes postaux *"
                                    :placeholder="formData.zipCodesArray.length === 0 ? 'Codes postaux *' : 'Codes postaux *'"
                                    :is-mobile="false"
                                    :comma-validation="false"
                                    @keydown.enter.prevent
                                />
                            </div>

                            <div class="flex-1">
                                <InputTagManager
                                    v-model="formData.citiesArray"
                                    :icon="Building2"
                                    label="Villes associées"
                                    :placeholder="formData.citiesArray.length === 0 ? 'Villes' : 'Villes'"
                                    :is-mobile="false"
                                    :comma-validation="true"
                                    :no-space-validation="true"
                                    @keydown.enter.prevent
                                />
                            </div>
                        </div>
                        <div class="block lg:hidden">
                            <div class="flex-1">
                                <InputTagManager
                                    v-model="formData.zipCodesArray"
                                    :icon="Inbox"
                                    label="Codes postaux *"
                                    :placeholder="formData.zipCodesArray.length === 0 ? 'Codes postaux *' : 'Codes postaux *'"
                                    :is-mobile="true"
                                    :comma-validation="false"
                                    @keydown.enter.prevent
                                />
                            </div>

                            <div class="flex-1">
                                <InputTagManager
                                    v-model="formData.citiesArray"
                                    :icon="Building2"
                                    label="Villes"
                                    :placeholder="formData.citiesArray.length === 0 ? 'Villes' : 'Villes'"
                                    :is-mobile="true"
                                    :comma-validation="true"
                                    :no-space-validation="true"
                                    @keydown.enter.prevent
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700">
                            Comment nous avez-vous connu ?
                        </label>

                        <div class="relative w-full">
                            <div class="pointer-events-none absolute top-2 left-2 flex items-center text-primary">
                                <CircleHelp class="w-6 h-6" />
                            </div>

                            <select
                                v-model="selectedReferral"
                                class="w-full appearance-none rounded-full border border-gray-300 py-2 px-4 pl-10 pr-10 text-sm bg-white text-gray-600"
                            >
                                <option
                                    disabled
                                    value=""
                                >
                                    Sélectionnez une option
                                </option>
                                <option
                                    v-for="option in referral_source"
                                    :key="option.value"
                                    :value="option.value"
                                >
                                    {{ option.label }}
                                </option>
                            </select>

                            <div class="pointer-events-none absolute top-3 right-3 flex items-center text-primary">
                                <svg
                                    class="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>

                        <InputIcon
                            v-if="formData.referralSource.startsWith('other:')"
                            :value="formData.referralSource.replace(/^other:/, '')"
                            placeholder="Veuillez préciser"
                            :icon="EllipsisHorizontalCircleIcon"
                            class="w-full"
                            @input="event => formData.referralSource = `other:${event.target.value}`"
                        />
                    </div>
                </div>
            </div>

            <DialogFooter class="my-6 flex flex-col items-center sm:flex-row gap-4 sm:space-x-4">
                <Button
                    variant="secondary"
                    class="w-full sm:w-auto"
                    @click="configDialog = false"
                >
                    <span class="mt-2">Annuler</span>
                </Button>
                <Button
                    class="w-full sm:w-auto"
                    @click="handleSetPreference"
                >
                    <span class="mt-2">Enregistrer</span>
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Building2, Check, CircleHelp, Inbox, Map, User } from 'lucide-vue-next';
import { LineChart } from '@/components/ui/chart-line';
import InputPreferences from '@/components/InputPreferences.vue';
import InputTagManager from '~/components/InputTagManager.vue';
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
const { updateRadiusKm, createPreferences, refresh } = useAuth();
const user = useUser();
const proposalDialog = ref(false);
const newlyAddedValue = ref<string>('');
const configDialog = ref(false);
const { $toast } = useNuxtApp();

const arePreferencesEmpty = () => {
    if (!user.value?.settings) return true;

    try {
        const settings: UserSettings = JSON.parse(user.value.settings || '{}');

        const hasZipCodes = settings.replacement?.zip_codes?.filter(Boolean).length > 0;
        const hasCities = settings.replacement?.cities?.filter(Boolean).length > 0;
        const hasReferral = user.value.referral_source !== '';

        return !(hasZipCodes && hasCities && hasReferral);
    }
    catch {
        return true;
    }
};

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

const referral_source = [
    {
        label: 'Publicité Facebook',
        value: 'facebook_ads',
    },
    {
        label: 'Post page Infiswap',
        value: 'infiswap_post',
    },
    {
        label: 'Communication forum infirmière',
        value: 'nurse_forum',
    },
    {
        label: 'Moteur de recherche',
        value: 'search_engine',
    },
    {
        label: 'Bouche à oreille',
        value: 'word_of_mouth',
    },
    {
        label: 'Autres',
        value: 'other:',
    },
];

const selectedReferral = computed({
    get() {
        return formData.referralSource.startsWith('other:') ? 'other:' : formData.referralSource;
    },
    set(val) {
        formData.referralSource = val;
    },
});

const formData = reactive({
    referralSource: user.value.referral_source ?? '',
    zipCodesArray: [],
    citiesArray: [],
    radiusKm: '',
});

watch(configDialog, (isOpen) => {
    if (isOpen) {
        const settings = user.value?.settings ? JSON.parse(user.value.settings) : {};
        formData.zipCodesArray = settings.replacement?.zip_codes || [];
        formData.citiesArray = settings.replacement?.cities || [];
        formData.radiusKm = settings.radius_km || 5;
        formData.referralSource = user.value.referral_source || '';
    }
});

const handleSetPreference = async () => {
    try {
        if (formData.referralSource) {
            await useAuth().updateField(user.value.id, { referral_source: formData.referralSource });
        }

        await createPreferences({
            key: 'replacement',
            value: {
                zip_codes: formData.zipCodesArray,
                cities: formData.citiesArray,
            },
        });

        await updateRadiusKm(Number(formData.radiusKm));
        await refresh();

        zipCodes.value = [...formData.zipCodesArray];
        cities.value = [...formData.citiesArray];

        $toast({ description: 'Préférences enregistrées avec succès' });
        configDialog.value = false;
    }
    catch {
        $toast({ variant: 'destructive', description: 'Erreur lors de l’enregistrement' });
    }
};

onMounted(() => {
    loading.value = false;

    nextTick(() => {
        if (arePreferencesEmpty()) {
            configDialog.value = true;
        }
    });
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
