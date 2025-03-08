<template>
    <div>
        <div class="bg-gray-100 flex px-9 rounded-lg items-center w-full h-12">
            <h1 class="text-primary">
                Liste des
                <strong>
                    remplacements
                </strong>
            </h1>
        </div>

        <div class="flex justify-between mt-6">
            <Form
                class="flex justify-between xl:space-x-52 lg:space-x-4"
            >
                <div class="flex space-x-4">
                    <FormField name="days">
                        <FormItem>
                            <FormControl>
                                <div class="flex bg-primary space-x-3 rounded-full items-center justify-between ps-3 pe-1">
                                    <h5 class="text-white text-xs">
                                        Jours
                                    </h5>
                                    <Select>
                                        <SelectTrigger
                                            class="bg-white my-0.5 w-36 rounded-full flex space-x-1 lg:space-x-2 border border-none lg:text-sm md:text-xs"
                                            position="right"
                                        >
                                            <SelectValue
                                                :placeholder="selectedDaysPlaceholder"
                                                class="text-xs w-[200%] truncate"
                                            />
                                        </SelectTrigger>

                                        <SelectContent class="border border-none">
                                            <SelectGroup class="w-32">
                                                <div
                                                    v-for="(day, index) in days"
                                                    :key="index"
                                                    class="flex items-center space-2 mb-2"
                                                >
                                                    <Checkbox
                                                        class="mr-2"
                                                        :checked="formData.selectedDays.includes(day)"
                                                        @update:checked="toggleDay(day)"
                                                    />
                                                    <label class="text-xs">{{ frenchDays[day] }}</label>
                                                </div>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <FormField name="postalCode">
                        <FormItem>
                            <FormControl>
                                <div class="flex space-x-3 bg-primary rounded-full items-center justify-between ps-3 pe-1">
                                    <h5 class="text-white text-xs">
                                        Codes postaux
                                    </h5>
                                    <Input
                                        v-model="formData.postalCode"
                                        placeholder="1000,7687,5455"
                                        class="w-32 text-xs my-0.5 rounded-full"
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <FormField name="city">
                        <FormItem>
                            <FormControl>
                                <Input
                                    v-model="formData.cities"
                                    placeholder="Ville"
                                    class="w-32 text-xs my-0.5 rounded-full bg-gray-100 shadow"
                                />
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <Button
                        class="text-sm bg-primary"
                        @click="submit"
                    >
                        <MagnifyingGlassIcon class="w-6" />
                        Rechercher
                    </Button>
                </div>
            </Form>

            <div>
                <Button
                    class="text-sm"
                    href="/dashboard/replacement/create"
                >
                    Créer remplacement
                </Button>
            </div>
        </div>

        <div class="grid my-8">
            <Table>
                <TableHeader class="w-full">
                    <TableRow class="grid grid-cols-6 overflow-x-hidden gap-2 border border-none">
                        <TableHead class="bg-primary xl:col-span-1 lg:col-span-[1.5] flex justify-center items-center rounded-lg text-white text-xs">
                            Jour
                        </TableHead>
                        <TableHead class="bg-primary grid grid-cols-3 justify-center items-center rounded-lg text-white text-xs">
                            <span>Matin</span>
                            <span>Midi</span>
                            <span>Soir</span>
                        </TableHead>
                        <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                            Codes postaux
                        </TableHead>
                        <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                            Ville
                        </TableHead>
                        <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                            Type de soin
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <template
                        v-for="replacement in replacements.data"
                        :key="replacement.id"
                    >
                        <TableRow class="grid grid-cols-6 gap-2 border border-none overflow-x-hidden">
                            <TableCell class="flex justify-center items-center bg-gray-100 xl:text-[0.75em] lg:text-[0.5em]">
                                <div class="flex h-8 py-1 px-2 rounded bg-gray-200 justify-center items-center">
                                    <span>{{ formatDate(replacement.start_date) }}</span>
                                </div>
                                <span class="flex items-center">au</span>
                                <div class="flex h-8 py-1 px-2 rounded bg-gray-200 justify-center items-center">
                                    <span>{{ formatDate(replacement.end_date) }}</span>
                                </div>
                            </TableCell>

                            <TableCell class="grid grid-cols-3 justify-center items-center bg-gray-100 text-xs">
                                <CheckCircleIcon
                                    v-if="getShift(replacement.details[0].start_at) === 'morning'"
                                    class="h-6 mx-auto text-green-500"
                                />
                                <CheckCircleIcon
                                    v-if="getShift(replacement.details[0].start_at) === 'afternoon'"
                                    class="h-6 mx-auto text-green-500"
                                />
                                <CheckCircleIcon
                                    v-if="getShift(replacement.details[0].start_at) === 'evening'"
                                    class="h-6 mx-auto text-green-500"
                                />
                            </TableCell>

                            <TableCell class="bg-gray-100 text-xs">
                                <div
                                    class="flex h-10 rounded mt-3 justify-center items-center"
                                    :class="[
                                        'bg-gray-200',
                                        hasMatchingZipCode(replacement.details) ? 'bg-success text-white' : '',
                                    ]"
                                >
                                    <span class="truncate w-full px-2">
                                        {{ replacement.details
                                            ?.map((detail) => detail?.patient?.zip_code)
                                            .filter(Boolean)
                                            .join(', ') || '' }}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell class="bg-gray-100 text-xs">
                                <div
                                    class="flex h-10 rounded mt-3 justify-center items-center overflow-hidden"
                                    :class="[
                                        'bg-gray-200',
                                        hasMatchingCity(replacement.details) ? 'bg-success text-white' : '',
                                    ]"
                                >
                                    <span class="truncate w-full px-2">
                                        {{ replacement.details
                                            ?.map((detail) => detail?.patient?.city)
                                            .filter(Boolean)
                                            .join(', ') || '' }}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell class="bg-gray-100 text-xs pt-6">
                                <div
                                    class="pt-3 h-10 rounded bg-gray-200 mx-auto px-3 items-center overflow-hidden whitespace-nowrap text-ellipsis"
                                >
                                    {{ replacement.details
                                        ?.flatMap((detail) => detail.care_types?.map((careType) => careType.name) || [])
                                        .join(', ') }}
                                </div>
                            </TableCell>

                            <TableCell class="text-xs pt-6 overflow-x-hidden">
                                <Button
                                    class="flex h-10 rounded bg-gray-200 text-black hover:text-white mx-auto justify-center items-center"
                                    :href="`/dashboard/replacement/detail/${replacement.id}`"
                                >
                                    <span class="text-xs">Voir plus</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';

