<template>
    <div class="pt-4">
        <Form>
            <div class="flex space-x-4">
                <RangeCalendarTours
                    v-model="value"
                    class="rounded-md shadow-lg"
                />
                <div class="w-3/6 bg-gray-100 rounded-lg h-full">
                    <div class="bg-primary rounded-t-lg flex items-center ps-4 h-16">
                        <h2 class="font-bold text-white">
                            Liste Patients
                        </h2>
                    </div>

                    <div class="p-5">
                        <p>Aujourd'hui : {{ today }}</p>
                        <Separator class="opacity-70 mt-4" />
                        <div class="w-4/5 max-h-64 overflow-y-scroll mt-4 space-y-2">
                            <div class="bg-primary rounded-lg flex items-center ps-4 h-10 text-white shadow-sm">
                                <p class="flex justify-between w-full">
                                    <span>Marc Hugue</span>
                                <div class="flex mr-4">
                                    <XCircleIcon class="h-6 w-6 mr-2 text-transparent stroke-white stroke-2" />
                                    <!-- <CheckCircleIcon class="h-6 w-6 text-white" /> -->
                                </div>
                                </p>
                            </div>
                            <div>
                                <div v-if="loading" class="flex justify-center items-center">
                                    <p>Chargement...</p>
                                </div>
                                <div v-if="error" class="flex justify-center items-center text-red-500">
                                    <p>Erreur lors du chargement des données : {{ error.message }}</p>
                                </div>
                                <div v-if="tours.length > 0 && !loading && !error">
                                    <div v-for="patient in tours" :key="patient.id">
                                        <div class="bg-gray-200 rounded-lg flex items-center ps-4 h-10 shadow-sm mt-2">
                                            <p class="flex justify-between w-full">
                                                <span>{{ patient.firstname }} {{ patient.lastname }}</span>
                                            <div class="flex mr-4">
                                                <XCircleIcon class="h-6 w-6 mr-2 text-transparent stroke-gray-500 stroke-2" />
                                                <!-- <CheckCircleIcon class="h-6 w-6 text-primary" /> -->
                                            </div>
                                            </p>
                                        </div>
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
                <div class="mt-6">
                    <div class="flex justify-between space-x-4 w-full">
                        <div class="w-2/6">
                            <div class="flex items-center bg-primary text-white p-4 rounded-lg">
                                <div class="flex-shrink-0">
                                    <NuxtImg
                                        src="/home/infirmier_homme.png"
                                        class="rounded-full h-16 w-16"
                                    />
                                </div>
                                <div class="ml-4 flex flex-grow justify-between items-center">
                                    <div class="text-lg">Marta <span class="font-semibold">Hugue</span></div>
                                    <div class="text-xs pr-4"><span class="font-semibold">Age:</span> 47</div>
                                </div>
                            </div>

                            <div class="bg-gray-100">
                                <div class="mt-4 bg-primary text-white p-4 rounded-t-lg font-bold text-lg">
                                    Information :
                                </div>

                                <div class="mt-4 p-4 rounded-lg shadow">
                                    <div class="flex justify-between items-center border-b pb-2">
                                        <span class="font-bold">Genre</span>
                                        <span class="w-2/3 text-left">Femelle</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b py-2">
                                        <span class="font-bold">Groupe sanguin</span>
                                        <span class="w-2/3 text-left">O+(positive)</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b py-2">
                                        <span class="font-bold">Allergies</span>
                                        <span class="w-2/3 text-left">Milk, Pénicilline</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b py-2">
                                        <span class="font-bold">Maladies</span>
                                        <span class="w-2/3 text-left">Diabétes, troubles sanguins</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b py-2">
                                        <span class="font-bold">Hauteur</span>
                                        <span class="w-2/3 text-left">1.78m</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b py-2">
                                        <span class="font-bold">Poids</span>
                                        <span class="w-2/3 text-left">65kg</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="w-2/6">
                            <div class="bg-gray-100 rounded-lg flex flex-col items-center pb-6">
                                <div class="bg-primary text-white p-4 rounded-t-lg font-bold w-full text-lg flex">
                                    <HomeIcon class="h-6 w-6 text-white mr-2" /> Ville
                                </div>
                                <div class="bg-white w-4/5 text-center rounded-full mt-4 py-3 border-2 border-primary">
                                    Binche
                                </div>
                            </div>

                            <div class="bg-gray-100 rounded-lg flex flex-col items-center pb-6 mt-6">
                                <div class="bg-primary text-white p-4 rounded-t-lg font-bold text-lg w-full flex">
                                    <InboxIcon class="h-6 w-6 text-white mr-2" /> Code postal
                                </div>
                                <div class="bg-white w-4/5 text-center rounded-full mt-4 py-3 border-2 border-primary">
                                    7000
                                </div>
                            </div>

                            <div class="bg-gray-100 rounded-lg flex flex-col items-center pb-6 mt-6">
                                <div class="bg-primary text-white p-4 rounded-t-lg font-bold text-lg w-full flex">
                                    <ClockIcon class="h-6 w-6 text-white mr-2" /> Créneau horaire
                                </div>
                                <div class="w-full flex flex-col items-center">
                                    <div class="w-4/5 rounded-lg mt-4 py-3 bg-primary text-white text-center">
                                        Matin
                                    </div>
                                    <div class="bg-white w-4/5 text-center rounded-lg mt-4 py-3 border-2 border-gray-300 text-gray-400">
                                        7h00 - 10h00
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="w-2/6">
                            <div class="bg-gray-100 rounded-lg">
                                <div class="bg-primary text-white p-4 rounded-t-lg text-center font-bold text-lg">
                                    Liste des types de soins
                                </div>
                                <div class="p-4 space-y-2"> 
                                    <div class="bg-gray-200 p-3 rounded-lg">Bandages</div>
                                    <div class="bg-gray-200 p-3 rounded-lg">Surveillance des signes vitaux</div>
                                    <div class="bg-gray-200 p-3 rounded-lg">Prise en charge de la douleur</div>
                                    <div class="bg-gray-200 p-3 rounded-lg">Soin de confort</div>
                                    <div class="bg-gray-200 p-3 rounded-lg">Pansement</div>
                                    <div class="bg-gray-200 p-3 rounded-lg">Administration des médicaments</div>
                                    <div class="bg-gray-200 p-3 rounded-lg">Soin de confort</div>
                                    <div class="bg-gray-200 p-3 rounded-lg">Pansement</div>
                                    <div class="bg-gray-200 p-3 rounded-lg">Administration des médicaments</div>
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
import type { DateRange } from 'radix-vue';
import { CalendarDate, getLocalTimeZone, today as todayFn } from '@internationalized/date';
import { RangeCalendarTours } from '@/components/ui/range-calendar';
import { useTours } from '~/composables/useTours';

const { tours, error, loading, fetchTours } = useTours();

const today = computed(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
});

// Get tod
const value = ref({
    start: new CalendarDate(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate(),
    ),
    end: null,
}) as Ref<DateRange>;

watch(value, (newValue) => {
    const startDate = newValue.start;
    const formattedStart = `${startDate.year}-${String(startDate.month).padStart(2, '0')}-${String(startDate.day).padStart(2, '0')}`;
    console.log("Date sélectionnée (start) :", formattedStart);
    fetchTours(formattedStart, formattedStart);
}, { deep: true });

const formatDate = (calendarDate) => {
    return `${calendarDate.year}-${String(calendarDate.month).padStart(2, '0')}-${String(calendarDate.day).padStart(2, '0')}`;
};

onMounted(() => {
    const initialStartDate = value.value.start || new CalendarDate(new Date());
    const formattedInitialStart = formatDate(initialStartDate);
    fetchTours(formattedInitialStart, formattedInitialStart);
});

useHead({
    title: 'Gestion Tournées',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
});
</script>
