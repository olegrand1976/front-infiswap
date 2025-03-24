<template>
    <div class="pt-4">
        <Form @submit="submit">
            <div
                class="flex flex-col space-y-8 justify-center mx-auto md:space-y-0 md:flex-row md:justify-between md:mx-0"
            >
                <div class="bg-primary border border-primary rounded-2xl h-full p-2 sm:mx-20 md:px-2 md:mx-0">
                    <div class="bg-white rounded-2xl flex items-center h-10 p-2">
                        <h2 class="font-bold text-primary text-center">
                            Période de remplacement
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
                                            placeholder="jj/mm/aaaa"
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
                                            placeholder="jj/mm/aaaa"
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

                <div class="sm:mx-20 md:mx-0 ps-4">
                    <RangeCalendar
                        v-model="value"
                        :min-value="todayCalendar"
                        class="flex flex-col justify-center px-auto md:block md:px-0 rounded-md shadow-lg"
                    />
                </div>
            </div>

            <div>
                <div
                    class="w-full mt-10 h-12 flex flex-wrap gap-4 md:gap-0 md:flex-nowrap items-center justify-between rounded-xl ps-2 bg-gray-100"
                >
                    <div class="flex flex-wrap md:flex-nowrap md:space-x-3 gap-4 md:gap-0 items-center">
                        <FormField name="startDate">
                            <FormItem>
                                <FormControl>
                                    <div class="bg-primary rounded-full h-9 px-3 text-white flex items-center">
                                        <ChevronLeftIcon
                                            class="w-5 cursor-pointer"
                                            title="Date précédente"
                                            :class="{ 'opacity-50 cursor-not-allowed': new Date(currentDate) <= new Date(formData.startDate) }"
                                            :disabled="new Date(currentDate) <= new Date(formData.startDate)"
                                            @click="decrementDate"
                                        />
                                        <Input
                                            v-model="currentDate"
                                            title="Date suivante"
                                            type="date"
                                            placeholder="jj/mm/aaaa"
                                            class="w-28 text-xs bg-transparent placeholder:text-white"
                                            disabled
                                        />
                                        <ChevronRightIcon
                                            class="w-5 cursor-pointer"
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
                                @click="copyCurrentDate"
                            >
                                Copier le jour
                                <Square2StackIcon class="w-6 h-6" />
                            </Button>
                        </div>
                        <div class="flex pr-2">
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
                            @click="copyAllDates"
                        >
                            Copier tous les jours de la tournée
                            <Square2StackIcon class="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                <Button
                    type="submit"
                    class="mt-32 md:mt-4 w-64 md:w-auto flex text-xs md:text-base justify-center mx-auto md:mx-0 md:justify-end md:ml-auto"
                    :in-progress="inProgress"
                >
                    Enregistrer
                </Button>

                <div class="mt-12 md:mt-6">
                    <div class="overflow-x-auto">
                        <Table>
                            <TableHeader class="w-full md:grid md:grid-cols-3 gap-2 border-none block">
                                <div
                                    v-for="(label, key) in periodLabels"
                                    :key="key"
                                    class="mb-4 md:mb-0"
                                >
                                    <TableHead
                                        class="bg-primary w-full flex justify-center items-center rounded-t-lg text-white text-xs"
                                    >
                                        {{ label }}
                                    </TableHead>
                                    <TableBody
                                        class="bg-gray-50 block w-full p-3 rounded-b-lg border border-gray-200 mt-2 md:mt-0"
                                    >
                                        <div
                                            v-if="datePatients[currentDate] && datePatients[currentDate][key] && datePatients[currentDate][key].length > 0"
                                        >
                                            <div
                                                v-for="(patient, index) in datePatients[currentDate][key]"
                                                :key="index"
                                                class="mb-2 w-full"
                                            >
                                                <div class="grid grid-cols-[20%_80%] w-full">
                                                    <TableCell class="flex h-9 items-center border border-gray-200">
                                                        {{ patient.time }}
                                                    </TableCell>
                                                    <TableCell class="flex h-9 items-center border border-gray-200">
                                                        {{ patient.firstname }} {{ patient.lastname }}
                                                    </TableCell>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            v-else
                                            class="text-gray-400 italic"
                                        >
                                            Aucun patient
                                        </div>
                                        <div class="mt-4 flex items-center justify-center mx-auto">
                                            <Button
                                                class="p-0 shadow-none bg-transparent hover:bg-transparent"
                                                :disabled="!formData.startDate || !formData.endDate"
                                                @click="openDialog(key)"
                                            >
                                                <PlusCircleIcon
                                                    class="w-6 mr-1 disabled:cursor-not-allowed cursor-pointer text-primary"
                                                />
                                            </Button>
                                        </div>
                                    </TableBody>
                                </div>
                            </TableHeader>
                        </Table>
                    </div>

                    <Dialog v-model:open="isDialogOpen">
                        <DialogContent class="sm:max-w-xl h-[70vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Ajouter un patient</DialogTitle>
                                <DialogDescription>
                                    Veuillez remplir les informations concernant le soin du patient
                                </DialogDescription>
                            </DialogHeader>
                            <Form class="flex flex-col mt-8">
                                <div class="flex flex-col">
                                    <h5 class="flex items-center justify-between">
                                        <span class="font-semibold text-primary">Séléctionner le patient</span>
                                        <Button
                                            class="flex items-center space-x-2"
                                            @click="dialogConfirm = true"
                                        >
                                            <PlusIcon class="w-5 h-5" />
                                            <span>Nouveau patient</span>
                                        </Button>

                                        <Dialog v-model:open="dialogConfirm">
                                            <DialogContent class="sm:max-w-xl overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Confirmation</DialogTitle>
                                                    <DialogDescription>
                                                        Vous allez être redirigé vers la création du patient. Voulez-vous poursuivre en perdant vos données non enregistrées ?
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div class="my-4 flex justify-end space-x-3 items-center">
                                                    <Button
                                                        variant="secondary"
                                                        class="bg-gray-200"
                                                        @click="dialogConfirm = false"
                                                    >
                                                        Non
                                                    </Button>
                                                    <Button
                                                        @click="handleRedirection"
                                                    >
                                                        Oui
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </h5>
                                    <Select
                                        v-model="selectedPatient"
                                        class="w-full"
                                        @update:model-value="handlePatientSelection"
                                    >
                                        <SelectTrigger
                                            class="flex text-nowrap mt-4 lg:w-auto space-x-1 lg:space-x-2 border border-gray-200 lg:text-sm md:text-xs"
                                            position="right"
                                        >
                                            <SelectValue placeholder="Choisir un patient" />
                                        </SelectTrigger>

                                        <SelectContent class="border border-none">
                                            <SelectGroup class="w-20">
                                                <div
                                                    v-for="patient in nursePatients"
                                                    :key="patient.id"
                                                    class="flex justify-center items-center"
                                                >
                                                    <SelectItem
                                                        :value="patient"
                                                        class="text-nowrap"
                                                    >
                                                        <span class="md:text-xs lg:text-sm text-nowrap w-full">{{
                                                            patient.firstname }} {{ patient.lastname }}</span>
                                                    </SelectItem>
                                                </div>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <!-- Affichage des informations de ville et code postal -->
                                    <div
                                        v-if="selectedPatient"
                                        class="mt-4 p-2 space-y-3 rounded-md text-sm"
                                    >
                                        <div
                                            class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full"
                                        >
                                            <p
                                                class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full"
                                            >
                                                Nom
                                            </p>
                                            <p class="ms-3">
                                                {{ selectedPatient.lastname }}
                                            </p>
                                        </div>
                                        <div
                                            class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full"
                                        >
                                            <p
                                                class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full"
                                            >
                                                Prénoms
                                            </p>
                                            <p class="ms-3">
                                                {{ selectedPatient.firstname }}
                                            </p>
                                        </div>
                                        <div
                                            class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full"
                                        >
                                            <p
                                                class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full"
                                            >
                                                Sécurité sociale
                                            </p>
                                            <p class="ms-3">
                                                {{ selectedPatient.social_security_number }}
                                            </p>
                                        </div>
                                        <div
                                            class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full"
                                        >
                                            <p
                                                class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full"
                                            >
                                                Téléphone
                                            </p>
                                            <p class="ms-3">
                                                {{ selectedPatient.phone_number }}
                                            </p>
                                        </div>
                                        <div
                                            class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full"
                                        >
                                            <p
                                                class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full"
                                            >
                                                Ville
                                            </p>
                                            <p class="ms-3">
                                                {{ selectedPatient.profile.city }}
                                            </p>
                                        </div>
                                        <div
                                            class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full"
                                        >
                                            <p
                                                class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full"
                                            >
                                                Code postal
                                            </p>
                                            <p class="ms-3">
                                                {{ selectedPatient.profile.zip_code }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-8 mb-4">
                                    <h5 class="font-semibold text-primary">
                                        Sélectionnez l'heure
                                    </h5>

                                    <!-- <div
                                        v-if="visitTimes.length != 0"
                                        class="flex items-center space-x-8 mt-4"
                                    >
                                        <label>Horaires disponibles: </label>

                                        <div
                                            v-for="(time, index) in visitTimes"
                                            :key="index"
                                            class="flex items-center space-x-4"
                                        >
                                            <div
                                                class="h-8 px-8 py-1 text-sm rounded-full cursor-pointer transition-all duration-300"
                                                :class="{
                                                    'bg-primary text-white': time === selectedTime,
                                                    'border border-primary': time !== selectedTime,
                                                }"
                                                @click="handleSelectTime(time)"
                                            >
                                                {{ time }}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        v-if="visitTimes.length != 0"
                                        class="relative my-8"
                                    >
                                        <hr class="border border-gray-200">
                                        <p class="absolute px-4 py-1 bg-white -top-3 text-gray-400 left-1/2">
                                            OU
                                        </p>
                                    </div> -->

                                    <div class="flex items-center space-x-8 mt-4">
                                        <label>Entrer l'heure: </label>

                                        <div
                                            input-class="rounded-full w-36"
                                            class="rounded-full"
                                        >
                                            <InputTime v-model="selectedTime" />
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-4 mb-8">
                                    <h5 class="font-semibold text-primary">
                                        Personnaliser le type de soin
                                    </h5>
                                    <ul class="grid grid-cols-2 gap-4 mt-4">
                                        <li
                                            v-for="care in careTypes"
                                            :key="care.id"
                                            :class="[
                                                'text-xs h-9 cursor-pointer flex rounded-full p-2 justify-center items-center border',
                                                selectedCareTypes.includes(care.id) ? 'bg-primary text-white border-primary' : 'bg-white text-black border-gray-300',
                                            ]"
                                            @click="toggleCareType(care.id)"
                                        >
                                            <span class="text-center">{{ care.name }}</span>
                                        </li>
                                    </ul>
                                </div>

                                <Button
                                    class="mb-6"
                                    :disabled="!selectedPatient || !selectedTime"
                                    @click="addPatientToTable"
                                >
                                    Ajouter
                                </Button>
                            </Form>
                        </DialogContent>
                    </Dialog>

                    <div class="my-16 flex justify-center items-center">
                        <div
                            class="hidden h-10 w-44 bg-white text-sm rounded-full border border-primary grid grid-cols-2"
                        >
                            <div class="bg-primary rounded-s-full justify-center items-center px-auto">
                                <span class="text-center text-white">Revenu</span>
                            </div>
                            <div class="flex justify-center items-center mx-auto">
                                <span class="text-center">8 000 £</span>
                            </div>
                        </div>

                        <div class="flex items-center">
                            <Button
                                type="submit"
                                class="w-64"
                                :in-progress="inProgress"
                            >
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
    Square2StackIcon,
    PlusIcon,
    PlusCircleIcon,
    ArrowPathRoundedSquareIcon,
} from '@heroicons/vue/24/solid';

