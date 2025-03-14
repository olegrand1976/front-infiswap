<template>
    <div>
        <Form @submit="submit">
            <div class="grid grid-cols-2 gap-12 pt-4">
                <div class="space-y-4">
                    <div class="space-y-4">
                        <div>
                            <h3 class="p-2 bg-primary text-white rounded-t">
                                Date de début d'intervention
                            </h3>
                            <div class="bg-gray-100 p-4">
                                <div class="flex justify-center mx-auto bg-primary rounded-full px-3 h-9 items-center text-white w-52">
                                    <CalendarDaysIcon class="w-5" />
                                    <Input
                                        v-model="formData.careStartDate"
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

                    <div class="grid grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="lastname">
                                Nom
                            </label>
                        </div>
                        <Input
                            id="lastname"
                            v-model="formData.lastname"
                            type="text"
                            class="w-full bg-transparent"
                            placeholder="Doe"
                        />
                    </div>

                    <div class="grid grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="firstname">
                                Prénoms
                            </label>
                        </div>
                        <Input
                            id="firstname"
                            v-model="formData.firstname"
                            type="text"
                            class="w-full bg-transparent"
                            placeholder="John"
                        />
                    </div>

                    <div class="grid grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="socialSecurityNumber">
                                Sécurité sociale
                            </label>
                        </div>
                        <Input
                            id="socialSecurityNumber"
                            v-model="formData.socialSecurityNumber"
                            type="text"
                            placeholder="880603-123-56"
                            class="w-full bg-transparent"
                        />
                    </div>

                    <div class="grid grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="email">
                                Email
                            </label>
                        </div>
                        <Input
                            id="email"
                            v-model="formData.email"
                            type="email"
                            class="w-full bg-transparent"
                            placeholder="johndoe@gmail.com"
                        />
                    </div>

                    <div class="grid grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="phoneNumber">
                                Téléphone
                            </label>
                        </div>
                        <Input
                            id="phoneNumber"
                            v-model="formData.phoneNumber"
                            type="text"
                            class="w-full bg-transparent"
                            placeholder="08 67 56 54 32"
                        />
                    </div>

                    <div class="grid grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="zipCode">
                                Code postal
                            </label>
                        </div>
                        <Input
                            id="zipCode"
                            v-model="formData.zipCode"
                            type="text"
                            class="w-full bg-transparent"
                            placeholder="09866"
                        />
                    </div>

                    <div class="grid grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="city">
                                Ville
                            </label>
                        </div>
                        <Input
                            id="city"
                            v-model="formData.city"
                            type="text"
                            class="w-full bg-transparent"
                            placeholder="Wallon"
                        />
                    </div>

                    <div class="grid grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="zipCode">
                                Disponibilité
                            </label>
                        </div>
                        <Select v-model="formData.availability">
                            <SelectTrigger
                                class="w-full bg-transparent text-nowrap border border-none"
                                position="right"
                            >
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent class="border border-none">
                                <template
                                    v-for="[key, value] in Object.entries(availabilities)"
                                    :key="key"
                                >
                                    <SelectItem :value="key">
                                        {{ value }}
                                    </SelectItem>
                                </template>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div class="flex flex-col space-y-4">
                    <div
                        v-for="(visit, visitIndex) in formData.visits"
                        :key="visitIndex"
                        class="relative"
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
                                        <SelectValue placeholder="Séléctionner un jour" />
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
                                        input-class="rounded-full"
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
                                            <SelectValue
                                                class="truncate w-[38rem]"
                                            >
                                                <template v-if="getSelectedCareTypesText(timeSlot.careTypeId)">
                                                    {{ getSelectedCareTypesText(timeSlot.careTypeId) }}
                                                </template>
                                                <template v-else>
                                                    <span class="text-black/60">
                                                        Sélectionner un type de soin
                                                    </span>
                                                </template>
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

                            <p
                                class="w-48 ml-auto flex justify-end text-primary mt-8 cursor-pointer items-center space-x-3"
                                @click="addTimeSlot(visitIndex)"
                            >
                                <PlusIcon class="w-6" />
                                <span>
                                    Nouvelle visite
                                </span>
                            </p>
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
            </div>

            <Button
                class="my-12 w-80 flex justify-center items-center mx-auto"
                type="submit"
                :in-progress="inProgress"
            >
                Enregistrer
            </Button>
        </Form>
    </div>
