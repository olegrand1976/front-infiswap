<template>
    <div>
        <div class="grid grid-cols-2 gap-4">
            <section class="flex flex-col space-y-6">
                <div class="flex flex-col space-y-6 pt-4 rounded bg-gray-100">
                    <div class="flex space-x-3 items-center px-6">
                        <NuxtImg
                            src="/home/infirmier_homme.png"
                            class="w-12 h-12 rounded-full"
                        />
                        <h2 class="text-primary">
                            Information patients
                        </h2>
                    </div>

                    <div class="space-y-2 px-6">
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Nom
                            </h4>
                            <p>{{ patient.lastname }}</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Prénom
                            </h4>
                            <p>{{ patient.firstname }}</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Téléphone
                            </h4>
                            <p>{{ patient.phone_number }}</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Email
                            </h4>
                            <p>{{ patient.email }}</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Adresse
                            </h4>
                            <p>{{ patient.profile.street_address }}</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Ville
                            </h4>
                            <p>{{ patient.profile.city }}</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Code postal
                            </h4>
                            <p>{{ patient.profile.zip_code }}</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Complément
                            </h4>
                            <p>Lorem ipsum</p>
                        </div>
                    </div>

                    <div class="bg-primary h-10 rounded-b" />
                </div>

                <div class="rounded-b bg-gray-100">
                    <h1 class="p-4 bg-primary text-white rounded-t">
                        Numéro de sécurité social
                    </h1>
                    <p class="p-4">
                        {{ patient.social_security_number }}
                    </p>
                </div>

                <div class="p-4 rounded bg-gray-100">
                    <h4 class="text-primary">
                        Heure visite théorique
                    </h4>

                    <div class="space-y-6 mt-6">
                        <div
                            v-for="(visitTime, visitIndex) in patient.visit_times"
                            :key="visitTime.patient_id"
                        >
                            <h5 class="font-semibold">
                                {{ frenchDays[visitTime.day_of_visit] }}
                            </h5>
                            <div class="grid grid-cols-[30%_70%] items-center">
                                <span>{{ frenchPeriod[visitTime.visit_period] }}</span>
                                <div class="rounded-full h-9 px-3 mt-2 flex items-center space-x-3 bg-white border border-primary">
                                    <div
                                        v-for="(time, timeIndex) in getVisitTimes(visitIndex)"
                                        :key="timeIndex"
                                        class="flex items-center space-x-1"
                                    >
                                        <Input
                                            v-model="visitTimes[visitIndex].theoretical_visit_times[timeIndex]"
                                            type="time"
                                            class="bg-transparent"
                                            @input="updateVisitTime(visitIndex, timeIndex, $event)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="flex flex-col space-y-6">
                <div>
                    <div class="rounded-b pb-2 bg-gray-100">
                        <h1 class="p-4 bg-primary text-white rounded-t">
                            Date de début d'intervention
                        </h1>
                        <div class="flex my-4 w-48 bg-primary px-2 rounded-full text-white justify-center mx-auto items-center h-10 border border-primary">
                            <CalendarDaysIcon class="w-5" />
                            <Input
                                v-model="patient.care_start_date"
                                type="date"
                                class="bg-transparent text-white"
                            />
                        </div>
                    </div>

                    <div class="rounded-b pb-2 bg-gray-100 mt-6">
                        <h1 class="p-4 bg-primary text-white rounded-t">
                            Date de fin d'intervention
                        </h1>
                        <div class="flex my-4 w-48 bg-primary px-2 rounded-full text-white justify-center mx-auto items-center h-10 border border-primary">
                            <CalendarDaysIcon class="w-5" />
                            <Input
                                v-model="patient.care_end_date"
                                type="date"
                                class="bg-transparent text-white"
                            />
                        </div>
                    </div>
                </div>
                <div class="mt-6 p-4 rounded bg-gray-100">
                    <h4 class="text-primary">
                        Disponibilité
                    </h4>

                    <Select>
                        <SelectTrigger
                            class="flex my-4 w-full rounded-full border border-gray-300"
                            position="right"
                        >
                            <SelectValue :placeholder="formattedAvailability" />
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

                <div class="p-4 rounded bg-gray-100">
                    <h4 class="text-primary">
                        Type de soins à effectuer
                    </h4>

                    <Select>
                        <SelectTrigger
                            class="flex my-4 w-full rounded-full border border-gray-300"
                            position="right"
                        >
                            <SelectValue
                                :placeholder="placeholderCare"
                                class="truncate text-nowrap w-full"
                            />
                        </SelectTrigger>

                        <SelectContent class="border border-none">
                            <SelectGroup>
                                <div
                                    v-for="careType in careTypes"
                                    :key="careType.id"
                                    class="flex items-center space-2 mb-2"
                                >
                                    <Checkbox
                                        v-model="formData.patientCareType"
                                        class="mr-2"
                                        :value="careType"
                                        :checked="formData.patientCareType.includes(careType)"
                                        @update:checked="toggleCareType(careType)"
                                    />
                                    <label class="text-xs">{{ careType.name }}</label>
                                </div>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div class="p-4 rounded bg-gray-100">
                    <h5 class="text-primary text-sm font-bold">
                        Note médicale
                    </h5>

                    <div class="my-4">
                        <h5 class="text-sm font-bold">
                            Allergie
                        </h5>

                        <Select>
                            <SelectTrigger
                                class="flex my-2 w-full rounded-full border border-gray-300"
                                position="right"
                            >
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent class="border border-none">
                                .
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="my-2">
                        <h4 class="text-sm font-bold">
                            Instruction
                        </h4>

                        <Select>
                            <SelectTrigger
                                class="flex my-2 w-full rounded-full border border-gray-300"
                                position="right"
                            >
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent class="border border-none">
                                .
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div class="p-4 rounded bg-gray-100">
                    <h4 class="text-primary">
                        Liste de ses documents
                    </h4>

                    <div class="flex flex-col space-y-2 mt-4">
                        <div class="flex justify-between">
                            <p>
                                Lorem ipsum
                            </p>
                            <ArrowDownTrayIcon class="w-5 text-primary" />
                        </div>
                        <div class="flex justify-between">
                            <p>
                                Lorem ipsum
                            </p>
                            <ArrowDownTrayIcon class="w-5 text-primary" />
                        </div>
                        <div class="flex justify-between">
                            <p>
                                Lorem ipsum
                            </p>
                            <ArrowDownTrayIcon class="w-5 text-primary" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import {
    ArrowDownTrayIcon,
    CalendarDaysIcon,
} from '@heroicons/vue/24/solid';

