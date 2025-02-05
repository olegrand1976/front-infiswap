<template>
    <div class="pt-4">
        <Form>
            <div class="flex justify-between">
                <div class="bg-primary border border-primary rounded-2xl h-full">
                    <div class="bg-white rounded-2xl flex items-center ps-4 h-10">
                        <h2 class="font-bold text-primary">
                            Période
                        </h2>   
                    </div>

                    <div class="p-5">
                        <FormField name="formData.startDate">
                            <FormItem class="flex items-center space-x-8 text-white">
                                <FormLabel>
                                    Début
                                </FormLabel>
                                <FormControl>
                                    <div class="flex px-4 w-40 space-x-1 items-center rounded-full bg-white h-10">
                                        <CalendarIcon class="w-6 h-6 text-primary" />
                                        <Input
                                            v-model="formData.startDate"
                                            placeholder="Date de début"
                                            type="text"
                                            class="text-xs w-full text-black"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>

                        <Separator class="opacity-70 my-4" />

                        <FormField name="formData.endDate">
                            <FormItem class="flex items-center space-x-[3.25rem] text-white">
                                <FormLabel>
                                    Fin
                                </FormLabel>
                                <FormControl>
                                    <div class="flex px-4 w-40 space-x-1 items-center rounded-full bg-white h-10">
                                        <CalendarIcon class="w-6 h-6 text-primary" />
                                        <Input
                                            v-model="formData.endDate"
                                            placeholder="Date de fin"
                                            type="text"
                                            class="text-xs w-full text-black"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>
                    </div>
                </div>

                <div>
                    <RangeCalendar
                        v-model="value"
                        class="rounded-md shadow-lg"
                    />
                </div>
            </div>

            <div>
                <div class="mt-10 h-12 flex items-center justify-between rounded-xl px-2 bg-gray-100">
                    <div class="flex space-x-3 items-center">
                        <FormField name="startDate">
                            <FormItem>
                                <FormControl>
                                    <div class="bg-primary rounded-full h-9 px-3 text-white flex items-center">
                                        <ChevronLeftIcon
                                            class="w-5 h-5 cursor-pointer"
                                            title="Date précédente"
                                            :class="{ 'opacity-90': new Date(currentDate) <= new Date(formData.startDate) }"
                                            :disabled="new Date(currentDate) <= new Date(formData.startDate)"
                                            @click="decrementDate"
                                        />
                                        <Input
                                            v-model="currentDate"
                                            title="Date suivante"
                                            type="date"
                                            class="w-24 text-sm"
                                            disabled
                                        />
                                        <ChevronRightIcon
                                            class="w-5 h-5 cursor-pointer"
                                            :class="{ 'opacity-50 cursor-not-allowed': new Date(currentDate) >= new Date(formData.endDate) }"
                                            :disabled="new Date(currentDate) >= new Date(formData.endDate)"
                                            @click="incrementDate"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>
                        <div class="flex">
                            <Button
                                class="flex text-xs items-center space-x-2"
                            >
                                Copier le jour
                                <Square2StackIcon class="w-6 h-6" />
                            </Button>
                        </div>
                        <div class="flex">
                            <Button
                                class="flex text-xs items-center space-x-2"
                            >
                                Réinitialiser
                                <ArrowPathRoundedSquareIcon class="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Button
                            class="flex text-xs items-center space-x-2"
                        >
                            Copier tous les jours de la tournée
                            <Square2StackIcon class="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                <div class="mt-6">
                    <div class="grid overflow-x-auto">
                        <Table>
                            <TableHeader class="w-full">
                                <TableRow class="grid grid-cols-3 gap-2 border-none">
                                    <TableHead
                                        v-for="(times, period) in hours"
                                        :key="period"
                                        class="bg-primary flex justify-center items-center rounded-lg text-white text-xs"
                                    >
                                        {{ periodLabels[period] }}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                <TableRow class="grid grid-cols-3 gap-2 border-none">
                                    <TableCell
                                        v-for="(times, period) in hours"
                                        :key="period"
                                        class="p-2"
                                    >
                                        <Table class="w-full border">
                                            <TableBody>
                                                <TableRow
                                                    v-for="(time, index) in times"
                                                    :key="index"
                                                    class="grid grid-cols-[30%_70%] items-center pr-4"
                                                >
                                                    <TableCell class="text-center border p-2 text-xs">
                                                        {{ formatHour(time) }}
                                                    </TableCell>
                                                    <TableCell class="border border-none p-2">
                                                        <span>.</span>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>

                                        <div>
                                            <p>Patient: {{ selectedPatient[period].zipCode }}</p>
                                            <p>Créneau horaire: {{ selectedTimes[period] }}</p>
                                            <p>Type de soin: {{ selectedCareTypes[period] }}</p>
                                        </div>

                                        <PlusCircleIcon
                                            class="mt-6 w-8 h-8 flex justify-center items-center mx-auto text-primary cursor-pointer"
                                            title="Choisir le patient"
                                            @click="openModal(period)"
                                        />

                                        <Dialog v-model:open="isOpen[period]">
                                            <DialogContent class="sm:max-w-xl h-[70vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Détail du patient</DialogTitle>
                                                    <DialogDescription>Veuillez confirmer ici les détails concernant le patient</DialogDescription>
                                                </DialogHeader>

                                                <div class="mt-6 grid grid-cols-1 gap-4 mx-8">
                                                    <FormField name="lastname">
                                                        <FormItem>
                                                            <FormControl class="grid grid-cols-[30%_70%] items-center rounded-full border border-primary">
                                                                <div>
                                                                    <FormLabel class="flex h-9 rounded-s-full text-xs bg-primary text-white space-x-4 items-center pl-4">
                                                                        <UserCircleIcon class="w-6 h-6" />
                                                                        <span>Nom</span>
                                                                    </FormLabel>
                                                                    <Input
                                                                        v-model="selectedPatient[period].lastname"
                                                                        variant="transparent"
                                                                        class="text-black"
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                        </FormItem>
                                                    </FormField>

                                                    <FormField name="firstname">
                                                        <FormItem>
                                                            <FormControl class="grid grid-cols-[30%_70%] items-center rounded-full border border-primary">
                                                                <div>
                                                                    <FormLabel class="flex relative h-9 rounded-s-full text-xs bg-primary text-white space-x-4 items-center pl-4">
                                                                        <UserCircleIcon class="w-6 h-6" />
                                                                        <PlusIcon class="w-3 h-3 absolute top-0 left-4" />
                                                                        <span>Prénoms</span>
                                                                    </FormLabel>
                                                                    <Input
                                                                        v-model="selectedPatient[period].firstname"
                                                                        variant="transparent"
                                                                        class="text-black"
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                        </FormItem>
                                                    </FormField>

                                                    <FormField name="patientDateOfBirth">
                                                        <FormItem>
                                                            <FormControl class="grid grid-cols-[30%_70%] items-center rounded-full border border-primary">
                                                                <div>
                                                                    <FormLabel class="flex h-9 rounded-s-full text-xs bg-primary text-white space-x-4 items-center pl-4">
                                                                        <CalendarIcon class="w-6 h-6" />
                                                                        <span>Naissance</span>
                                                                    </FormLabel>
                                                                    <Input
                                                                        v-model="selectedPatient[period].dateOfBirth"
                                                                        type="date"
                                                                        variant="transparent"
                                                                        class="text-black"
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                        </FormItem>
                                                    </FormField>

                                                    <FormField name="city">
                                                        <FormItem>
                                                            <FormControl class="grid grid-cols-[30%_70%] items-center rounded-full border border-primary">
                                                                <div>
                                                                    <FormLabel class="flex h-9 rounded-s-full text-xs bg-primary text-white space-x-4 items-center pl-4">
                                                                        <NuxtImg
                                                                            src="/icons/city_white.png"
                                                                            class="w-6 h-6"
                                                                        />
                                                                        <span>Ville</span>
                                                                    </FormLabel>
                                                                    <Input
                                                                        v-model="selectedPatient[period].city"
                                                                        variant="transparent"
                                                                        class="text-black"
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                        </FormItem>
                                                    </FormField>

                                                    <FormField name="zipCode">
                                                        <FormItem>
                                                            <FormControl class="grid grid-cols-[30%_70%] items-center rounded-full border border-primary">
                                                                <div>
                                                                    <FormLabel class="flex h-9 rounded-s-full text-xs bg-primary text-white space-x-4 items-center pl-4">
                                                                        <NuxtImg
                                                                            src="/icons/zip_code.png"
                                                                            class="w-6 h-6"
                                                                        />
                                                                        <span>Code postal</span>
                                                                    </FormLabel>
                                                                    <Input
                                                                        v-model.number="selectedPatient[period].zipCode"
                                                                        variant="transparent"
                                                                        class="text-black"
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                        </FormItem>
                                                    </FormField>
                                                </div>

                                                <FormField name="time">
                                                    <FormLabel class="flex items-center space-x-3 mt-6">
                                                        <ClockIcon class="w-5 h-5" />
                                                        <span class="text-base font-bold">Choisir une période et l'heure de prestation</span>
                                                    </FormLabel>

                                                    <FormItem class="flex flex-col space-y-3 mx-8 text-sm">
                                                        <div :key="period">
                                                            <FormControl>
                                                                <div class="grid grid-cols-[30%_70%] items-center rounded-full border border-primary">
                                                                    <div class="bg-primary h-9 flex justify-center items-center px-auto rounded-s-full">
                                                                        <span class="text-center text-xs text-white">{{ periodLabels[period] }}</span>
                                                                    </div>
                                                                    <div class="flex px-2 space-x-4 items-center">
                                                                        <Select v-model="selectedTimes[period][0]">
                                                                            <SelectTrigger class="w-28 text-xs border border-none">
                                                                                <SelectValue placeholder="Heure de début" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectGroup>
                                                                                    <SelectItem
                                                                                        v-for="time in times"
                                                                                        :key="time"
                                                                                        :value="time"
                                                                                    >
                                                                                        {{ formatHour(time) }}
                                                                                    </SelectItem>
                                                                                </SelectGroup>
                                                                            </SelectContent>
                                                                        </Select>

                                                                        <Select v-model="selectedTimes[period][1]">
                                                                            <SelectTrigger class="w-28 text-xs border border-none">
                                                                                <SelectValue placeholder="Heure de fin"  />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectGroup>
                                                                                    <SelectItem
                                                                                        v-for="time in times"
                                                                                        :key="time"
                                                                                        :value="time"
                                                                                    >
                                                                                        {{ formatHour(time) }}
                                                                                    </SelectItem>
                                                                                </SelectGroup>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                            </FormControl>
                                                        </div>
                                                    </FormItem>
                                                </FormField>

                                                <FormField name="careTypes">
                                                    <FormItem class="my-4">
                                                        <FormLabel class="font-bold text-lg">
                                                            Sélectionnez le type de soin
                                                        </FormLabel>

                                                        <div key="period">
                                                            <ul class="grid grid-cols-2 container gap-4">
                                                                <li
                                                                    v-for="care in careTypes"
                                                                    :key="care.id"
                                                                    class="text-xs h-8 cursor-pointer flex rounded-full justify-center items-center"
                                                                    :class="{
                                                                        'bg-primary text-white': isSelected(care, period),
                                                                        'border border-primary': !isSelected(care, period),
                                                                    }"
                                                                    @click="toggleSelectionCare(care, period)"
                                                                >
                                                                    <span>{{ care.name }}</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </FormItem>
                                                </FormField>

                                                <DialogFooter>
                                                    <Button>
                                                        Valider
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div class="mt-8 mb-16 flex justify-between items-center">
                        <div class="h-10 w-44 bg-white text-sm rounded-full border border-primary grid grid-cols-2">
                            <div class="bg-primary flex rounded-s-full justify-center items-center px-auto">
                                <span class="text-center text-white">Revenu</span>
                            </div>
                            <div class="flex justify-center items-center mx-auto">
                                <span class="text-center">8 000 £</span>
                            </div>
                        </div>

                        <div>
                            <Button @click="onSavePatient">
                                Enregistrer
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    </div>
</template>

