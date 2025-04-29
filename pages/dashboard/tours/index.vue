<template>
    <div class="pt-4">
        <Form>
            <div class="lg:pr-6">
                <div class="grid grid-cols-1 lg:grid-cols-[10%_50%_38%] gap-5">
                    <div class="flex justify-center items-center">
                        <a
                            href="/dashboard/replacements/immediate"
                            class="transition-transform transform hover:scale-105"
                        >
                            <img
                                src="/public/images/home/help_me.png"
                                class="h-32 w-32 object-contain"
                                alt="Aide"
                            >
                        </a>
                    </div>
                    <CalendarTours
                        v-model="value"
                        class="rounded-md shadow-lg w-full"
                    />
                    <div class="w-full bg-gray-100 rounded-lg h-full mr-8">
                        <div class="bg-primary rounded-t-lg flex justify-between items-center px-2 ps-4 h-12">
                            <h2 class="font-bold text-white">
                                Liste des patients
                            </h2>
                            <div title="Créer un nouveau patient">
                                <a href="/dashboard/patients/create">
                                    <PlusCircleIcon class="w-6 h-6 text-white cursor-pointer mr-2" />
                                </a>
                            </div>
                        </div>

                        <div class="p-5">
                            <p v-if="selectedDate === null">
                                Aujourd'hui : {{ today }}
                            </p>
                            <p v-else>
                                Date du : {{ selectedDate }}
                            </p>
                            <Separator class="mt-4 h-px bg-neutral-700 opacity-100" />
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
                                            v-for="(item, index) in tours"
                                            :key="item.id"
                                        >
                                            <div
                                                class="bg-gray-200 rounded-lg shadow-sm mt-2 cursor-pointer w-full px-4 py-2 flex items-center justify-between"
                                                :class="{
                                                    'bg-primary text-white': selectedPatientId === item.id || (index === 0 && !selectedPatientId),
                                                }"
                                                @click="handleFetchCareType(item.id)"
                                            >
                                                <div class="flex items-center gap-3">
                                                    <div class="flex-shrink-0">
                                                        <img
                                                            v-if="item.profile?.profil_url"
                                                            :src="$config.public.API_URL + '/storage/' + item.profile.profil_url"
                                                            alt="Photo de profil"
                                                            class="rounded-full h-9 w-9 object-cover"
                                                        >
                                                        <UserCircleIcon
                                                            v-else
                                                            class="h-10 w-10 text-gray-400"
                                                        />
                                                    </div>
                                                    <div class="text-sm font-medium">
                                                        {{ item.firstname }} {{ item.lastname }}
                                                    </div>
                                                </div>
                                                <div
                                                    class="flex items-center gap-2"
                                                    @click.stop="openDialog(item.id, item.visit_times?.[0]?.id)"
                                                >
                                                    <div title="Exclure de la tournée du jour">
                                                        <XCircleIcon class="h-5 w-5 text-white stroke-2 cursor-pointer" />
                                                    </div>
                                                    <CheckCircleIcon class="h-5 w-5 text-white stroke-2 cursor-pointer" />
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
                                                        <Button @click="submitDelete">
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
            </div>
            <div>
                <div v-if="selectedPatient">
                    <div class="mt-6 lg:pr-6">
                        <div class="grid grid-cols-1 lg:grid-cols-[32.5%_32.5%_35%] gap-2 w-full">
                            <div class="w-full">
                                <div class="flex items-center bg-primary text-white p-4 rounded-lg">
                                    <div class="flex-shrink-0">
                                        <img
                                            v-if="selectedPatient.profile?.profil_url"
                                            :src="$config.public.API_URL + '/storage/' + selectedPatient.profile.profil_url"
                                            alt="Photo de profil"
                                            class="rounded-full h-20 w-20"
                                        >
                                        <UserCircleIcon
                                            v-else
                                            class="size-20"
                                        />
                                    </div>
                                    <div class="ml-4 flex flex-grow justify-between items-center">
                                        <div class="text-lg">
                                            <span class="font-semibold">{{ selectedPatient.firstname }}</span> {{ selectedPatient.lastname }}
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-gray-100">
                                    <div class="mt-4 bg-primary h-11 text-white p-2.5 rounded-t-lg font-bold text-lg">
                                        <span class="ml-4">Information :</span>
                                    </div>

                                    <div class="mt-4 p-4 rounded-lg shadow flex flex-col gap-y-4">
                                        <div class="flex justify-between items-center border-b py-0">
                                            <span class="font-bold">Téléphone</span>
                                            <span class="w-2/3 text-left pl-4">{{ selectedPatient.phone_number ?? 'Pas de données' }}</span>
                                        </div>
                                        <div class="flex justify-between items-center border-b py-0">
                                            <span class="font-bold">Adresse</span>
                                            <span class="w-2/3 text-left pl-4">{{ selectedPatient.profile.street_address ?? 'Pas de données' }}</span>
                                        </div>
                                        <div class="flex justify-between items-center border-b py-0">
                                            <span class="font-bold">Genre</span>
                                            <span class="w-2/3 text-left pl-4">{{ selectedPatient.gender ?? 'Pas de données' }}</span>
                                        </div>
                                        <template
                                            v-if="selectedPatient?.care_informations && selectedPatient.care_informations.length > 0"
                                        >
                                            <div
                                                v-for="(careInfo, index) in selectedPatient.care_informations"
                                                :key="index"
                                                class="flex justify-between items-center border-b py-0"
                                            >
                                                <span class="font-bold">{{ careInfo.record_type }}</span>
                                                <span class="w-2/3 text-left pl-4">{{ careInfo.record_name }}</span>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>

                            <div class="w-full pl-2">
                                <div class="bg-gray-100 rounded-lg flex flex-col items-center pb-6">
                                    <div
                                        class="bg-primary text-white p-2.5 rounded-t-lg font-bold w-full text-base flex"
                                    >
                                        <HomeIcon class="h-6 w-6 text-white mr-2" /> Ville
                                    </div>
                                    <div
                                        class="bg-white w-64 text-center rounded-full mt-4 py-2 border-2 border-primary"
                                    >
                                        {{ selectedPatient.profile?.city ?? 'Pas de données pour l\'instant' }}
                                    </div>
                                </div>

                                <div class="bg-gray-100 rounded-lg flex flex-col items-center pb-6 mt-6">
                                    <div
                                        class="bg-primary text-white p-2.5 rounded-t-lg font-bold text-base w-full flex"
                                    >
                                        <InboxIcon class="h-6 w-6 text-white mr-2" /> Code postal
                                    </div>
                                    <div
                                        class="bg-white w-64 text-center rounded-full mt-4 py-2 border-2 border-primary"
                                    >
                                        {{ selectedPatient.profile?.zip_code ?? 'Pas de données pour l\'instant' }}
                                    </div>
                                </div>

                                <div class="bg-gray-100 rounded-lg flex flex-col items-center pb-6 mt-6">
                                    <div
                                        class="bg-primary text-white p-2.5 rounded-t-lg font-bold text-base w-full flex"
                                    >
                                        <ClockIcon class="h-6 w-6 text-white mr-2" /> Créneau horaire
                                    </div>
                                    <div
                                        v-if="selectedPatient?.visit_times && selectedPatient.visit_times.length > 0"
                                    >
                                        <div
                                            v-for="visit in selectedPatient.visit_times"
                                            :key="visit.patient_id"
                                            class="w-64"
                                        >
                                            <div
                                                v-for="visitItem in visit.visits"
                                                :key="visitItem.time"
                                                class="w-full flex flex-col items-center"
                                            >
                                                <div class="w-full max-w-lg mx-auto">
                                                    <div
                                                        class="w-full rounded-lg mt-4 py-3 bg-primary text-white text-center"
                                                    >
                                                        {{ translatedVisitPeriod(visitItem.visit_period) }}
                                                    </div>
                                                    <div
                                                        class="bg-white w-full text-center rounded-lg mt-4 py-2 border-2 border-gray-300 text-gray-400"
                                                    >
                                                        {{ visitItem.time }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        v-else
                                    >
                                        <p class="text-center text-gray-500">
                                            Pas de créneau trouvé
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="w-full pl-2">
                                <div class="bg-gray-100 rounded-lg">
                                    <div
                                        class="bg-primary text-white p-2.5 rounded-t-lg text-center font-bold text-base"
                                    >
                                        Liste des types de soins
                                    </div>
                                    <div class="p-4 space-y-2">
                                        <div
                                            v-if="hasCareTypes"
                                        >
                                            <div
                                                v-for="(care, index) in uniqueCareTypes"
                                                :key="index"
                                                class="bg-gray-200 p-3 rounded-lg mt-2"
                                            >
                                                {{ care }}
                                            </div>
                                        </div>
                                        <div
                                            v-else
                                        >
                                            <p class="text-center text-gray-500">
                                                Pas de données pour l'instant
                                            </p>
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
    UserCircleIcon,
    CheckCircleIcon,
    PlusCircleIcon,
} from '@heroicons/vue/24/solid';

