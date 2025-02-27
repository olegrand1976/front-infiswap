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
                                            placeholder="YYYY-MM-DD"
                                            type="date"
                                            :min="today"
                                            class="text-xs w-full text-black/70 bg-transparent"
                                            @input="handleDateInput('start')"
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
                                            placeholder="YYYY-MM-DD"
                                            type="date"
                                            :min="formData.startDate || today"
                                            class="text-xs w-full text-black/70 bg-transparent"
                                            @input="handleDateInput('end')"
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
                        :min-value="todayCalendar"
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
                                            placeholder="jj/mm/aaaa"
                                            class="w-24 text-xs bg-transparent placeholder:text-white"
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
                                @click="reinitializeData"
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
                                                        <div
                                                            v-if="isTimeInSelectedRange(time, period)"
                                                            class="text-xs cursor-pointer"
                                                            :title="selectedCareTypes[period]
                                                                .map(id => careTypes.find(care => care.id === id)?.name)
                                                                .filter(Boolean)
                                                                .join(', ')"
                                                        >
                                                            <p class="font-semibold">
                                                                {{ getCurrentDateReplacements(period)?.patientName || selectedPatient[period].lastname }} {{ getCurrentDateReplacements(period)?.patientFirstname || selectedPatient[period].firstname }}
                                                            </p>
                                                        </div>
                                                        <span
                                                            v-else
                                                            class="text-transparent"
                                                        >.</span>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>

                                        <PlusCircleIcon
                                            class="mt-6 w-8 h-8 flex justify-center items-center mx-auto text-primary"
                                            :class="{ 'cursor-pointer': formData.startDate && formData.endDate, 'opacity-50 cursor-not-allowed': !formData.startDate || !formData.endDate }"
                                            title="Choisir le patient"
                                            @click="formData.startDate && formData.endDate ? openModal(period) : null"
                                        />

                                        <Dialog v-model:open="isOpen[period]">
                                            <DialogContent class="sm:max-w-xl h-[70vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle class="flex space-x-2">
                                                        <UserCircleIcon class="w-5" />
                                                        <span>
                                                            Détail du patient
                                                        </span>
                                                    </DialogTitle>
                                                    <DialogDescription>Veuillez confirmer ici les détails concernant le patient</DialogDescription>
                                                </DialogHeader>

                                                <div class="mt-6 grid grid-cols-1 gap-4">
                                                    <FormField name="patient">
                                                        <FormItem>
                                                            <FormControl class="grid grid-cols-[30%_70%] justify-center items-center mb-8">
                                                                <div>
                                                                    <FormLabel class="flex text-sm items-center pl-4">
                                                                        <span>Vos patients</span>
                                                                    </FormLabel>
                                                                    <Select v-model="selectedPatient[period]">
                                                                        <SelectTrigger
                                                                            class="border border-none shadow"
                                                                        >
                                                                            <SelectValue
                                                                                class="text-nowrap text-black"
                                                                                :value="fullname[period] || 'Choisir le patient'"
                                                                            />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                <SelectItem
                                                                                    v-for="patient in nursePatients"
                                                                                    :key="patient.id"
                                                                                    :value="patient"
                                                                                    @click="handlePatientSelect(patient, period)"
                                                                                >
                                                                                    {{ patient.lastname }} {{ patient.firstname }}
                                                                                </SelectItem>
                                                                            </SelectGroup>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </FormControl>
                                                        </FormItem>
                                                    </FormField>

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
                                                                        :disabled="selectedPatient[period].id !== null"
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
                                                                        :disabled="selectedPatient[period].id !== null"
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                        </FormItem>
                                                    </FormField>

                                                    <FormField name="social_security_number">
                                                        <FormItem>
                                                            <FormControl class="grid grid-cols-[30%_70%] items-center rounded-full border border-primary">
                                                                <div>
                                                                    <FormLabel class="flex h-9 rounded-s-full text-xs bg-primary text-white space-x-4 items-center pl-4">
                                                                        <CalendarIcon class="w-6 h-6" />
                                                                        <span>Numéro de sécurité social</span>
                                                                    </FormLabel>
                                                                    <Input
                                                                        v-model="selectedPatient[period].social_security_number"
                                                                        type="text"
                                                                        variant="transparent"
                                                                        class="text-black"
                                                                        :disabled="selectedPatient[period].id !== null"
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
                                                    <FormLabel class="flex items-center space-x-2 mt-6">
                                                        <ClockIcon class="w-5" />
                                                        <span class="text-base font-bold">Choisir une période et l'heure de prestation</span>
                                                    </FormLabel>

                                                    <FormItem class="flex flex-col space-y-3 text-sm">
                                                        <div :key="period">
                                                            <FormControl>
                                                                <div class="grid grid-cols-[30%_70%] items-center rounded-full border border-primary">
                                                                    <div class="bg-primary h-9 flex justify-center items-center px-auto rounded-s-full">
                                                                        <span class="text-center text-xs text-white">{{ periodLabels[period] }}</span>
                                                                    </div>
                                                                    <div class="flex px-2 space-x-10 items-center">
                                                                        <Select v-model="selectedTimes[period][0]">
                                                                            <SelectTrigger class="w-28 text-xs border border-none">
                                                                                <SelectValue
                                                                                    placeholder="Heure de début"
                                                                                    class="text-nowrap"
                                                                                />
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
                                                                                <SelectValue
                                                                                    placeholder="Heure de fin"
                                                                                    class="text-nowrap"
                                                                                />
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
                                                        <FormLabel class="font-bold text-lg flex space-x-2">
                                                            <UserPlusIcon class="w-5" />
                                                            <span>
                                                                Sélectionnez le type de soin
                                                            </span>
                                                        </FormLabel>

                                                        <div key="period">
                                                            <ul class="grid grid-cols-2 gap-4">
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
                                                    <Button @click="closeModal(period)">
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
    UserPlusIcon,
    PlusIcon,
    Square2StackIcon,
    ArrowPathRoundedSquareIcon,
    ClockIcon,
} from '@heroicons/vue/24/solid';