import { detailPatient } from '~/composables/usePatients';
import { useCareTypes } from '~/composables/useCareTypes';

const route = useRoute();
const patientId = route.params.id;

const { patient, fetchDetailPatient } = detailPatient(patientId);
const { careTypes, fetchCareTypes } = useCareTypes();

const formData = reactive({
    patientCareType: [],
});

const frenchDays = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
};

const frenchPeriod = {
    morning: 'Matin',
    afternoon: 'Après-midi',
    evening: 'Soir',
};

const visitTimes = ref([]);

const getVisitTimes = (visitIndex) => {
    if (visitTimes.value[visitIndex] && visitTimes.value[visitIndex].theoretical_visit_times) {
        return JSON.parse(visitTimes.value[visitIndex].theoretical_visit_times);
    }
    return [];
};

const updateVisitTime = (visitIndex, timeIndex, newTime) => {
    const times = JSON.parse(visitTimes.value[visitIndex].theoretical_visit_times);
    times[timeIndex] = newTime;
    visitTimes.value[visitIndex].theoretical_visit_times = JSON.stringify(times);
};

const availabilities = {
    available: 'Disponible',
    unavailable: 'Indisponible',
    absent: 'Absent',
    hospitalized: 'Hospitalisé',
    on_vacation: 'En vacances',
};

const patientAvailability = ref({
    availability: 'available',
});

const formattedAvailability = computed(() => availabilities[patientAvailability.value.availability]);

const placeholderCare = computed(() => formData.patientCareType.map(care => care.name).join(', '));

const toggleCareType = (careType) => {
    if (formData.patientCareType.includes(careType)) {
        const index = formData.patientCareType.indexOf(careType);
        formData.patientCareType.splice(index, 1);
    }
    else {
        formData.patientCareType.push(careType);
    }
};

onMounted(async () => {
    await fetchDetailPatient();
    await fetchCareTypes();

    if (patient.value.visit_times && patient.value.visit_times.length > 0) {
        visitTimes.value = [...patient.value.visit_times];
    }

    if (Array.isArray(careTypes.value) && careTypes.value.length > 0 && patient.value.patient_care_type) {
        formData.patientCareType = careTypes.value.filter(careType =>
            patient.value.patient_care_type.some(patientCare =>
                patientCare.care_type_id === careType.id,
            ),
        );
    }
});

useHead({
    title: 'Détail du patient',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
});
</script>