import type { DateRange } from 'radix-vue';
import { CalendarDate, getLocalTimeZone, today as todayFn } from '@internationalized/date';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RangeCalendar } from '@/components/ui/range-calendar';
import { useReplacements } from '~/composables/useReplacements';
import { InputTime } from '@/components/ui/input-time';
import { detailPatient } from '~/composables/usePatients';
import { useTours } from '~/composables/useTours';

const { $toast } = useNuxtApp();

const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
};

const router = useRouter();

const formData = reactive({
    startDate: '',
    endDate: '',
    replacement: [],
});

const datePatients = ref<{
    [date: string]: {
        [period: string]: Array<{
            id: string | null;
            firstname: string;
            lastname: string;
            time: string;
            social_security_number?: string;
            phone_number: string;
            city?: string;
            zipCode?: number | null;
            careTypes?: number[];
        }>;
    };
}>({});

const copiedTours = ref<Set<string>>(new Set());

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

const incrementDate = () => {
    if (!currentDate.value || !formData.endDate) return;

    const nextDate = new Date(currentDate.value);
    nextDate.setDate(nextDate.getDate() + 1);

    if (nextDate.toISOString().split('T')[0] <= formData.endDate) {
        currentDate.value = nextDate.toISOString().split('T')[0];
    }
};