import type { DateRange } from 'radix-vue';
import { CalendarDate, getLocalTimeZone, today as todayFn } from '@internationalized/date';
import { RangeCalendar } from '@/components/ui/range-calendar';
import { useReplacements } from '~/composables/useReplacements';

const router = useRouter();

const { $toast } = useNuxtApp();

const formData = reactive({
    startDate: '',
    endDate: '',
    replacement: [],
});

const savedReplacements = ref<{ [key: string]: any[] }>({});

const today = computed(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
});

// Get today's date for the calendar
const todayCalendar = computed(() => {
    return todayFn(getLocalTimeZone());
});

// Initialiser value avec la date actuelle
const value = ref({
    start: new CalendarDate(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate(),
    ),
    end: null,
}) as Ref<DateRange>;

// Initialiser currentDate avec la date actuelle
const currentDate = ref(new Date().toISOString().split('T')[0]);

const handleDateInput = (type: 'start' | 'end') => {
    const date = type === 'start' ? formData.startDate : formData.endDate;
    if (!date) {
        if (type === 'end') {
            value.value = {
                start: value.value.start,
                end: null,
            };
        }
        return;
    }

    // Prevent selecting dates before today
    if (new Date(date) < new Date(today.value)) {
        if (type === 'start') {
            formData.startDate = today.value;
        }
        else {
            formData.endDate = today.value;
        }
        return;
    }

    // For end date, ensure it's not before start date
    if (type === 'end' && formData.startDate && date < formData.startDate) {
        formData.endDate = formData.startDate;
        return;
    }

    // Update calendar value
    const [year, month, day] = date.split('-').map(Number);
    const calendarDate = new CalendarDate(year, month, day);

    if (type === 'start') {
        value.value = {
            start: calendarDate,
            end: value.value.end,
        };
        currentDate.value = date;
    }
    else {
        value.value = {
            start: value.value.start,
            end: calendarDate,
        };
    }
};

