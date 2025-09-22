<template>
    <div class="pt-2">
        <div class="flex flex-col space-y-8 sm:space-y-6 lg:space-y-0 lg:flex-row lg:space-x-3 justify-between">
            <div
                :class="{ 'w-full': !(user && replacement.user_id === user.id), 'w-full lg:w-[55%]': (user && replacement.user_id === user.id) }"
                class="rounded sm:bg-gray-100 sm:h-12 px-3 flex flex-col space-y-6 sm:space-y-0 sm:space-x-4 sm:flex-row justify-between sm:items-center"
            >
                <Button
                    class="text-sm w-auto"
                    @click="goBack"
                >
                    <span class="text-xs">Retour</span>
                </Button>

                <div class="mt-20 sm:mt-0 flex flex-col space-y-6 sm:space-y-0 sm:flex-row w-full sm:w-auto sm:items-center sm:space-x-8">
                    <h4 class="font-semibold text-sm sm:text-primary sm:ml-4 xl:ml-0">
                        Période
                    </h4>
                    <div v-if="periods && periods.length > 0">
                        <Button
                            class="text-sm w-40 sm:w-auto bg-primary text-white"
                            @click="periodDialog = true"
                        >
                            <span class="text-xs">Voir les périodes</span>
                        </Button>
                    </div>
                    <div
                        v-else
                        class="flex flex-col sm:flex-row sm:space-x-5 space-y-4 sm:space-y-0"
                    >
                        <div class="flex justify-between items-center sm:justify-start sm:space-x-5 rounded-full bg-primary sm:w-40">
                            <span class="text-xs text-white ms-3">Début</span>
                            <div class="flex justify-center items-center text-primary rounded-full border-2 border-primary bg-white shadow w-40">
                                <CalendarDaysIcon class="w-4 h-4 ml-1 text-primary" />
                                <Input
                                    v-model="startDate"
                                    variant="transparent"
                                    class="text-xs font-semibold text-primary w-24"
                                    disabled
                                />
                            </div>
                        </div>
                        <div class="flex justify-between items-center sm:justify-start sm:space-x-5 rounded-full bg-primary sm:w-40">
                            <span class="text-xs text-white ms-3">Fin</span>
                            <div class="flex justify-center items-center text-primary rounded-full border-2 border-primary bg-white shadow w-40">
                                <CalendarDaysIcon class="w-4 h-4 ml-1 text-primary" />
                                <Input
                                    v-model="endDate"
                                    variant="transparent"
                                    class="text-xs font-semibold text-primary w-24"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="user && replacement.user_id === user.id"
                class="mt-12 sm:mt-0 w-full sm:h-12 px-3 flex justify-between sm:items-center gap-2"
            >
                <div class="flex items-center text-center space-x-3 bg-primary h-10 border-2 border-primary rounded-full w-72">
                    <div>
                        <span
                            v-if="replacement.response_count < 2"
                            class="text-sm text-white text-nowrap ml-3"
                        >Intéressée</span>
                        <span
                            v-else
                            class="text-sm font-semibold text-white text-nowrap ml-3"
                        >Intéressées</span>
                    </div>
                    <div class="bg-white h-full flex items-center justify-center shadow w-72 rounded-full">
                        <div
                            class="font-bold text-primary"
                        >
                            {{ replacement.response_count ?? 0 }}
                        </div>
                    </div>
                </div>
                <div>
                    <Button
                        :href="`/dashboard/replacements/detail/${replacement.id}/list`"
                    >
                        <span class="text-sm font-semibold">voir liste</span>
                    </Button>
                </div>
            </div>
        </div>

        <Dialog v-model:open="periodDialog">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle class="text-xl font-semibold text-primary">
                        Période de remplacement
                    </DialogTitle>
                </DialogHeader>
                <div class="mt-3 text-sm grid grid-cols-2 items-center font-semibold text-gray-700">
                    <h5>
                        Date de début
                    </h5>
                    <h5>
                        Date de fin
                    </h5>
                </div>
                <div
                    v-for="period in periods"
                    :key="period.id"
                    class="mt-1"
                >
                    <div class="grid grid-cols-2 items-center text-sm">
                        <span>
                            {{ formatDate(period.start_date) }}
                        </span>
                        <span>
                            {{ formatDate(period.end_date) }}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <section
            v-if="groupedDetails.length > 0"
            class="mt-8 sm:mt-6 2xl:mt-12 mb-8 h-auto flex flex-col items-center space-y-8"
        >
            <div
                v-for="group in groupedDetails"
                :key="group.date"
            >
                <div class="bg-gray-100 sm:w-[28rem] lg:w-[32rem] 2xl:w-[40rem] space-y-8 sm:space-y-0 space-x-6 p-8 relative rounded-2xl">
                    <div>
                        <div>
                            <div class="h-10 flex bg-primary rounded justify-center items-center">
                                <h4 class="text-white text-sm text-center">
                                    Informations du créateur
                                </h4>
                            </div>
                            <div class="mt-4 space-y-4">
                                <div class="bg-gray-200 text-sm py-2 rounded px-3">
                                    <span>Nom : {{ replacement.user_full_name }}</span>
                                </div>
                                <div class="bg-gray-200 text-sm py-2 rounded px-3">
                                    <span>Téléphone : {{ replacement.user_phone_number }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 h-10 flex px-2 bg-primary rounded items-center">
                            <h4 class="text-white text-sm flex items-center">
                                <ClockIcon class="w-5 h-5 mr-2" />
                                <p class="w-full truncate overflow-ellipsis pr-2">
                                    {{ group.date }}
                                </p>
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

                        <div class="mt-8">
                            <div class="h-10 flex bg-primary rounded justify-center items-center">
                                <h4 class="text-white text-sm text-center">
                                    Rôle recherché
                                </h4>
                            </div>
                            <div class="mt-4 space-y-4">
                                <div class="bg-gray-200 text-sm py-2 rounded px-3">
                                    <span>{{ roles[replacement.role_type] }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-200 mt-8">
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

                        <div
                            v-if="replacement.comment"
                            class="bg-gray-200 mt-8"
                        >
                            <div class="h-10 flex bg-primary rounded justify-center items-center">
                                <h4 class="text-white text-sm text-center">
                                    Description
                                </h4>
                            </div>
                            <div class="py-4 px-3 space-y-3">
                                <div class="mt-2 space-y-4">
                                    <div class="bg-gray-200 text-sm py-2 rounded px-3">
                                        <span>{{ replacement.comment }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div
            v-if="user && replacement.user_id !== user.id && replacement.status != 'closed' && replacement.role_type == user.account_type"
            class="flex justify-center mt-12"
        >
            <div class="flex flex-row items-center space-x-[8rem]">
                <Form
                    v-if="replacement?.candidate == false"
                    class="flex justify-center"
                    @submit="submit"
                >
                    <Button
                        type="submit"
                        size="lg"
                        class="bg-primary text-white rounded-xl px-6 py-2 shadow hover:bg-primary/90 transition"
                        :disabled="isDisabled || inProgress"
                        :in-progress="inProgress"
                    >
                        Je suis intéressé(e)
                    </Button>
                </Form>

                <div
                    v-else
                    class="flex items-center gap-2 text-success font-semibold"
                >
                    <CheckCircleIcon class="w-6 h-6" />
                    <span>Réponse envoyée</span>
                </div>

                <div
                    v-if="isAdminOfReplacementGroup"
                    class="flex justify-center"
                >
                    <Button
                        size="lg"
                        class="bg-primary text-white rounded-xl px-6 py-2 shadow hover:bg-primary/90 transition"
                        @click="openAssignModal"
                    >
                        Assigner un remplaçant
                    </Button>
                </div>
            </div>
        </div>

        <Dialog v-model:open="isAssignModalOpen">
            <DialogContent class="bg-white p-6 rounded-xl max-w-md w-full shadow-xl">
                <DialogHeader class="text-lg font-semibold mb-4">
                    <DialogTitle>
                        Assigner un remplaçant
                    </DialogTitle>
                </DialogHeader>

                <p class="text-sm text-gray-500 mb-4">
                    Cliquez sur un membre pour l'assigner comme remplaçant.
                </p>

                <ul class="space-y-2 max-h-80 overflow-y-auto">
                    <template v-if="groupMembers.length > 0">
                        <li
                            v-for="member in groupMembers"
                            :key="member.id"
                            class="flex justify-between items-center border rounded p-2 hover:bg-gray-50 cursor-pointer"
                            @click="selectAndSubmitReplacement(member.user_id)"
                        >
                            <div class="flex items-center gap-2">
                                <UserIcon class="size-5 text-primary" />
                                <span>{{ member.firstname }} {{ member.lastname }}</span>
                            </div>
                            <ArrowRightIcon class="size-5 text-primary" />
                        </li>
                    </template>
                    <template v-else>
                        <li class="text-sm text-gray-400 text-center py-4">
                            Personne à affecter à ce remplacement pour le moment.
                        </li>
                    </template>
                </ul>

                <div class="flex justify-end mt-4">
                    <Button
                        variant="secondary"
                        @click="isAssignModalOpen = false"
                    >
                        Fermer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
import {
    CalendarDaysIcon,
    ClockIcon,
    HomeIcon,
    CheckCircleIcon,
} from '@heroicons/vue/24/solid';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useDetailReplacement, sendResponse } from '~/composables/useReplacements';
import { getFullName } from '~/lib/utils';

const user = useState('user');
const route = useRoute();
const replacementId = route.params.id;

const { replacement, fetchReplacement } = useDetailReplacement(replacementId);

const { isDisabled } = sendResponse();
const { isAdminGroup } = useAuth();
const { fetchGroupMembers } = useGroup();

const periodDialog = ref(false);

const periods = computed(() => replacement.value.periods || []);

const formData = reactive({
    replacementId: replacementId,
    comment: '',
});

const roles = {
    nurse: 'Infirmier(e)',
    caregiver: 'Aide soignant(e)',
    midwife: 'Sage-femme',
};

const goBack = () => {
    if (window.history.length > 1) {
        window.history.back();
    }
    else {
        navigateTo('/dashboard/replacements');
    }
};

const groupedDetails = computed(() => {
    const grouped = {};

    if (replacement.value.periods && replacement.value.periods.length > 0) {
        const periodRanges = replacement.value.periods.map(
            period => `${formatDate(period.start_date)}-${formatDate(period.end_date)}`,
        ).join(', ');
        const groupKey = 'classic';

        grouped[groupKey] = {
            date: periodRanges,
            times: new Set(),
            patients: new Set(),
            careTypes: new Set(),
            zipCodes: new Set(),
            cities: new Set(),
        };

        if (replacement.value.timeSlot) {
            const timeSlot = JSON.parse(replacement.value.timeSlot);
            if (timeSlot.morning && timeSlot.evening) {
                if (timeSlot.morning.start_at && timeSlot.morning.end_at) {
                    grouped[groupKey].times.add(`${formatTime(timeSlot.morning.start_at)}-${formatTime(timeSlot.morning.end_at)}`);
                }
                if (timeSlot.evening.start_at && timeSlot.evening.end_at) {
                    grouped[groupKey].times.add(`${formatTime(timeSlot.evening.start_at)}-${formatTime(timeSlot.evening.end_at)}`);
                }
            }
            else if (timeSlot.start_at && timeSlot.end_at) {
                grouped[groupKey].times.add(`${formatTime(timeSlot.start_at)}-${formatTime(timeSlot.end_at)}`);
            }
        }

        replacement.value.care_types.forEach(care => grouped[groupKey].careTypes.add(care.name));
        JSON.parse(replacement.value.zip_codes).forEach(zipCode => grouped[groupKey].zipCodes.add(zipCode));
        JSON.parse(replacement.value.cities).forEach(city => grouped[groupKey].cities.add(city));
    }
    else if (replacement.value.details?.length > 0) {
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

            grouped[detail.date].times.add(`${formatTime(detail.start_at)}-${formatTime(detail.end_at)}`);
            replacement.value.care_types.forEach(care => grouped[detail.date].careTypes.add(care.name));
            JSON.parse(replacement.value.zip_codes).forEach(zipCode => grouped[detail.date].zipCodes.add(zipCode));
            JSON.parse(replacement.value.cities).forEach(city => grouped[detail.date].cities.add(city));
            if (detail.patient.firstname || detail.patient.lastname) {
                grouped[detail.date].patients.add(getFullName(detail.patient));
            }
        });
    }
    else if (replacement.value.timeSlot) {
        const timeSlot = JSON.parse(replacement.value.timeSlot);
        const date = formatDate(replacement.value.start_date);
        grouped[date] = {
            date: date,
            times: new Set(),
            patients: new Set(),
            careTypes: new Set(),
            zipCodes: new Set(),
            cities: new Set(),
        };

        if (timeSlot.morning && timeSlot.evening) {
            if (timeSlot.morning.start_at && timeSlot.morning.end_at) {
                grouped[date].times.add(`${formatTime(timeSlot.morning.start_at)} - ${formatTime(timeSlot.morning.end_at)}`);
            }
            if (timeSlot.evening.start_at && timeSlot.evening.end_at) {
                grouped[date].times.add(`${formatTime(timeSlot.evening.start_at)} - ${formatTime(timeSlot.evening.end_at)}`);
            }
        }
        else if (timeSlot.start_at && timeSlot.end_at) {
            grouped[date].times.add(`${formatTime(timeSlot.start_at)}-${formatTime(timeSlot.end_at)}`);
        }

        replacement.value.care_types.forEach(care => grouped[date].careTypes.add(care.name));
        JSON.parse(replacement.value.zip_codes).forEach(zipCode => grouped[date].zipCodes.add(zipCode));
        JSON.parse(replacement.value.cities).forEach(city => grouped[date].cities.add(city));
    }
    else {
        const date = formatDate(replacement.value.start_date);
        grouped[date] = {
            date: date,
            times: new Set(),
            patients: new Set(),
            careTypes: new Set(),
            zipCodes: new Set(),
            cities: new Set(),
        };

        replacement.value.care_types.forEach(care => grouped[date].careTypes.add(care.name));
        JSON.parse(replacement.value.zip_codes).forEach(zipCode => grouped[date].zipCodes.add(zipCode));
        JSON.parse(replacement.value.cities).forEach(city => grouped[date].cities.add(city));
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
        const payload = {
            ...formData,
            respondedBy: user.value?.id ?? user.value?.id ?? null,
        };

        await sendResponse().submitResponse(payload);
    },
    {
        onSuccess: () => {
            replacement.value.candidate = true;
        },
    },
);

const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
};

