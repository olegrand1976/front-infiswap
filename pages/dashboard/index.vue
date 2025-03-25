<template>
    <div class="space-y-6">
        <section class="grid grid-cols-1 items-center gap-4 mt-4">
            <div class="bg-gray-100 rounded-b-lg">
                <div class="bg-primary h-8 rounded-t-lg" />

                <div class="p-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    <div>
                        <h4 class="text-primary font-semibold">
                            Remplacement(s) effectué(s)
                        </h4>
                        <div class="border-2 border-gray-200 rounded p-4 my-3">
                            <h6 class="flex items-center space-x-4 text-sm">
                                <span>Le dernier mois</span>
                                <span class="text-primary">{{ previousMonth }}</span>
                            </h6>
                            <div class="flex justify-center items-center gap-3 mt-3">
                                <p class="text-5xl font-semibold text-primary text-center">
                                    {{ reports.replacement.done.count }}
                                </p>

                                <!-- <div class="w-20 h-20 text-3xl flex items-center justify-center font-bold">
                                    {{ reports.replacement.done.percentage }}%
                                </div> -->
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 class="text-primary font-semibold">
                            Nombre d'annonce(s) passée(s)
                        </h4>
                        <div class="border-2 border-gray-200 rounded p-4 my-3">
                            <h6 class="flex items-center space-x-4 text-sm">
                                <span>Le dernier mois</span>
                                <span class="text-primary">{{ previousMonth }}</span>
                            </h6>
                            <div class="flex justify-center items-center gap-3 mt-3">
                                <p class="text-5xl font-semibold text-primary text-center">
                                    {{ reports.replacement.ignored.count }}
                                </p>
                                <!-- <div class="w-20 h-20 text-3xl flex items-center justify-center font-bold">
                                    {{ reports.replacement.ignored.percentage }}%
                                </div> -->
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 class="text-primary font-semibold">
                            Réponse(s) en attente(s)
                        </h4>
                        <div class="border-2 border-gray-200 rounded p-4 my-3">
                            <h6 class="flex items-center space-x-4 text-sm">
                                <span>Le dernier mois</span>
                                <span class="text-primary">{{ previousMonth }}</span>
                            </h6>
                            <div class="flex justify-center items-center gap-3 mt-3">
                                <p class="text-5xl font-semibold text-primary text-center">
                                    {{ reports.replacement.pending.count }}
                                </p>
                                <!-- <div class="w-20 h-20 text-3xl flex items-center justify-center font-bold">
                                    {{ reports.replacement.pending.percentage }}%
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- <div class="bg-gray-100 h-full rounded-b-lg">
                <h2 class="bg-primary text-white p-3 rounded-t-lg">
                    Bénéfices
                </h2>
                <div class="flex items-center p-4 justify-center">
                    <p class="font-bold mt-12 text-4xl text-gray-600/50">
                        8000 €
                    </p>
                </div>
            </div> -->
        </section>

        <section class="grid grid-cols-1 xl:grid-cols-[45%_53%] gap-4">
            <div class="flex flex-col space-y-4">
                <div class="bg-gray-100 rounded p-4">
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

                        <div class="grid grid-cols-1 mb-16 sm:mb-0 sm:grid-cols-[40%_60%] sm:border sm:border-primary h-9 sm:rounded-full">
                            <div class="sm:bg-primary sm:w-full flex items-center text-primary sm:text-white ps-4 rounded-s-full">
                                <label
                                    class="font-semibold sm:font-normal mt-10 sm:mt-0 mb-3 sm:mb-0"
                                >
                                    Remplacement ponctuel
                                </label>
                            </div>
                            <TagsInput
                                class="h-9 bg-transparent flex flex-nowrap xl:ml-[4.5rem] 2xl:ml-0 border sm:border-none border-primary rounded-full"
                                disabled
                            >
                                <div class="flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar">
                                    <TagsInputItem
                                        v-for="item in replaces"
                                        :key="item"
                                        :value="item"
                                        class="-mt-1"
                                    >
                                        <TagsInputItemText class="text-xs" />
                                        <TagsInputItemDelete />
                                    </TagsInputItem>
                                </div>

                                <TagsInputInput
                                    class="-mt-1 sm:w-24 2xl:w-auto"
                                />
                            </TagsInput>
                        </div>

                        <div class="grid grid-cols-1 mb-32 sm:mb-0 sm:grid-cols-[40%_60%] sm:border sm:border-primary h-9 sm:rounded-full">
                            <div class="sm:bg-primary sm:w-full flex items-center text-primary sm:text-white ps-4 rounded-s-full">
                                <label
                                    class="font-semibold sm:font-normal mt-24 sm:mt-0 mb-3 sm:mb-0"
                                >
                                    Remplacement long terme
                                </label>
                            </div>
                            <TagsInput
                                class="h-9 bg-transparent flex flex-nowrap xl:ml-[4.5rem] 2xl:ml-0 border sm:border-none border-primary rounded-full"
                                disabled
                            >
                                <div class="flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar">
                                    <TagsInputItem
                                        v-for="item in replacems"
                                        :key="item"
                                        :value="item"
                                        class="-mt-1"
                                    >
                                        <TagsInputItemText class="text-xs" />
                                        <TagsInputItemDelete />
                                    </TagsInputItem>
                                </div>

                                <TagsInputInput
                                    class="-mt-1 sm:w-24 2xl:w-auto"
                                />
                            </TagsInput>
                        </div>
                    </form>
                </div>

                <div class="bg-gray-100 rounded-b-lg">
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

            <div class="bg-gray-100 rounded p-4">
                <h3 class="text-primary">
                    Tournée du jour
                </h3>

                <div class="my-3">
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
                            <template v-if="reports.tours != 0">
                                <div
                                    v-for="(tournee, index) in reports.tours"
                                    :key="index"
                                >
                                    <TableRow class="cursor-pointer grid grid-cols-3 gap-0 border border-gray-300">
                                        <TableCell class="w-[13rem] p-3 text-center bg-gray-100">
                                            <div class="flex h-10 justify-center items-center bg-gray-200">
                                                <span class="truncate w-full px-2 text-center">
                                                    {{ tournee.lastname }} {{ tournee.firstname }}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell class="w-[13rem] p-3 text-center bg-gray-100">
                                            <div class="flex h-10 justify-center items-center bg-gray-200">
                                                <span class="truncate w-full px-2 text-center">
                                                    {{ tournee.profile.zip_code }}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell class="w-[13rem] p-3 text-center bg-gray-100">
                                            <div class="flex h-10 justify-center items-center bg-gray-200">
                                                <span class="truncate w-full px-2 text-center">
                                                    {{ tournee.profile.city }}
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
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { LineChart } from '@/components/ui/chart-line';
import {
    TagsInput,
    TagsInputInput,
    TagsInputItem,
    TagsInputItemDelete,
    TagsInputItemText,
} from '@/components/ui/tags-input';