const decrementDate = () => {
    if (!currentDate.value || !formData.startDate) return;

    const prevDate = new Date(currentDate.value);
    prevDate.setDate(prevDate.getDate() - 1);

    if (prevDate.toISOString().split('T')[0] >= formData.startDate) {
        currentDate.value = prevDate.toISOString().split('T')[0];
    }
};

const determineTimePeriod = (time: string): string => {
    const hour = parseInt(time.split(':')[0]);

    if (hour >= 0 && hour < 12) {
        return 'morning';
    }
    else if (hour >= 12 && hour < 18) {
        return 'afternoon';
    }
    else {
        return 'evening';
    }
};

/** Multiple times selection configuration */
const periodLabels = {
    morning: 'Matin',
    afternoon: 'Après-midi',
    evening: 'Soir',
};

const isDialogOpen = ref(false);
const selectedTime = ref('');
const selectedPatient = ref(null);
const selectedPeriod = ref('morning');
const selectedCareTypes = ref([]);
const patientCareTypes = ref([]);
const idPatient = ref(null);
const visitTimes = ref([]);

const extractTimes = (patientVis) => {
    if (!Array.isArray(patientVis)) return [];
    return patientVis.flatMap(visit =>
        Array.isArray(visit.visits) ? visit.visits.map(v => formatTime(v.time)) : [],
    );
};