import { ref, watch, computed } from 'vue';
import { CalendarDate } from '@internationalized/date';
import { CalendarTours } from '@/components/ui/calendar';
import { useTours, deleteTour } from '~/composables/useTours';

const { tours, error, loading, fetchTours } = useTours();

const selectedPatientId = ref(null);

const isDialogOpen = ref(false);
const patientToDelete = ref(null);
const formattedStart = ref('');
const formattedInitialStart = ref('');

const selectedPatient = computed(() => {
    const patient = tours.value.find(p => p.id === selectedPatientId.value);
    return patient;
});

const openDialog = (patientId, visitId) => {
    patientToDelete.value = { patientId, visitId };
    isDialogOpen.value = true;
};

const closeDialog = () => {
    isDialogOpen.value = false;
};

const submitDelete = async () => {
    if (!patientToDelete.value) return;

    const { patientId, visitId } = patientToDelete.value;
    try {
        // 1. Saving references before modification
        const currentTours = tours.value;
        const currentSelectedId = selectedPatientId.value;

        // 2. Local deletion
        tours.value = currentTours.filter(patient => patient.id !== patientId);

        if (currentSelectedId === patientId) {
            selectedPatientId.value = tours.value[0]?.id || null;
        }

        // 4. API Removal (Background)
        await deleteTour(patientId, visitId).catch((error) => {
            console.error('Erreur API, rollback:', error);
            tours.value = currentTours;
            selectedPatientId.value = currentSelectedId;
        });

        closeDialog();
    }
    catch (error) {
        console.error('Erreur lors de la suppression:', error);
    }
};