<script lang="ts" setup>
import {
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusCircleIcon,
    UserCircleIcon,
    PlusIcon,
    Square2StackIcon,
    ArrowPathRoundedSquareIcon,
    ClockIcon,
} from '@heroicons/vue/24/solid';

import type { DateRange } from 'radix-vue';
import { getLocalTimeZone, today } from '@internationalized/date';
import { RangeCalendar } from '@/components/ui/range-calendar';

import { useReplacements } from '~/composables/useReplacements';

const formData = reactive({
    startDate: '',
    endDate: '',
    replacement: [],
});

const start = today(getLocalTimeZone());
const end = null;

/** Function for dynamic date selection in range calendar */
const value = ref({
    start,
    end,
}) as Ref<DateRange>;

watch(value, (newValue) => {
    if (newValue?.start) {
        const localStartDate = new Date(newValue.start.year, newValue.start.month - 1, newValue.start.day);
        formData.startDate = localStartDate.toLocaleDateString('fr-CA');
        currentDate.value = formData.startDate;
    }
    if (newValue?.end) {
        const localEndDate = new Date(newValue.end.year, newValue.end.month - 1, newValue.end.day);
        formData.endDate = localEndDate.toLocaleDateString('fr-CA');
    }
});

const currentDate = ref('');

const incrementDate = () => {
    if (!currentDate.value) return;

    const nextDate = new Date(currentDate.value);
    nextDate.setDate(nextDate.getDate() + 1);

    if (nextDate.toISOString().split('T')[0] <= formData.endDate) {
        currentDate.value = nextDate.toLocaleDateString('fr-CA');
    }
};