const handlePatientSelection = async (patient) => {
    if (!patient || !patient.id) return;

    idPatient.value = patient.id;

    if (patient?.care_types) {
        patientCareTypes.value = patient.care_types.map(care => care.id);
        selectedCareTypes.value = [...patientCareTypes.value];
    }
    else {
        patientCareTypes.value = [];
        selectedCareTypes.value = [];
    }

    // Récupérer les données après avoir défini l'ID
    const { patientVis, fetchPatientVisit } = detailPatient(idPatient.value);

    await fetchPatientVisit(); // Attendre la récupération
    visitTimes.value = extractTimes(patientVis.value);
};

// Ajouter ou retirer un care type de la sélection
const toggleCareType = (careTypeId) => {
    const index = selectedCareTypes.value.indexOf(careTypeId);
    if (index === -1) {
        selectedCareTypes.value.push(careTypeId);
    }
    else {
        selectedCareTypes.value.splice(index, 1);
    }
};

const openDialog = (period = 'morning') => {
    selectedPeriod.value = period;
    selectedTime.value = '';
    selectedPatient.value = null;
    selectedCareTypes.value = [];
    patientCareTypes.value = [];
    isDialogOpen.value = true;
};

const addPatientToTable = () => {
    if (!selectedPatient.value || !selectedTime.value || !currentDate.value) {
        return;
    }

    // Déterminer la période en fonction de l'heure sélectionnée
    const actualPeriod = determineTimePeriod(selectedTime.value);

    // Initialiser la structure si nécessaire
    if (!datePatients.value[currentDate.value]) {
        datePatients.value[currentDate.value] = {
            morning: [],
            afternoon: [],
            evening: [],
        };
    }

    // Ajouter le patient à la période appropriée pour la date courante
    datePatients.value[currentDate.value][actualPeriod].push({
        id: selectedPatient.value.id,
        firstname: selectedPatient.value.firstname,
        lastname: selectedPatient.value.lastname,
        social_security_number: selectedPatient.value.social_security_number,
        phone_number: selectedPatient.value.phone_number,
        city: selectedPatient.value.profile.city,
        zipCode: selectedPatient.value.profile.zip_code,
        careTypes: [...selectedCareTypes.value],
        time: selectedTime.value,
    });

    // Trier les patients par heure
    datePatients.value[currentDate.value][actualPeriod].sort((a, b) => a.time.localeCompare(b.time));

    // Mettre à jour formData.replacement pour la soumission
    updateReplacementData();

    // Fermer le dialogue et réinitialiser les valeurs
    isDialogOpen.value = false;
    selectedTime.value = '';
    selectedPatient.value = null;
    selectedCareTypes.value = [];
    patientCareTypes.value = [];
};