const today = computed(() => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
});

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

const uniqueCareTypes = computed(() => {
    if (!selectedPatient.value?.patient_care_type) return [];

    return [...new Set(
        selectedPatient.value.patient_care_type
            .map(care => care.care_type_name)
            .filter(name => name),
    )];
});

const hasCareTypes = computed(() => {
    return uniqueCareTypes.value.length > 0;
});

const formatDate = (calendarDate) => {
    return `${calendarDate.year}-${String(calendarDate.month).padStart(2, '0')}-${String(calendarDate.day).padStart(2, '0')}`;
};

const handleFetchCareType = (patientId: number) => {
    const wasSelected = selectedPatientId.value === patientId;
    selectedPatientId.value = wasSelected ? null : patientId;
};

const selectedDate = ref(null);
const value = ref(
    new CalendarDate(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate(),
    ),
);

watch(value, (newValue) => {
    const day = String(newValue.day).padStart(2, '0');
    const month = String(newValue.month).padStart(2, '0');
    const year = newValue.year;
    const formattedDate = `${day}-${month}-${year}`;
    if (selectedDate.value !== formattedDate) {
        selectedDate.value = formattedDate;
    }
    formattedStart.value = `${newValue.year}-${String(newValue.month).padStart(2, '0')}-${String(newValue.day).padStart(2, '0')}`;
    selectedPatientId.value = null;
    fetchTours(formattedStart.value, formattedStart.value);
}, { deep: true });

watch(tours, (newTours) => {
    if (newTours.length > 0 && !selectedPatientId.value) {
        selectedPatientId.value = newTours[0].id;
    }
}, { immediate: true });

onMounted(() => {
    const now = new Date();
    const initialStartDate = value.value || new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
    formattedInitialStart.value = formatDate(initialStartDate);

    fetchTours(formattedInitialStart.value, formattedInitialStart.value);
});

useHead({
    title: 'Tournées',
});

definePageMeta({
    middleware: ['auth', 'verified'],
    layout: 'dashboard',
    ssr: false,
});
</script>
