<template>
    <Form
        v-if="patient"
        class="grid grid-cols-[40%_57.5%] gap-6"
        @submit="submit"
    >
        <section class="flex flex-col justify-between mb-8">
            <div class="space-y-6">
                <div class="bg-primary p-6 rounded-xl flex flex-col space-y-3 justify-center items-center px-auto">
                    <UserCircleIcon class="text-white w-28" />
                    <p class="text-white">
                        <span class="font-semibold">
                            {{ patient.lastname }}
                        </span>
                        {{ patient.firstname }}
                    </p>
                    <Button
                        variant="secondary"
                        class="text-primary"
                        @click="openDialog"
                    >
                        Mettre à jour
                    </Button>

                    <Dialog v-model:open="isOpenDialog">
                        <DialogContent class="sm:max-w-xl h-[70vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Mise à jour</DialogTitle>
                                <DialogDescription>
                                    Vous pouvez mettre à jour ici les informations personnelles du patient
                                </DialogDescription>
                            </DialogHeader>

                            <div class="mt-4 space-y-3">
                                <div class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full">
                                    <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                        Nom
                                    </p>
                                    <Input
                                        v-model="formData.lastname"
                                        type="text"
                                        class="bg-transparent placeholder:text-black"
                                    />
                                </div>
                                <div class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full">
                                    <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                        Prénom
                                    </p>
                                    <Input
                                        v-model="formData.firstname"
                                        type="text"
                                        class="bg-transparent placeholder:text-black"
                                    />
                                </div>
                                <div class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full">
                                    <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                        Email
                                    </p>
                                    <Input
                                        v-model="formData.email"
                                        type="email"
                                        class="bg-transparent placeholder:text-black"
                                    />
                                </div>
                                <div class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full">
                                    <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                        Sécurité sociale
                                    </p>
                                    <Input
                                        v-model="formData.socialSecurityNumber"
                                        type="text"
                                        class="bg-transparent placeholder:text-black"
                                    />
                                </div>
                                <div class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full">
                                    <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                        Téléphone
                                    </p>
                                    <Input
                                        v-model="formData.phoneNumber"
                                        type="text"
                                        class="bg-transparent placeholder:text-black"
                                    />
                                </div>
                                <div class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full">
                                    <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                        Code postal
                                    </p>
                                    <Input
                                        v-model="formData.zipCode"
                                        type="text"
                                        class="bg-transparent placeholder:text-black"
                                    />
                                </div>
                                <div class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full">
                                    <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                        Ville
                                    </p>
                                    <Input
                                        v-model="formData.city"
                                        type="text"
                                        class="bg-transparent placeholder:text-black"
                                    />
                                </div>
                            </div>

                            <Button
                                class="text-end mt-6 mx-36"
                                @click="closeDialog"
                            >
                                Valider
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>

                <div class="bg-gray-100 rounded-b">
                    <h3 class="bg-primary flex justify-between items-center text-white p-6 rounded-t">
                        <span>Information</span>
                        <PencilSquareIcon class="w-5 text-white" />
                    </h3>

                    <div class="px-4 py-6">
                        <template v-if="patient && Array.isArray(patient.care_informations) && patient.care_informations.length > 0">
                            <div
                                v-for="(careInformation, careIndex) in patient.care_informations"
                                :key="careIndex"
                                class="space-y-5"
                            >
                                <div class="grid grid-cols-[40%_60%] gap-4">
                                    <h6 class="font-semibold">
                                        Type de maladie
                                    </h6>
                                    <p>
                                        {{ careInformation.record_type }}
                                    </p>
                                </div>
                                <div class="grid grid-cols-[40%_60%] gap-4">
                                    <h6 class="font-semibold">
                                        Facteur
                                    </h6>
                                    <p>
                                        {{ careInformation.record_name }}
                                    </p>
                                </div>
                                <div class="grid grid-cols-[40%_60%] gap-4">
                                    <h6 class="font-semibold">
                                        Gravité
                                    </h6>
                                    <p>
                                        {{ severities[careInformation.record_severity] }}
                                    </p>
                                </div>
                                <div class="grid grid-cols-[40%_60%] gap-4">
                                    <h6 class="font-semibold">
                                        Détail
                                    </h6>
                                    <p>
                                        {{ careInformation.record_details }}
                                    </p>
                                </div>
                                <hr class="border border-gray-200">
                            </div>
                        </template>
                        <template v-else>
                            <p class="text-center text-sm text-black/40 p-6">
                                Aucune information à afficher pour le moment
                            </p>
                        </template>
                    </div>
                </div>
            </div>

            <Button
                class="mt-8"
                type="submit"
                :in-progress="inProgress"
            >
                Enregistrer
            </Button>
        </section>

        <section class="mb-8">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h3 class="p-2 bg-primary text-white rounded-t">
                        Date de début d'intervention
                    </h3>
                    <div class="bg-gray-100 p-4">
                        <div class="flex justify-center mx-auto bg-primary rounded-full px-3 h-9 items-center text-white w-52">
                            <CalendarDaysIcon class="w-5" />
                            <Input
                                v-model="patient.care_start_date"
                                type="date"
                                class="bg-transparent"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <h3 class="p-2 bg-primary text-white rounded-t">
                        Date de fin d'intervention
                    </h3>
                    <div class="bg-gray-100 p-4">
                        <div class="flex justify-center mx-auto bg-primary rounded-full px-3 h-9 items-center text-white w-52">
                            <CalendarDaysIcon class="w-5" />
                            <Input
                                v-model="formData.careEndDate"
                                type="date"
                                class="bg-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col space-y-4 mt-6">
                <div
                    v-for="(visit, visitIndex) in formData.visits"
                    :key="visitIndex"
                    class="w-full"
                >
                    <div class="bg-gray-100 p-5 rounded">
                        <div class="flex justify-between items-center">
                            <h3 class="text-primary">
                                Heure de visite théorique
                            </h3>
                            <button
                                v-if="formData.visits.length > 1"
                                class="text-red-500 hover:text-red-700"
                                type="button"
                                @click="removeVisit(visitIndex)"
                            >
                                Supprimer ce jour
                            </button>
                        </div>

                        <div class="grid grid-cols-[30%_70%] items-center mt-4">
                            <h5>Jour</h5>
                            <Select v-model="visit.dayOfVisit">
                                <SelectTrigger
                                    class="w-full bg-white shadow rounded-full text-nowrap border border-none"
                                    position="right"
                                >
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent class="border border-none">
                                    <template
                                        v-for="[key, value] in Object.entries(days)"
                                        :key="key"
                                    >
                                        <SelectItem :value="key">
                                            {{ value }}
                                        </SelectItem>
                                    </template>
                                </SelectContent>
                            </Select>
                        </div>

                        <div
                            v-for="(timeSlot, timeIndex) in visit.theoreticalVisitTimes"
                            :key="timeIndex"
                        >
                            <hr class="border border-gray-200 my-5">

                            <div class="flex justify-end items-center">
                                <XMarkIcon
                                    v-if="visit.theoreticalVisitTimes.length > 1"
                                    class="w-5 text-primary cursor-pointer"
                                    @click="removeTimeSlot(visitIndex, timeIndex)"
                                />
                            </div>

                            <div class="grid grid-cols-[30%_70%] items-center mt-4">
                                <h5>Heure</h5>
                                <InputTime
                                    v-model="timeSlot.time"
                                    input-class="shadow rounded-full"
                                />
                            </div>

                            <div class="grid grid-cols-[30%_70%] items-center mt-4">
                                <h5>Type de soin</h5>
                                <Select
                                    v-model="timeSlot.careTypeId"
                                    multiple
                                >
                                    <SelectTrigger
                                        class="w-full bg-white shadow rounded-full text-nowrap border border-none"
                                        position="right"
                                    >
                                        <SelectValue class="truncate w-[35rem]">
                                            {{ getSelectedCareTypesText(timeSlot.careTypeId) }}
                                        </SelectValue>
                                    </SelectTrigger>

                                    <SelectContent class="border border-none">
                                        <SelectGroup class="w-32">
                                            <div
                                                v-for="careType in careTypes"
                                                :key="careType.id"
                                                class="flex items-center space-2 mb-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                                @click="handleCareTypeClick(timeSlot, careType.id)"
                                            >
                                                <Checkbox
                                                    :checked="timeSlot.careTypeId.includes(careType.id)"
                                                    class="mr-2"
                                                />
                                                <label class="text-xs text-nowrap cursor-pointer">
                                                    {{ careType.name }}
                                                </label>
                                            </div>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <PlusIcon
                            class="w-6 text-primary mt-8 ml-auto cursor-pointer"
                            title="Ajouter un autre heure"
                            @click="addTimeSlot(visitIndex)"
                        />
                    </div>
                </div>

                <Button
                    class="flex justify-center items-center mx-auto mt-4"
                    type="button"
                    @click="addVisit"
                >
                    <PlusIcon class="w-5 h-5 mr-2" />
                    <span>Ajouter un autre jour</span>
                </Button>
            </div>

            <div class="bg-gray-100 p-6 rounded mt-8">
                <h2 class="text-primary">
                    Liste des documents
                </h2>

                <Button class="w-full flex items-center justify-center mt-4">
                    <PlusIcon class="w-5" />
                    Ajouter un document
                </Button>

                <div class="grid my-4">
                    <Table>
                        <TableBody>
                            <template
                                v-if="prescriptions.length == 0"
                            >
                                <p class="mt-16 text-center text-black/60">
                                    Aucun document disponible pour le moment
                                </p>
                            </template>
                            <template
                                v-for="prescription in prescriptions"
                                v-else
                                :key="prescription.id"
                            >
                                <TableRow class="grid grid-cols-[80%_20%] gap-2 border border-none overflow-x-hidden">
                                    <TableCell class="bg-gray-100">
                                        <div class="flex h-10 rounded bg-gray-200 justify-between items-center">
                                            <span class="truncate w-full px-2 text-center mx-auto">
                                                {{ prescription.name }}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell class="bg-gray-100">
                                        <div class="flex h-10 rounded bg-gray-200 justify-center items-center">
                                            <CloudArrowDownIcon class="w-5 cursor-pointer" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </template>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </section>
    </Form>