const { careTypes, fetchCareTypes } = useCareTypes();
const { nursePatients, fetchNursePatients } = useNursePatients();

/** Submission purpose */
const updateReplacementData = () => {
    const replacements = [];

    // Parcourir toutes les dates
    Object.keys(datePatients.value).forEach((date) => {
        // Parcourir toutes les périodes pour cette date
        ['morning', 'afternoon', 'evening'].forEach((period) => {
            // Parcourir tous les patients pour cette période
            if (datePatients.value[date][period] && datePatients.value[date][period].length > 0) {
                datePatients.value[date][period].forEach((patient) => {
                    replacements.push({
                        patientId: patient.id,
                        patientName: patient.lastname,
                        patientFirstname: patient.firstname,
                        patientSecurityNumber: patient.social_security_number,
                        patientPhoneNumber: patient.phone_number,
                        city: patient.city,
                        zipCode: patient.zipCode,
                        date: date,
                        careTypes: patient.careTypes || [],
                        time: patient.time,
                    });
                });
            }
        });
    });

    // Mettre à jour formData avec tous les remplacements
    formData.replacement = replacements;
};

const { tours, fetchTours } = useTours();

const copyCurrentDate = async () => {
    await fetchTours(formData.startDate, formData.startDate);
    await nextTick();

    if (tours.value.length > 0) {
        tours.value.forEach((tour) => {
            if (copiedTours.value.has(tour.id)) return; // Vérifier si la tournée a déjà été copiée

            if (tour.visit_times && tour.visit_times.length > 0) {
                tour.visit_times.forEach((visitTime) => {
                    if (visitTime.visits && visitTime.visits.length > 0) {
                        visitTime.visits.forEach((visit) => {
                            const actualPeriod = determineTimePeriod(formatTime(visit.time));
                            const date = tour.date;

                            // Initialiser la structure si elle n'existe pas
                            if (!datePatients.value[date]) {
                                datePatients.value[date] = {};
                            }
                            if (!datePatients.value[date][actualPeriod]) {
                                datePatients.value[date][actualPeriod] = [];
                            }

                            // Créer un mappage des noms de types de soins à leurs identifiants
                            const careTypeMap = {};
                            tour.patient_care_type.forEach((careType) => {
                                careTypeMap[careType.care_type_name] = careType.care_type_id;
                            });

                            // Convertir les noms des types de soins en identifiants
                            const careTypeIds = visit.care_types.map(careTypeName => careTypeMap[careTypeName]);

                            datePatients.value[date][actualPeriod].push({
                                id: tour.id,
                                firstname: tour.firstname,
                                lastname: tour.lastname,
                                social_security_number: tour.social_security_number,
                                phone_number: tour.phone_number,
                                city: tour.profile.city,
                                zipCode: tour.profile.zip_code,
                                careTypes: careTypeIds, // Utiliser les identifiants au lieu des noms
                                time: formatTime(visit.time),
                            });

                            // Trier les visites par heure
                            datePatients.value[date][actualPeriod].sort((a, b) => a.time.localeCompare(b.time));
                        });
                    }
                });
            }

            copiedTours.value.add(tour.id); // Marquer la tournée comme copiée
        });

        $toast({
            description: 'Tournées du jour copiées avec succès',
        });
    }
    else {
        $toast({
            description: 'Aucune tournée à copier',
        });
    };

    // Mettre à jour formData.replacement pour la soumission
    updateReplacementData();
};