// Modifier le watch pour gérer correctement les changements de dates
watch(value, (newValue) => {
    if (newValue?.start) {
        const startDate = `${newValue.start.year}-${String(newValue.start.month).padStart(2, '0')}-${String(newValue.start.day).padStart(2, '0')}`;
        formData.startDate = startDate;
        currentDate.value = startDate;
    }
    if (newValue?.end) {
        const endDate = `${newValue.end.year}-${String(newValue.end.month).padStart(2, '0')}-${String(newValue.end.day).padStart(2, '0')}`;
        formData.endDate = endDate;
    }
    else {
        formData.endDate = '';
    }
}, { deep: true });

const isTimeInSelectedRange = (time: number, period: string) => {
    const startTime = selectedTimes.value[period][0];
    const endTime = selectedTimes.value[period][1];

    // Vérifier si on a des données sauvegardées
    const savedData = getCurrentDateReplacements(period);
    if (savedData) {
        const savedStartTime = savedData.time[0];
        const savedEndTime = savedData.time[1];
        return time >= savedStartTime && time <= savedEndTime;
    }

    // Sinon vérifier les données en cours de sélection
    if (startTime && endTime) {
        return time >= startTime && time <= endTime;
    }

    return false;
};

const incrementDate = () => {
    if (!currentDate.value) return;

    // Sauvegarder les données de la date courante avant de changer
    updateReplacementData();

    const nextDate = new Date(currentDate.value);
    nextDate.setDate(nextDate.getDate() + 1);

    if (nextDate.toISOString().split('T')[0] <= formData.endDate) {
        currentDate.value = nextDate.toLocaleDateString('fr-CA');
        // Charger les données sauvegardées pour la nouvelle date ou réinitialiser
        loadSavedData();
    }
};

const decrementDate = () => {
    if (!currentDate.value) return;

    // Sauvegarder les données de la date courante avant de changer
    updateReplacementData();

    const prevDate = new Date(currentDate.value);
    prevDate.setDate(prevDate.getDate() - 1);

    if (prevDate.toISOString().split('T')[0] >= formData.startDate) {
        currentDate.value = prevDate.toLocaleDateString('fr-CA');
        // Charger les données sauvegardées pour la nouvelle date ou réinitialiser
        loadSavedData();
    }
};
/** */

/** Multiple times selection configuration */
const hours = ref({
    morning: [7, 8, 9, 10, 11, 12],
    afternoon: [12, 14, 15, 16, 17, 18],
    evening: [18, 19, 20, 21, 22, 23],
});

const formatHour = hour => hour.toString().padStart(2, '0') + ':00';

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

const closeModal = (period: string) => {
    isOpen.value[period] = false;
};
/** */

/** Patient configuration */
const selectedPatient = ref({
    morning: {
        id: null,
        lastname: '',
        firstname: '',
        social_security_number: '',
        city: '',
        zipCode: null,
    },
    afternoon: {
        id: null,
        lastname: '',
        firstname: '',
        social_security_number: '',
        city: '',
        zipCode: null,
    },
    evening: {
        id: null,
        lastname: '',
        firstname: '',
        social_security_number: '',
        city: '',
        zipCode: null,
    },
});
/** */

/** Caretype configuration */
const { careTypes, fetchCareTypes } = useCareTypes();