const decrementDate = () => {
    if (!currentDate.value) return;

    const prevDate = new Date(currentDate.value);
    prevDate.setDate(prevDate.getDate() - 1);

    if (prevDate.toISOString().split('T')[0] >= formData.startDate) {
        currentDate.value = prevDate.toLocaleDateString('fr-CA');
    }
};
/** */

/** Multiple times selection configuration */
const hours = ref({
    morning: [7, 8, 9, 10, 11, 12],
    afternoon: [12, 14, 15, 16, 17, 18],
    evening: [18, 19, 20, 21, 22, 23],
});

const formatHour = (hour) => hour.toString().padStart(2, '0') + ':00';

const periodLabels = {
    morning: 'Matin',
    afternoon: 'Après-midi',
    evening: 'Soir',
};

const selectedTimes = ref({
    morning: [null, null],
    afternoon: [null, null],
    evening: [null, null],
});
/** */

/** Dialog configuration */
const isOpen = ref<{ [key: string]: boolean }>({
    morning: false,
    afternoon: false,
    evening: false,
});

const openModal = (period: string) => {
    isOpen.value[period] = true;
};
/** */

/** Patient configuration */
const selectedPatient = ref({
    morning: {
        id: null,
        lastname: '',
        firstname: '',
        dateOfBirth: '',
        city: '',
        zipCode: null,
    },
    afternoon: {
        id: null,
        lastname: '',
        firstname: '',
        dateOfBirth: '',
        city: '',
        zipCode: null,
    },
    evening: {
        id: null,
        lastname: '',
        firstname: '',
        dateOfBirth: '',
        city: '',
        zipCode: null,
    },
}); 
/** */