</template>

<script lang="ts" setup>
import {
    PlusIcon,
    UserCircleIcon,
    CloudArrowDownIcon,
    PencilSquareIcon,
    XMarkIcon,
    CalendarDaysIcon,
} from '@heroicons/vue/24/solid';
import { useCareTypes } from '~/composables/useCareTypes';
import { detailPatient } from '~/composables/usePatients';
import { InputTime } from '@/components/ui/input-time';

const { careTypes, fetchCareTypes } = useCareTypes();

const route = useRoute();
const patientId = route.params.id as string;

const { patient, fetchDetailPatient } = detailPatient(patientId);
const user = useState('user');

// Fonction pour trouver l'ID du type de soin par son nom
const findCareTypeIdByName = (name) => {
    return careTypes.value.find(ct => ct.name === name)?.id;
};

const { $toast } = useNuxtApp();

// Fonction de migration des horaires de visite
const migrateVisitTimes = (oldVisitTimes) => {
    if (!oldVisitTimes) return [];

    // Créer une Map pour stocker les visites par jour
    const visitsByDay = new Map();

    // Parcourir les anciennes visites et les organiser par jour
    oldVisitTimes.forEach((oldVisit) => {
        const dayVisits = visitsByDay.get(oldVisit.day_of_visit) || {
            dayOfVisit: oldVisit.day_of_visit,
            theoreticalVisitTimes: [],
        };

        // Ajouter les nouvelles heures de visite
        oldVisit.visits.forEach((visit) => {
            const careTypeIds = visit.care_types
                .map(name => findCareTypeIdByName(name))
                .filter(id => id !== undefined);

            // Vérifier si cette heure existe déjà
            const existingTimeSlot = dayVisits.theoreticalVisitTimes.find(
                slot => slot.time === visit.time.substring(0, 5),
            );

            if (existingTimeSlot) {
                // Fusionner les types de soins sans doublons
                existingTimeSlot.careTypeId = Array.from(new Set([
                    ...existingTimeSlot.careTypeId,
                    ...careTypeIds,
                ]));
            }
            else {
                // Ajouter un nouveau créneau horaire
                dayVisits.theoreticalVisitTimes.push({
                    time: formatTime(visit.time),
                    careTypeId: careTypeIds,
                });
            }
        });

        // Trier les heures de visite
        dayVisits.theoreticalVisitTimes.sort((a, b) => a.time.localeCompare(b.time));

        visitsByDay.set(oldVisit.day_of_visit, dayVisits);
    });

    return Array.from(visitsByDay.values()).sort((a, b) => {
        const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        return dayOrder.indexOf(a.dayOfVisit) - dayOrder.indexOf(b.dayOfVisit);
    });
};