const copyAllDates = async () => {
    await fetchTours(formData.startDate, formData.endDate);

    if (tours.value && tours.value.length > 0) {
        tours.value.forEach((tour) => {
            if (copiedTours.value.has(tour.id)) return; // Vérifier si la tournée a déjà été copiée

            if (tour.visit_times && tour.visit_times.length > 0) {
                tour.visit_times.forEach((visitTime) => {
                    if (visitTime.visits && visitTime.visits.length > 0) {
                        visitTime.visits.forEach((visit) => {
                            const actualPeriod = determineTimePeriod(formatTime(visit.time));
                            const date = tour.date;

                            // Initialiser la structure si elle n'existe pas
                            if (!datePatients.value[date]) {
                                datePatients.value[date] = {};
                            }
                            if (!datePatients.value[date][actualPeriod]) {
                                datePatients.value[date][actualPeriod] = [];
                            }

                            // Créer un mappage des noms de types de soins à leurs identifiants
                            const careTypeMap = {};
                            tour.patient_care_type.forEach((careType) => {
                                careTypeMap[careType.care_type_name] = careType.care_type_id;
                            });

                            // Convertir les noms des types de soins en identifiants
                            const careTypeIds = visit.care_types.map(careTypeName => careTypeMap[careTypeName]);

                            datePatients.value[date][actualPeriod].push({
                                id: tour.id,
                                firstname: tour.firstname,
                                lastname: tour.lastname,
                                social_security_number: tour.social_security_number,
                                phone_number: tour.phone_number,
                                city: tour.profile.city,
                                zipCode: tour.profile.zip_code,
                                careTypes: careTypeIds, // Utiliser les identifiants au lieu des noms
                                time: formatTime(visit.time),
                            });

                            // Trier les visites par heure
                            datePatients.value[date][actualPeriod].sort((a, b) => a.time.localeCompare(b.time));
                        });
                    }
                });
            }

            copiedTours.value.add(tour.id); // Marquer la tournée comme copiée
        });

        $toast({
            description: 'Tournées copiées avec succès',
        });
    }
    else {
        $toast({
            description: 'Aucune tournée à copier',
        });
    };

    // Mettre à jour formData.replacement pour la soumission
    updateReplacementData();
};

const dialogConfirm = ref(false);

const handleRedirection = () => {
    router.push('/dashboard/patients/create');
};

const { submitReplacement } = useReplacements();

const {
    submit,
    inProgress,
} = useSubmit(
    async () => {
        inProgress.value = true;

        updateReplacementData();
        await submitReplacement(formData);
    },
);

const reinitializeData = () => {
    // Réinitialiser toutes les données de patients
    datePatients.value = {};
    formData.replacement = [];
    copiedTours.value.clear(); // Réinitialiser l'indicateur de copie
};

onMounted(() => {
    const now = new Date();
    const currentDateStr = now.toISOString().split('T')[0];
    formData.startDate = currentDateStr;
    currentDate.value = currentDateStr;

    // Initialiser la structure pour la date courante
    datePatients.value[currentDateStr] = {
        morning: [],
        afternoon: [],
        evening: [],
    };

    fetchNursePatients();
    fetchCareTypes();
});

useHead({
    title: 'Créer un remplacement',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
    ssr: false,
});
</script>