</template>

<script lang="ts" setup>
import { CalendarDaysIcon, PlusIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { InputTime } from '@/components/ui/input-time';

import { useCareTypes } from '~/composables/useCareTypes';
import { createPatient } from '~/composables/usePatients';

const { careTypes, fetchCareTypes } = useCareTypes();
const router = useRouter();

const user = useState('user');
const { $toast } = useNuxtApp();

const availabilities = {
    available: 'Disponible',
    unavailable: 'Indisponible',
    absent: 'Absent',
    hospitalized: 'Hospitalisé',
    on_vacation: 'En vacances',
};

const formData = reactive({
    nurseId: user.value.nurse.id,
    lastname: '',
    firstname: '',
    email: '',
    socialSecurityNumber: '',
    phoneNumber: '',
    zipCode: '',
    city: '',
    careStartDate: '',
    careEndDate: '',
    availability: 'available',
    care_informations: [],
    visits: [
        {
            dayOfVisit: '',
            theoreticalVisitTimes: [
                {
                    time: '',
                    careTypeId: [],
                },
            ],
        },
    ],
    patient_care_type: [],
    patient_documents: [],
});

const days = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
};

// Add a new visit day
const addVisit = () => {
    formData.visits.push({
        dayOfVisit: '',
        theoreticalVisitTimes: [
            {
                time: '',
                careTypeId: [],
            },
        ],
    });
};

// Remove a visit day
const removeVisit = (visitIndex: number) => {
    formData.visits.splice(visitIndex, 1);
};

// Add a new time slot to a visit
const addTimeSlot = (visitIndex: number) => {
    formData.visits[visitIndex].theoreticalVisitTimes.push({
        time: '',
        careTypeId: [],
    });
};

// Remove a time slot from a visit
const removeTimeSlot = (visitIndex: number, timeIndex: number) => {
    formData.visits[visitIndex].theoreticalVisitTimes.splice(timeIndex, 1);
};

// Handle care type click
const handleCareTypeClick = (timeSlot: any, careTypeId: number) => {
    const index = timeSlot.careTypeId.indexOf(careTypeId);
    if (index === -1) {
        timeSlot.careTypeId.push(careTypeId);
    }
    else {
        timeSlot.careTypeId.splice(index, 1);
    }
    // Force update to ensure checkbox state is reflected
    timeSlot.careTypeId = [...timeSlot.careTypeId];
};

// Get display text for selected care types
const getSelectedCareTypesText = (selectedIds: number[]) => {
    return careTypes.value
        .filter(ct => selectedIds.includes(ct.id))
        .map(ct => ct.name)
        .join(', ');
};

// Update patient_care_type with all care types from visits
const updatePatientCareTypes = () => {
    const careTypeSet = new Set<number>();

    formData.visits.forEach((visit) => {
        visit.theoreticalVisitTimes.forEach((timeSlot) => {
            timeSlot.careTypeId.forEach((careTypeId) => {
                careTypeSet.add(careTypeId);
            });
        });
    });

    formData.patient_care_type = Array.from(careTypeSet).map(careTypeId => ({ careTypeId }));
};

const {
    submit,
    inProgress,
} = useSubmit(
    () => {
        updatePatientCareTypes();
        return createPatient(formData).then(() => {
            $toast({
                description: 'Création effectuée',
            });

            setTimeout(() => {
                router.push('/dashboard/patients');
            }, 3000);
        });
    },
);

onMounted(() => {
    fetchCareTypes();
});

useHead({
    title: 'Créer un patient',
});

definePageMeta({
    layout: 'dashboard',
    middleware: 'verified',
    ssr: false,
});
</script>