const { nursePatients, fetchNursePatients } = useNursePatients();

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
    const newReplacements = [];

    ['morning', 'afternoon', 'evening'].forEach((period) => {
        const patient = selectedPatient.value[period];
        const time = selectedTimes.value[period]
            .filter(t => t !== '')
            .map(Number);
        const careTypes = selectedCareTypes.value[period].map(Number);

        if (time.length > 0 && careTypes.length > 0) {
            newReplacements.push({
                patientId: patient.id ?? null,
                patientName: patient.lastname,
                patientFirstname: patient.firstname,
                patientSecurityNumber: patient.securityNumber,
                city: patient.city,
                zipCode: Number(patient.zipCode),
                date: currentDate.value,
                time: time,
                careTypes: careTypes,
                period: period,
            });
        }
    });

    // Sauvegarde les remplacements pour la date courante
    if (newReplacements.length > 0) {
        savedReplacements.value[currentDate.value] = newReplacements;
    }

    // Met à jour formData avec tous les remplacements sauvegardés
    formData.replacement = Object.values(savedReplacements.value).flat();
};

const getCurrentDateReplacements = (period: string) => {
    const dateReplacements = savedReplacements.value[currentDate.value] || [];
    return dateReplacements.find(r => r.period === period);
};

const { submitReplacement } = useReplacements();

const onSavePatient = () => {
    updateReplacementData();

    if (formData.replacement.length === 0) {
        $toast({
            title: 'Erreur',
            description: 'Information manquante',
            variant: 'destructive',
        });
        return;
    }

    // Réinitialisation des champs après sauvegarde
    ['morning', 'afternoon', 'evening'].forEach((period) => {
        selectedPatient.value[period] = {
            id: null,
            lastname: '',
            firstname: '',
            securityNumber: '',
            city: '',
            zipCode: null,
        };
        selectedTimes.value[period] = [null, null];
        selectedCareTypes.value[period] = [];
    });

    submitReplacement(formData);
};

// Modification des fonctions de navigation pour charger les données sauvegardées
const loadSavedData = () => {
    // Réinitialiser d'abord tous les champs
    ['morning', 'afternoon', 'evening'].forEach((period) => {
        selectedPatient.value[period] = {
            id: null,
            lastname: '',
            firstname: '',
            securityNumber: '',
            city: '',
            zipCode: null,
        };
        selectedTimes.value[period] = [null, null];
        selectedCareTypes.value[period] = [];
    });

    // Charger les données sauvegardées si elles existent
    const dateReplacements = savedReplacements.value[currentDate.value] || [];

    dateReplacements.forEach((replacement) => {
        const period = replacement.period;
        if (period) {
            selectedPatient.value[period] = {
                id: replacement.patientId,
                lastname: replacement.patientName,
                firstname: replacement.patientFirstname,
                securityNumber: replacement.patientSecurityNumber,
                city: replacement.city,
                zipCode: replacement.zipCode,
            };
            selectedTimes.value[period] = replacement.time;
            selectedCareTypes.value[period] = replacement.careTypes;
        }
    });
};

const fullname = {
    morning: '',
    afternoon: '',
    evening: '',
};

const handlePatientSelect = (patient, period) => {
    selectedPatient.value[period] = {
        id: patient.id,
        lastname: patient.lastname,
        firstname: patient.firstname,
        securityNumber: patient.social_security_number,
        city: patient.city,
        zipCode: patient.zipCode,
    };

    fullname[period] = selectedPatient.value[period].lastname + ' ' + selectedPatient.value[period].firstname;
};

const reinitializeData = () => {
    ['morning', 'afternoon', 'evening'].forEach((period) => {
        selectedPatient.value[period] = {
            id: null,
            lastname: '',
            firstname: '',
            securityNumber: '',
            city: '',
            zipCode: null,
        };
        selectedTimes.value[period] = [null, null];
        selectedCareTypes.value[period] = [];
    });

    Object.keys(savedReplacements.value).forEach(key => delete savedReplacements.value[key]);
};

onMounted(() => {
    const now = new Date();
    const currentDateStr = now.toISOString().split('T')[0];
    formData.startDate = currentDateStr;
    currentDate.value = currentDateStr;

    fetchNursePatients();
    fetchCareTypes();
});

useHead({
    title: 'Créer un remplacement',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
});
</script>