const startDate = computed(() => {
    return replacement.value.start_date ? formatDate(replacement.value.start_date) : '';
});

const endDate = computed(() => {
    return replacement.value.end_date ? formatDate(replacement.value.end_date) : '';
});

await fetchReplacement();

const isAdminOfReplacementGroup = computed(() => {
    if (!replacement.value?.group_ids) return false;

    return replacement.value.group_ids.some(groupId => isAdminGroup(groupId));
});

const groupMembers = ref([]);
const isAssignModalOpen = ref(false);
const selectedMemberId = ref(null);

const openAssignModal = async () => {
    if (!replacement.value?.group_ids) return;

    const members = await fetchGroupMembers(replacement.value.group_ids);

    const userNurseId = user.value?.id ?? null;
    const replacementUserId = replacement.value?.user_id ?? null;

    const filteredMembers = members.filter(member =>
        member.user_id !== userNurseId && member.user_id !== replacementUserId,
    );

    groupMembers.value = filteredMembers;

    isAssignModalOpen.value = true;
};

const selectAndSubmitReplacement = async (userId) => {
    selectedMemberId.value = userId;

    const payload = {
        ...formData,
        respondedBy: userId,
    };

    await sendResponse().submitResponse(payload);
    replacement.value.replaced_by = userId;
    isAssignModalOpen.value = false;
};

useHead({
    title: 'Détail de remplacement',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