import { useReports } from '~/composables/useReports';

const user = useState('user');

const { getReports, createPreferences } = useReports();

const reports = await getReports();

const replaces = [];
const replacems = [];

const formatDate = (dateString: string) => {
    const [year, month] = dateString.split('-');
    return `${month}/${year}`;
};

const formattedData = computed(() => {
    return reports.replacement.reponded_per_month.map(item => ({
        month: formatDate(item.month),
        annonces: item.count,
    }));
});

const zipCodes = ref<string[]>([]);
const cities = ref<string[]>([]);

const addCityPreference = async (newCity: string) => {
    if (!newCity || cities.value.includes(newCity)) return;

    newCity = cities.value[cities.value.length - 1].trim();

    const formData = reactive({
        key: 'replacement',
        value: {
            zip_codes: zipCodes.value,
            cities: cities.value,
        },
    });

    await createPreferences(formData);
};

const addZipCodePreference = async (newZipCode: string) => {
    if (!newZipCode || zipCodes.value.includes(newZipCode)) return;

    newZipCode = zipCodes.value[zipCodes.value.length - 1].trim();

    const formData = reactive({
        key: 'replacement',
        value: {
            zip_codes: zipCodes.value,
            cities: cities.value,
        },
    });

    await createPreferences(formData);
};

const removeZipCode = async (zipCode: string) => {
    zipCodes.value = zipCodes.value.filter(code => code !== zipCode);

    const formData = reactive({
        key: 'replacement',
        value: {
            zip_codes: zipCodes.value,
            cities: cities.value,
        },
    });

    await createPreferences(formData);
};

const removeCity = async (city: string) => {
    cities.value = cities.value.filter(c => c !== city);

    const formData = reactive({
        key: 'replacement',
        value: {
            zip_codes: zipCodes.value,
            cities: cities.value,
        },
    });

    await createPreferences(formData);
};

const previousMonth = ref('');

onMounted(async () => {
    await getReports();

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const months = [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
    ];

    const previousMonthIndex = (currentMonth - 1 + 12) % 12;
    previousMonth.value = months[previousMonthIndex];

    const settings = JSON.parse(user.value.settings);

    zipCodes.value = settings.replacement?.zip_codes;
    cities.value = settings.replacement?.cities;
});

useHead({
    title: 'Tableau de bord',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
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
