<template>
    <div class="pt-4">
        <Form>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CalendarTours
                    v-model="value"
                    class="rounded-md shadow-lg"
                />
                <div class="w-full bg-gray-100 rounded-lg h-full">
                    <div class="bg-primary rounded-t-lg flex items-center ps-4 h-12">
                        <h2 class="font-bold text-white">
                            Liste Patients
                        </h2>
                    </div>

                    <div class="p-5">
                        <p v-if="selectedDate === null">
                            Aujourd'hui : {{ today }}
                        </p>
                        <p v-else>
                            Pour la date de : {{ selectedDate }}
                        </p>
                        <Separator class="opacity-70 mt-4" />
                        <div class="w-full max-h-64 overflow-y-scroll mt-4 space-y-2">
                            <div>
                                <div
                                    v-if="loading"
                                    class="flex justify-center items-center"
                                >
                                    <p>Chargement...</p>
                                </div>
                                <div
                                    v-if="error"
                                    class="flex justify-center items-center text-red-500"
                                >
                                    <p>Erreur lors du chargement des données : {{ error.message }}</p>
                                </div>
                                <div v-if="tours.length > 0 && !loading && !error">
                                    <div
                                        v-for="(patient, index) in tours"
                                        :key="patient.id"
                                    >
                                        <div
                                            class="bg-gray-200 rounded-lg flex items-center ps-4 h-10 shadow-sm mt-2 cursor-pointer"
                                            :class="{
                                                'bg-primary text-white': selectedPatientId === patient.id || (index === 0 && !selectedPatientId),
                                            }"
                                            @click="handleFetchCareType(patient.id)"
                                        >
                                            <p class="flex justify-between w-full">
                                                <span>{{ patient.firstname }} {{ patient.lastname }}
                                                </span>
                                            </p>
                                            <div class="flex mr-4">
                                                <XCircleIcon
                                                    class="h-6 w-6 mr-2 text-transparent stroke-gray-500 stroke-2"
                                                    @click="openDialog"
                                                />
                                            </div>
                                        </div>
                                        <Dialog v-model:open="isDialogOpen">
                                            <DialogContent class="h-[28vh]">
                                                <DialogHeader>
                                                    <DialogTitle>Confirmer la suppression</DialogTitle>
                                                    <DialogDescription>
                                                        Etes-vous sur de vouloir supprimer ce patient ?
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div class="flex space-x-8 justify-end items-center">
                                                    <Button
                                                        variant="secondary"
                                                        @click="closeDialog"
                                                    >
                                                        Annuler
                                                    </Button>
                                                    <Button
                                                        @click="submitDelete(patient.id, patient.visit_times?.[0]?.id)"
                                                    >
                                                        Oui
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                                <div v-else-if="tours.length === 0 && !loading && !error">
                                    <p>Pas de données retournés</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div v-if="patientLoading">
                    Chargement des données du patient ...
                </div>
                <div v-if="patientError">
                    Erreur : {{ patientError.message }}
                </div>
                <div v-if="patient && patient.patient">
                    <div class="mt-6">
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                            <div class="w-full">
                                <div class="flex items-center bg-primary text-white p-4 rounded-lg">
                                    <div class="flex-shrink-0">
                                        <NuxtImg
                                            src="/home/infirmier_homme.png"
                                            class="rounded-full h-16 w-16"
                                        />
                                    </div>
                                    <div class="ml-4 flex flex-grow justify-between items-center">
                                        <div class="text-lg">
                                            {{ patient.patient[0].firstname }} <span class="font-semibold">{{ patient.patient[0].lastname }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-gray-100">
                                    <div class="mt-4 bg-primary text-white p-2.5 rounded-t-lg font-bold text-lg">
                                        Information :
                                    </div>

                                    <div class="mt-4 p-4 rounded-lg shadow">
                                        <div class="flex justify-between items-center border-b pb-2">
                                            <span class="font-bold">Genre</span>
                                            <span class="w-2/3 text-center">{{ patient.patient[0].gender ?? 'Pas de données pour l\'instant' }}</span>
                                        </div>
                                        <div class="flex justify-between items-center border-b py-2">
                                            <span class="font-bold">Groupe sanguin</span>
                                            <span class="w-2/3 text-center">- - - - -</span>
                                        </div>
                                        <div class="flex justify-between items-center border-b py-2">
                                            <span class="font-bold">Allergies</span>
                                            <span class="w-2/3 text-center">
                                                <div v-if="patient?.patient[0]?.care_informations && patient.patient[0].care_informations.length > 0">
                                                    <div>
                                                        <span
                                                            v-for="(careInfo, index) in patient.patient[0].care_informations"
                                                            :key="careInfo.record_name"
                                                        >
                                                            {{ careInfo.record_name }}
                                                            <span v-if="index < patient.patient[0].care_informations.length - 1">, </span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div v-else>
                                                    Pas de données pour l'instant
                                                </div>
                                            </span>
                                        </div>
                                        <div class="flex justify-between items-center border-b py-2">
                                            <span class="font-bold">Maladies</span>
                                            <span class="w-2/3 text-center">- - - - -</span>
                                        </div>
                                        <div class="flex justify-between items-center border-b py-2">
                                            <span class="font-bold">Hauteur</span>
                                            <span class="w-2/3 text-center">- - - - -</span>
                                        </div>
                                        <div class="flex justify-between items-center border-b py-2">
                                            <span class="font-bold">Poids</span>
                                            <span class="w-2/3 text-center">- - - - -</span>
                                        </div>
                                        <div class="flex justify-between items-center border-b py-2">
                                            <span class="font-bold">Visite perdue</span>
                                            <span class="w-2/3 text-center">- - - - -</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="w-full">
                                <div class="bg-gray-100 rounded-lg flex flex-col items-center pb-6">
                                    <div class="bg-primary text-white p-2.5 rounded-t-lg font-bold w-full text-lg flex">
                                        <HomeIcon class="h-6 w-6 text-white mr-2" /> Ville
                                    </div>
                                    <div class="bg-white w-4/5 text-center rounded-full mt-4 py-3 border-2 border-primary">
                                        {{ patient.patient[0].profile.city ?? 'Pas de données pour l\'instant' }}
                                    </div>
                                </div>

                                <div class="bg-gray-100 rounded-lg flex flex-col items-center pb-6 mt-6">
                                    <div class="bg-primary text-white p-2.5 rounded-t-lg font-bold text-lg w-full flex">
                                        <InboxIcon class="h-6 w-6 text-white mr-2" /> Code postal
                                    </div>
                                    <div class="bg-white w-4/5 text-center rounded-full mt-4 py-3 border-2 border-primary">
                                        {{ patient.patient[0].profile.zip_code ?? 'Pas de données pour l\'instant' }}
                                    </div>
                                </div>

                                <div class="bg-gray-100 rounded-lg flex flex-col items-center pb-6 mt-6">
                                    <div class="bg-primary text-white p-2.5 rounded-t-lg font-bold text-lg w-full flex">
                                        <ClockIcon class="h-6 w-6 text-white mr-2" /> Créneau horaire
                                    </div>
                                    <div v-if="patient?.patient[0]?.visit_times && patient.patient[0].visit_times.length > 0">
                                        <div
                                            v-for="visit in patient.patient[0].visit_times"
                                            :key="visit.patient_id"
                                        >
                                            <div
                                                v-for="visitItem in visit.visits"
                                                :key="visitItem.time"
                                            >
                                                <div class="w-full flex flex-col items-center">
                                                    <div class="w-full rounded-lg mt-4 py-4 px-20 bg-primary text-white text-center">
                                                        {{ translatedVisitPeriod(visitItem.visit_period) }}
                                                    </div>
                                                    <div class="bg-white w-full text-center rounded-lg mt-4 py-3 border-2 border-gray-300 text-gray-400">
                                                        {{ visitItem.time }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else-if="!patient?.patient[0]?.visit_times || patient.patient[0].visit_times.length === 0">
                                        <p class="text-center text-gray-500">
                                            Pas de créneau trouvé
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="w-full">
                                <div class="bg-gray-100 rounded-lg">
                                    <div class="bg-primary text-white p-2.5 rounded-t-lg text-center font-bold text-lg">
                                        Liste des types de soins
                                    </div>
                                    <div v-if="careTypeLoading">
                                        Loading care type list ...
                                    </div>
                                    <div v-if="careTypeError">
                                        Error: {{ careTypeError.message }}
                                    </div>
                                    <div class="p-4 space-y-2">
                                        <div v-if="careType && careType.patient_care_types && careType.patient_care_types.length > 0">
                                            <div
                                                v-for="(care, index) in careType.patient_care_types"
                                                :key="index"
                                                class="bg-gray-200 p-3 rounded-lg mt-2"
                                            >
                                                {{ care.care_type_name }}
                                            </div>
                                        </div>
                                        <div v-else-if="careType && (!careType.patient_care_types || careType.patient_care_types.length === 0)">
                                            Pas de données pour l'instant
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    </div>
</template>

<script lang="ts" setup>
import {
    XCircleIcon,
    InboxIcon,
    ClockIcon,
    HomeIcon,
} from '@heroicons/vue/24/solid';

import { ref, watch } from 'vue';
import { CalendarDate } from '@internationalized/date';
import { CalendarTours } from '@/components/ui/calendar';
import { useTours, useCareType, usePatient, deleteTour } from '~/composables/useTours';

const { tours, error, loading, fetchTours } = useTours();
const { careType, careTypeLoading, careTypeError, fetchCareType } = useCareType();
const { patient, patientLoading, patientError, fetchPatient } = usePatient();

const selectedPatientId = ref(null);

const isDialogOpen = ref(false);

const openDialog = () => {
    isDialogOpen.value = true;
};

const closeDialog = () => {
    isDialogOpen.value = false;
};

const submitDelete = async (patientId, visitId) => {
    console.log('Patient ID:', patientId);
    console.log('Visit ID:', visitId);

    if (!visitId) {
        console.error('visitId est undefined !');
        return;
    }

    await deleteTour(patientId, visitId);
    closeDialog();
    navigateTo(useRoute().fullPath, { replace: true });
};

const today = computed(() => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
});

const value = ref(
    new CalendarDate(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate(),
    ),
);

const selectedDate = computed(() => {
    if (
        value.value.day === new Date().getDate() && value.value.month === new Date().getMonth() + 1 && value.value.year === new Date().getFullYear()
    ) {
        return null;
    }
    const day = String(value.value.day).padStart(2, '0');
    const month = String(value.value.month).padStart(2, '0');
    const year = value.value.year;
    return `${day}-${month}-${year}`;
});

const formatDate = (calendarDate) => {
    return `${calendarDate.year}-${String(calendarDate.month).padStart(2, '0')}-${String(calendarDate.day).padStart(2, '0')}`;
};

const translatedVisitPeriod = (visitPeriod: string) => {
    switch (visitPeriod.toLowerCase()) {
        case 'morning':
            return 'Matin';
        case 'afternoon':
            return 'Après-midi';
        case 'evening':
            return 'Soirée';
        default:
            return visitPeriod;
    }
};

const formattedStart = ref('');

watch(value, (newValue) => {
    const startDate = newValue;
    formattedStart.value = `${startDate.year}-${String(startDate.month).padStart(2, '0')}-${String(startDate.day).padStart(2, '0')}`;
    fetchTours(formattedStart.value, formattedStart.value);
}, { deep: true });

const formattedInitialStart = ref('');

onMounted(() => {
    const now = new Date();
    const initialStartDate = value.value || new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
    formattedInitialStart.value = formatDate(initialStartDate);
    fetchTours(formattedInitialStart.value, formattedInitialStart.value);
});

const handleFetchCareType = (patientId) => {
    if (selectedPatientId.value === patientId) {
        selectedPatientId.value = null;
    }
    else {
        selectedPatientId.value = patientId;
        fetchCareType(patientId);
        fetchPatient(patientId, formattedStart.value, formattedStart.value);
    }
};

watch(tours, (newTours) => {
    if (newTours.length > 0) {
        if (!selectedPatientId.value) {
            selectedPatientId.value = newTours[0].id;
            fetchCareType(selectedPatientId.value);
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            fetchPatient(selectedPatientId.value, formattedDate, formattedDate);
        }
    }
}, { immediate: true, deep: true });

useHead({
    title: 'Gestion Tournées',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
});
</script>
