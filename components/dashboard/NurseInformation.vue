<template>
    <div class="space-y-6">
        <section class="grid grid-cols-1 items-center gap-4">
            <div class="bg-gray-100 rounded-b-lg">
                <div class="bg-primary h-6 rounded-t-lg" />

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

                    <form class="mt-6 space-y-4">
                        <div class="grid grid-cols-1 mb-16 sm:mb-0 sm:grid-cols-[40%_60%] sm:border sm:border-primary h-9 sm:rounded-full">
                            <div class="sm:bg-primary sm:w-full flex items-center text-primary sm:text-white ps-4 rounded-s-full">
                                <label
                                    class="font-semibold sm:font-normal mb-3 sm:mb-0"
                                    for="zipCode"
                                >
                                    Codes postaux
                                </label>
                            </div>
                            <TagsInput
                                v-model="zipCodes"
                                class="h-9 bg-transparent flex flex-nowrap xl:ml-[4.5rem] 2xl:ml-0 border sm:border-none border-primary rounded-full"
                                @keyup.enter="addZipCodePreference"
                            >
                                <div class="flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar">
                                    <TagsInputItem
                                        v-for="item in zipCodes"
                                        :key="item"
                                        :value="item"
                                        class="-mt-1"
                                    >
                                        <TagsInputItemText class="text-xs" />
                                        <TagsInputItemDelete @click="removeZipCode(item)" />
                                    </TagsInputItem>
                                </div>

                                <TagsInputInput
                                    class="-mt-1 sm:w-24 2xl:w-auto"
                                    placeholder="8973"
                                />
                            </TagsInput>
                        </div>

                        <div class="grid grid-cols-1 mb-16 sm:mb-0 sm:grid-cols-[40%_60%] sm:border sm:border-primary h-9 sm:rounded-full">
                            <div class="sm:bg-primary sm:w-full flex items-center text-primary sm:text-white ps-4 rounded-s-full">
                                <label
                                    class="font-semibold sm:font-normal mb-3 sm:mb-0"
                                    for="zipCode"
                                >
                                    Villes
                                </label>
                            </div>
                            <TagsInput
                                v-model="cities"
                                class="h-9 bg-transparent flex flex-nowrap xl:ml-[4.5rem] 2xl:ml-0 border sm:border-none border-primary rounded-full"
                                @keyup.enter="addCityPreference"
                            >
                                <div class="flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar">
                                    <TagsInputItem
                                        v-for="item in cities"
                                        :key="item"
                                        :value="item"
                                        class="-mt-1"
                                    >
                                        <TagsInputItemText class="text-xs" />
                                        <TagsInputItemDelete @click="removeCity(item)" />
                                    </TagsInputItem>
                                </div>

                                <TagsInputInput
                                    class="-mt-1 sm:w-24 2xl:w-auto"
                                    placeholder="Bruxelles"
                                />
                            </TagsInput>
                        </div>
                    </form>
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
                            <TableRow class="grid grid-cols-3 gap-0 border-gray-300">
                                <TableHead
                                    class="w-[13rem] p-3 text-center flex h-10 justify-center items-center bg-primary text-white"
                                >
                                    Patient
                                </TableHead>
                                <TableHead
                                    class="w-[13rem] p-3 text-center flex h-10 justify-center items-center bg-primary text-white"
                                >
                                    Code postal
                                </TableHead>
                                <TableHead
                                    class="w-[13rem] p-3 text-center flex h-10 justify-center items-center bg-primary text-white"
                                >
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
                                    <TableRow class="cursor-pointer grid grid-cols-3 gap-0 border border-gray-300">
                                        <TableCell class="w-[13rem] p-3 text-center bg-gray-100">
                                            <div class="flex h-10 justify-center items-center bg-gray-200">
                                                <span class="truncate w-full px-2 text-center">
                                                    {{ tour.lastname }} {{ tour.firstname }}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell class="w-[13rem] p-3 text-center bg-gray-100">
                                            <div class="flex h-10 justify-center items-center bg-gray-200">
                                                <span class="truncate w-full px-2 text-center">
                                                    {{ tour.profile.zip_code }}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell class="w-[13rem] p-3 text-center bg-gray-100">
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
                                        Enregistrer votre tournée sur InfiSwap pour bénéficier de toutes les
                                        fonctionnalités
                                    </Button>
                                </p>
                            </template>
                        </TableBody>
                    </Table>
                </div>

                <div class="sm:hidden my-4">
                    <template
                        v-if="props.tours.length !== 0"
                    >
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
                                Enregistrer votre tournée sur InfiSwap pour bénéficier de toutes les
                                fonctionnalités
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

import {
    TagsInput,
    TagsInputInput,
    TagsInputItem,
    TagsInputItemDelete,
    TagsInputItemText,
} from '@/components/ui/tags-input';

import { useReports } from '~/composables/useReports';
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

const { createPreferences } = useReports();

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

const addCityPreference = async (newCity: string) => {
    if (!newCity || cities.value.includes(newCity)) return;

    newCity = cities.value[cities.value.length - 1].trim();

    const formData = {
        key: 'replacement',
        value: {
            zip_codes: zipCodes.value,
            cities: cities.value,
        },
    };

    await createPreferences(formData);
};

const addZipCodePreference = async (newZipCode: string) => {
    if (!newZipCode || zipCodes.value.includes(newZipCode)) return;

    newZipCode = zipCodes.value[zipCodes.value.length - 1].trim();

    const formData = {
        key: 'replacement',
        value: {
            zip_codes: zipCodes.value,
            cities: cities.value,
        },
    };

    await createPreferences(formData);
};

const removeZipCode = async (zipCode: string) => {
    zipCodes.value = zipCodes.value.filter(code => code !== zipCode);

    const formData = {
        key: 'replacement',
        value: {
            zip_codes: zipCodes.value,
            cities: cities.value,
        },
    };

    await createPreferences(formData);
};

const removeCity = async (city: string) => {
    cities.value = cities.value.filter(c => c !== city);

    const formData = {
        key: 'replacement',
        value: {
            zip_codes: zipCodes.value,
            cities: cities.value,
        },
    };

    await createPreferences(formData);
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