import { useSearchReplacements } from '~/composables/useReplacements';

useHead({
    title: 'Liste des remplacements',
});

const { replacements, fetchReplacements } = useSearchReplacements();

onMounted(() => {
    fetchReplacements();
});

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const getShift = (startAt) => {
    if (!startAt) return null;

    const startHour = Number(startAt.split(':')[0]);

    if (startHour >= 0 && startHour < 12) {
        return 'morning';
    }
    if (startHour >= 12 && startHour < 18) {
        return 'afternoon';
    }
    return 'evening';
};

const formData = reactive({
    postalCode: '',
    cities: '',
    selectedDays: [],
});

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'Saturday', 'Sunday'];
const frenchDays = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    Saturday: 'Samedi',
    Sunday: 'Dimanche',
};

const toggleDay = (day) => {
    if (formData.selectedDays.includes(day)) {
        const index = formData.selectedDays.indexOf(day);
        formData.selectedDays.splice(index, 1);
    }
    else {
        formData.selectedDays.push(day);
    }
};

const selectedDaysPlaceholder = computed(() => {
    if (formData.selectedDays.length === 0) {
        return 'Sélectionner';
    }
    return formData.selectedDays.map(day => frenchDays[day]).join(', ');
});

const isSubmitted = ref(false);

const postalCodeArray = computed(() =>
    formData.postalCode
        .split(',')
        .map(code => code.trim())
        .filter(Boolean),
);

const citiesArray = computed(() =>
    formData.cities
        .split(',')
        .map(city => city.trim())
        .filter(Boolean),
);

const hasMatchingZipCode = (details) => {
    if (!isSubmitted.value) return false;
    const zipCodes = details?.map(detail => detail?.patient?.zip_code) || [];
    return zipCodes.some(zip => postalCodeArray.value.includes(zip));
};

const hasMatchingCity = (details) => {
    if (!isSubmitted.value) return false;
    const cities = details?.map(detail => detail?.patient?.city) || [];
    return cities.some(city => citiesArray.value.includes(city));
};

const submit = () => {
    isSubmitted.value = true;
    fetchReplacements({
        selectedDays: Array.from(formData.selectedDays),
        postalCode: postalCodeArray.value,
        cities: citiesArray.value,
    });
};

watch(() => formData.postalCode, () => {
    if (isSubmitted.value) isSubmitted.value = false;
});
watch(() => formData.cities, () => {
    if (isSubmitted.value) isSubmitted.value = false;
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
});
</script>