/** Caretype configuration */
const { careTypes, fetchCareTypes } = useCareTypes();

onMounted(() => {
    fetchCareTypes();
});

const selectedCareTypes = ref({
    morning: [],
    afternoon: [],
    evening: [],
});

const isSelected = (care, period) => {
    return selectedCareTypes.value[period].includes(care.id);
};

const toggleSelectionCare = (care, period) => {
    const selectedList = selectedCareTypes.value[period];

    if (selectedList.includes(care.id)) {
        selectedCareTypes.value[period] = selectedList.filter(id => id !== care.id);
    }
    else {
        selectedCareTypes.value[period] = [...selectedList, care.id].sort((a, b) => a - b);
    }
};


/** Submission purpose */
const updateReplacementData = () => {
    formData.replacement = [];

    ['morning', 'afternoon', 'evening'].forEach((period) => {
        const patient = selectedPatient.value[period];
        const time = selectedTimes.value[period]
            .filter(t => t !== '')
            .map(Number);
        const careTypes = selectedCareTypes.value[period].map(Number);

        if (time.length > 0 && careTypes.length > 0) {
            formData.replacement.push({
                patientId: patient.id ?? null,
                patientName: patient.lastname,
                patientFirstname: patient.firstname,
                patientDateOfBirth: patient.dateOfBirth,
                city: patient.city,
                zipCode: Number(patient.zipCode),
                date: currentDate.value,
                time: time,
                careTypes: careTypes,
            });
        }
    });
};


const { submitReplacement } = useReplacements();

const onSavePatient = () => {
    updateReplacementData();
    submitReplacement(formData);
};

useHead({
    title: 'Créer un remplacement',
});

definePageMeta({
    layout: 'dashboard',
});
</script>
