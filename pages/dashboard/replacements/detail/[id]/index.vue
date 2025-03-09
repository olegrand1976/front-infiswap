<template>
    <div class="pt-2">
        <div class="flex space-x-3 justify-between">
            <div class="w-[55%] rounded bg-gray-100 h-12 px-3 flex justify-between items-center">
                <Button
                    class="text-sm"
                    href="/dashboard/replacement"
                >
                    <span class="text-xs">Retour</span>
                </Button>

                <div class="flex items-center space-x-8">
                    <h4 class="font-bold text-sm text-primary">
                        Période
                    </h4>
                    <div class="flex space-x-5 items-center rounded-full bg-primary w-40">
                        <span class="text-xs text-white ms-3">Début</span>
                        <div class="flex justify-center items-center text-primary rounded-full bg-white shadow w-40">
                            <CalendarDaysIcon class="w-4 h-4 ml-1 text-primary" />
                            <Input
                                v-model="startDate"
                                variant="transparent"
                                class="text-xs text-primary w-24"
                                disabled
                            />
                        </div>
                    </div>
                    <div class="flex space-x-5 items-center rounded-full bg-primary w-40">
                        <span class="text-xs text-white ms-3">Fin</span>
                        <div class="flex justify-center items-center text-primary rounded-full bg-white shadow w-40">
                            <CalendarDaysIcon class="w-4 h-4 ml-1 text-primary" />
                            <Input
                                v-model="endDate"
                                variant="transparent"
                                class="text-xs text-primary w-24"
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="user?.nurse && replacement.nurse_id === user.nurse.id"
                class="w-[45%] h-12 px-3 rounded bg-gray-100 flex justify-between items-center"
            >
                <div class="flex space-x-3 bg-primary h-10 rounded-full w-72">
                    <span class="text-xs text-white mt-3 font-normal text-nowrap ml-3">Nombre infirmier intéressé</span>
                    <div class="bg-white flex items-center justify-center shadow w-72 rounded-full">
                        <span
                            v-if="listResponse.length == 0"
                            class="text-xs text-primary"
                        >
                            Aucun
                        </span>
                        <span
                            v-else-if="listResponse.length == 1"
                            class="text-xs text-primary"
                        >
                            1 intéressé
                        </span>
                        <span
                            v-else
                            class="text-xs text-primary"
                        >
                            {{ listResponse.length }} intéressés
                        </span>
                    </div>
                </div>
                <Button
                    :href="`/dashboard/replacements/detail/${replacement.id}/list`"
                >
                    <span class="text-xs">Liste</span>
                </Button>
            </div>
        </div>

        <div
            v-for="(detail, index) in replacement.details"
            :key="index"
            class="mt-6 mb-8 h-auto overflow-hidden"
        >
            <div
                class="flex items-center"
            >
                <div class="z-20">
                    <Calendar
                        :default-value="parseDateValue(detail.date)"
                        :weekday-format="'short'"
                        class="rounded-xl bg-white shadow"
                    />
                </div>

                <div class="bg-gray-100 z-10 -ml-10 flex space-x-6 p-8 w-[48.25rem] relative rounded-2xl">
                    <div class="ml-8 w-64">
                        <div class="h-10 flex px-2 bg-primary rounded items-center">
                            <h4 class="text-white text-sm flex items-center">
                                <ClockIcon class="w-5 h-5 mr-2" />
                                {{ getPeriodLabel(detail.start_at) }} - {{ formatDate(detail.date) }}
                            </h4>
                        </div>
                        <div class="rounded text-sm bg-gray-100 border border-gray-300 h-10 flex justify-center items-center my-4">
                            {{ formatTime(detail.start_at) }}
                        </div>
                        <div class="bg-gray-200">
                            <div class="h-10 flex bg-primary rounded justify-center items-center">
                                <h4 class="text-white text-sm text-center">
                                    Zone géographique couverte
                                </h4>
                            </div>
                            <div class="py-16 px-3 space-y-3">
                                <div
                                    v-for="(value, key) in { 'Code postal': detail.patient.zip_code, 'Ville': detail.patient.city }"
                                    :key="key"
                                    class="bg-white text-xs flex space-x-3 items-center h-9 w-full border border-primary rounded-full"
                                >
                                    <div class="bg-primary h-9 text-white flex justify-start px-2 items-center rounded-full w-32">
                                        <HomeIcon class="w-5 h-5" />
                                        <span>{{ key }}</span>
                                    </div>
                                    <span>{{ value }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="w-72">
                        <div class="h-10 flex bg-primary rounded justify-center items-center">
                            <h4 class="text-white text-sm text-center">
                                Type de soin à effectuer
                            </h4>
                        </div>
                        <div class="mt-2 space-y-3">
                            <div
                                v-for="(caretype, mark) in replacement.details[0].care_types"
                                :key="mark"
                                class="bg-gray-200 text-xs py-2 rounded px-3"
                            >
                                <span>{{ caretype.name }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="absolute top-4 right-8">
                        <div class="text-white bg-white h-10 w-10 rounded-full shadow-inner">
                            .
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="user?.nurse && replacement.nurse_id !== user.nurse.id"
            class="my-12"
        >
            <Form @submit="submit">
                <div class="flex justify-between items-center mt-10 bg-gray-100 h-12 rounded">
                    <div>
                        <Button
                            type="submit"
                            :in-progress="inProgress"
                        >
                            <span v-if="user.gender == 'M'">
                                Je suis intéressé
                            </span>
                            <span v-if="user.gender == 'F'">
                                Je suis intéressée
                            </span>
                        </Button>
                    </div>

                    <div class="flex space-x-8 mr-4">
                        <Button class="rounded-full p-1 w-8 h-8">
                            <ChevronLeftIcon class="w-8 h-8 text-white" />
                        </Button>
                        <Button class="rounded-full p-1 w-8 h-8">
                            <ChevronRightIcon class="w-8 h-8 text-white" />
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup>
import {
    CalendarDaysIcon,
    ClockIcon,
    HomeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/vue/24/solid';
import { useRoute } from 'vue-router';
import { CalendarDate } from '@internationalized/date';
import { useDetailReplacement, useListResponse, sendResponse } from '~/composables/useReplacements';

const user = useState('user');
const route = useRoute();
const replacementId = route.params.id;
const respondedBy = computed(() => user.value?.id || null);
const { $toast } = useNuxtApp();

const { replacement, fetchReplacement } = useDetailReplacement(replacementId);
const { listResponse, fetchListResponse } = useListResponse(replacementId);

const formData = reactive({
    replacementId: replacementId,
    respondedBy: respondedBy,
    comment: '',
});

const {
    submit,
    inProgress,
} = useSubmit(
    () => {
        return sendResponse().submitResponse(formData).then(() => {
            $toast({
                description: 'Réponse envoyée avec succès.',
            });
        });
    },
);

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
};

const parseDateValue = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new CalendarDate(year, month, day);
};

const getPeriodLabel = (timeString) => {
    const hours = parseInt(timeString.split(':')[0], 10);
    if (hours >= 1 && hours < 12) {
        return 'Matin';
    }
    else if (hours >= 12 && hours < 18) {
        return 'Après-midi';
    }
    else {
        return 'Soir';
    }
};

const startDate = computed(() => {
    return replacement.value.start_date ? formatDate(replacement.value.start_date) : '';
});

const endDate = computed(() => {
    return replacement.value.end_date ? formatDate(replacement.value.end_date) : '';
});

onMounted(async () => {
    await fetchReplacement();
    await fetchListResponse();
});

useHead({
    title: 'Détail de remplacement',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
});
</script>