// Attendre que les données du patient soient chargées avant d'initialiser formData
const formData = ref({
    nurseId: '',
    lastname: '',
    firstname: '',
    email: '',
    socialSecurityNumber: '',
    phoneNumber: '',
    zipCode: '',
    city: '',
    careStartDate: '',
    careEndDate: '',
    availability: [],
    care_informations: [],
    visits: [],
    patient_care_type: [],
    patient_documents: [],
});

// Le reste de votre code reste exactement le même
const initializeFormData = () => {
    if (patient.value && user.value?.nurse) {
        formData.value = {
            nurseId: user.value.nurse.id,
            lastname: patient.value.lastname || '',
            firstname: patient.value.firstname || '',
            email: patient.value.email || '',
            socialSecurityNumber: patient.value.social_security_number || '',
            phoneNumber: patient.value.phone_number || '',
            zipCode: patient.value.profile?.zip_code || '',
            city: patient.value.profile?.city || '',
            careStartDate: patient.value.care_start_date || '',
            careEndDate: patient.value.care_end_date || '',
            availability: patient.value.availability || [],
            care_informations: patient.value.care_informations || [],
            visits: migrateVisitTimes(patient.value.visit_times || []),
            patient_care_type: patient.value.patient_care_type || [],
            patient_documents: patient.value.patient_documents || [],
        };
    }
};

