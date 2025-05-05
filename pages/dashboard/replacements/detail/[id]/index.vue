<template>
    <div class="pt-2">
        <div class="flex space-x-3 justify-between">
            <div class="w-[55%] rounded bg-gray-100 h-12 px-3 flex flex-col space-y-6 sm:space-y-0 sm:flex-row justify-between items-center">
                <Button
                    class="text-sm -ml-24 sm:ml-0"
                    @click="goBack"
                >
                    <span class="text-xs">Retour</span>
                </Button>

                <div class="flex items-center space-x-8">
                    <h4 class="font-bold text-sm text-primary ml-16 sm:ml-4 xl:ml-0">
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

        <section
            v-if="groupedDetails.length > 0"
            class="mt-24 sm:mt-6 mb-8 h-auto grid grid-cols-1 md:grid-cols-2 gap-8"
        >
            <div
                v-for="(group, index) in groupedDetails"
                :key="index"
            >
                <div class="bg-gray-100 space-y-8 sm:space-y-0 space-x-6 p-8 relative rounded-2xl">
                    <div>
                        <div class="h-10 flex px-2 bg-primary rounded items-center">
                            <h4 class="text-white text-sm flex items-center">
                                <ClockIcon class="w-5 h-5 mr-2" />
                                {{ group.date }}
                            </h4>
                        </div>
                        <div class="rounded text-sm bg-gray-100 border border-gray-300 h-10 flex justify-center items-center my-4">
                            {{ group.times }}
                        </div>

                        <div
                            v-if="group.patients"
                            class="mt-8"
                        >
                            <div class="h-10 flex bg-primary rounded justify-center items-center">
                                <h4 class="text-white text-sm text-center">
                                    Patient(s)
                                </h4>
                            </div>
                            <div class="mt-4 space-y-4">
                                <div class="bg-gray-200 text-xs py-2 rounded px-3 text-center">
                                    <span>{{ group.patients }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8">
                            <div class="h-10 flex bg-primary rounded justify-center items-center">
                                <h4 class="text-white text-sm text-center">
                                    Type(s) de soin(s) à effectuer
                                </h4>
                            </div>
                            <div class="mt-4 space-y-4">
                                <div class="bg-gray-200 text-sm py-2 rounded px-3">
                                    <span>{{ group.careTypes }}</span>
                                </div>
                            </div>
                        </div>

                        <div
                            v-if="replacement.details && replacement.details.length > 0"
                            class="bg-gray-200 mt-8"
                        >
                            <div class="h-10 flex bg-primary rounded justify-center items-center">
                                <h4 class="text-white text-sm text-center">
                                    Zone(s) géographique(s) couverte(s)
                                </h4>
                            </div>
                            <div class="py-16 px-3 space-y-3">
                                <div class="bg-white text-xs flex space-x-3 items-center h-9 w-full border border-primary rounded-full">
                                    <div class="bg-primary h-9 text-white flex justify-start px-2 items-center rounded-full w-32">
                                        <HomeIcon class="w-5 h-5" />
                                        <span>Codes postaux</span>
                                    </div>
                                    <span>{{ group.zipCodes }}</span>
                                </div>
                                <div class="bg-white text-xs flex space-x-3 items-center h-9 w-full border border-primary rounded-full">
                                    <div class="bg-primary h-9 text-white flex justify-start px-2 items-center rounded-full w-32">
                                        <HomeIcon class="w-5 h-5" />
                                        <span>Villes</span>
                                    </div>
                                    <span>{{ group.cities }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div
            v-if="user?.nurse && replacement.nurse_id !== user.nurse.id"
            class="my-12"
        >
            <Form @submit="submit">
                <div class="flex justify-between items-center mt-10 bg-gray-100 h-12 rounded">
                    <div>
                        <Button
                            type="submit"
                            :disabled="isDisabled || inProgress"
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
import { useDetailReplacement, useListResponse, sendResponse } from '~/composables/useReplacements';
import { getFullName } from '~/lib/utils';

const user = useState('user');
const route = useRoute();
const replacementId = route.params.id;
const respondedBy = computed(() => user.value?.id || null);

const { replacement, fetchReplacement } = useDetailReplacement(replacementId);
const { listResponse, fetchListResponse } = useListResponse(replacementId);

const { isDisabled } = sendResponse();

const formData = reactive({
    replacementId: replacementId,
    respondedBy: respondedBy,
    comment: '',
});

const goBack = () => {
    window.history.back();
};

const groupedDetails = computed(() => {
    const grouped = {};

    if (replacement.value.details?.length > 0) {
        replacement.value.details.forEach((detail) => {
            if (!grouped[detail.date]) {
                grouped[detail.date] = {
                    date: detail.date,
                    times: new Set(),
                    patients: new Set(),
                    careTypes: new Set(),
                    zipCodes: new Set(),
                    cities: new Set(),
                };
            }

            grouped[detail.date].times.add(formatTime(detail.start_at));
            replacement.value.care_types.forEach(care => grouped[detail.date].careTypes.add(care.name));
            JSON.parse(replacement.value.zip_codes).forEach(zipCode => grouped[detail.date].zipCodes.add(zipCode));
            JSON.parse(replacement.value.cities).forEach(city => grouped[detail.date].cities.add(city));
            if (detail.patient.firstname || detail.patient.lastname) {
                grouped[detail.date].patients.add(getFullName(detail.patient));
            }
        });
    }
    else if (replacement.value.timeSlot) {
        const timeSlots = JSON.parse(replacement.value.timeSlot);
        const date = formatDate(replacement.value.start_date);
        grouped[date] = {
            date: date,
            times: new Set(Object.values(timeSlots).map(slot => JSON.parse(slot).startAt)),
            patients: new Set(),
            careTypes: new Set(replacement.value.care_types.map(care => care.name)),
            zipCodes: new Set(),
            cities: new Set(),
        };
    }

    return Object.values(grouped).map(group => ({
        date: group.date,
        times: Array.from(group.times).join(' / '),
        careTypes: Array.from(group.careTypes).join(', '),
        zipCodes: Array.from(group.zipCodes).join(', '),
        cities: Array.from(group.cities).join(', '),
        patients: Array.from(group.patients).join(', '),
    }));
});

const {
    submit,
    inProgress,
} = useSubmit(
    async () => {
        await sendResponse().submitResponse(formData);
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
    middleware: ['auth', 'verified', 'subscribed'],
    ssr: false,
});
</script>