const days = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
};

const severities = {
    low: 'Faible',
    medium: 'Moyen',
    high: 'Elevé',
};

const isOpenDialog = ref(false);

const openDialog = () => {
    isOpenDialog.value = true;
};

const closeDialog = () => {
    isOpenDialog.value = false;
};

const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
};

const addVisit = () => {
    formData.value.visits.push({
        dayOfVisit: '',
        theoreticalVisitTimes: [
            {
                time: '',
                careTypeId: [],
            },
        ],
    });
};

const removeVisit = (visitIndex) => {
    formData.value.visits.splice(visitIndex, 1);
};

const addTimeSlot = (visitIndex) => {
    formData.value.visits[visitIndex].theoreticalVisitTimes.push({
        time: '',
        careTypeId: [],
    });
};

const removeTimeSlot = (visitIndex, timeIndex) => {
    formData.value.visits[visitIndex].theoreticalVisitTimes.splice(timeIndex, 1);
};

const handleCareTypeClick = (timeSlot, careTypeId) => {
    const index = timeSlot.careTypeId.indexOf(careTypeId);
    if (index === -1) {
        timeSlot.careTypeId.push(careTypeId);
    }
    else {
        timeSlot.careTypeId.splice(index, 1);
    }
    timeSlot.careTypeId = [...timeSlot.careTypeId];
};

const getSelectedCareTypesText = (selectedIds) => {
    return careTypes.value
        .filter(ct => selectedIds.includes(ct.id))
        .map(ct => ct.name)
        .join(', ');
};

const updatePatientCareTypes = () => {
    const careTypeSet = new Set();

    formData.value.visits.forEach((visit) => {
        visit.theoreticalVisitTimes.forEach((timeSlot) => {
            timeSlot.careTypeId.forEach((careTypeId) => {
                careTypeSet.add(careTypeId);
            });
        });
    });

    formData.value.patient_care_type = Array.from(careTypeSet).map(careTypeId => ({ careTypeId }));
};

const prescriptions = ref([
    {
        id: 1,
        name: 'Maladie cardiaque',
    },
    {
        id: 2,
        name: 'Soins de la peau',
    },
]);

const router = useRouter();

const {
    submit,
    inProgress,
} = useSubmit(
    () => {
        updatePatientCareTypes();
        return updatePatient(patient.value.id, formData.value).then(() => {
            $toast({
                description: 'Mise à jour du patient avec succès',
            });

            setTimeout(() => {
                router.push('/dashboard/patients');
            }, 3000);
        });
    },
);

useHead({
    title: 'Editer le profil',
});

onMounted(async () => {
    await fetchDetailPatient();
    await fetchCareTypes();
    initializeFormData();
});

watch(() => patient.value, () => {
    initializeFormData();
}, { deep: true });

definePageMeta({
    layout: 'dashboard',
    middleware: 'verified',
});
</script>
